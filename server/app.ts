import express, { type NextFunction, type Request, type Response } from "express";
import { z } from "zod";
import resources from "../src/data/resources.json";
import type { Resource } from "../src/types";

const categories = ["Food", "Housing", "Health", "Legal Aid", "Jobs", "Education"] as const;

const categoryQuery = z.enum(["food", "housing", "health", "legal-aid", "jobs", "education"]);
const resourceQuerySchema = z.object({
  category: categoryQuery.optional(),
  city: z.string().trim().min(1).max(100).optional(),
  keyword: z.string().trim().min(1).max(100).optional(),
});
const resourceIdSchema = z.coerce.number().int().positive();

const categoryLabels: Record<z.infer<typeof categoryQuery>, Resource["category"]> = {
  food: "Food",
  housing: "Housing",
  health: "Health",
  "legal-aid": "Legal Aid",
  jobs: "Jobs",
  education: "Education",
};

const directoryResources = resources as Resource[];

function normalize(value: string) {
  return value.toLocaleLowerCase();
}

function matchesKeyword(resource: Resource, keyword: string) {
  const searchableFields = [
    resource.name,
    resource.category,
    resource.address,
    resource.city,
    resource.eligibility,
  ];

  return searchableFields.some((field) => normalize(field).includes(keyword));
}

export const app = express();

app.get("/resources", (request, response, next) => {
  const parsedQuery = resourceQuerySchema.safeParse(request.query);

  if (!parsedQuery.success) {
    return next(parsedQuery.error);
  }

  const { category, city, keyword } = parsedQuery.data;
  const normalizedCity = city ? normalize(city) : undefined;
  const normalizedKeyword = keyword ? normalize(keyword) : undefined;

  const matchingResources = directoryResources.filter((resource) => {
    if (category && resource.category !== categoryLabels[category]) {
      return false;
    }

    if (normalizedCity && normalize(resource.city) !== normalizedCity) {
      return false;
    }

    return !normalizedKeyword || matchesKeyword(resource, normalizedKeyword);
  });

  return response.json(matchingResources);
});

app.get("/resources/:id", (request, response, next) => {
  const parsedId = resourceIdSchema.safeParse(request.params.id);

  if (!parsedId.success) {
    return next(parsedId.error);
  }

  const resource = directoryResources.find((item) => item.id === parsedId.data);

  if (!resource) {
    return response.status(404).json({ error: "Resource not found" });
  }

  return response.json(resource);
});

app.get("/categories", (_request, response) => {
  return response.json(categories);
});

app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
  if (error instanceof z.ZodError) {
    return response.status(400).json({
      error: "Invalid request parameters",
      details: z.treeifyError(error),
    });
  }

  return response.status(500).json({ error: "Unexpected server error" });
});