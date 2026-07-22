import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, useSearchParams } from "react-router-dom";
import { FilterPanel } from "./components/FilterPanel";
import { ResourceCard } from "./components/ResourceCard";
import { ResourceDetail } from "./components/ResourceDetail";
import { SearchBar } from "./components/SearchBar";
import type { Resource, ResourceCategory } from "./types";
import "./styles.css";

const categoryColors: Record<ResourceCategory, string> = {
  Food: "#e96d4e",
  Housing: "#0a716b",
  Health: "#f4be54",
  "Legal Aid": "#587aa5",
  Jobs: "#b55c87",
  Education: "#6c8e52",
};
const categories = Object.keys(categoryColors) as ResourceCategory[];
const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3001";
const queryClient = new QueryClient();

function slugify(value: string) {
  return value.toLowerCase().replaceAll(" ", "-");
}

async function fetchResources(category: string, city: string, keyword: string, signal: AbortSignal) {
  const query = new URLSearchParams();
  if (category) query.set("category", category);
  if (city) query.set("city", city);
  if (keyword) query.set("keyword", keyword);

  const response = await fetch(`${apiBaseUrl}/resources?${query}`, { signal });
  if (!response.ok) {
    throw new Error("Unable to load services.");
  }

  return response.json() as Promise<Resource[]>;
}

function Directory() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const categoryParam = searchParams.get("category") ?? "";
  const city = searchParams.get("city") ?? "";
  const selectedCategory = categories.find((category) => slugify(category) === categoryParam);
  const resourceQuery = useQuery({
    queryKey: ["resources", categoryParam, city, keyword],
    queryFn: ({ signal }) => fetchResources(categoryParam, city, keyword.trim(), signal),
    retry: 1,
  });
  const resources = resourceQuery.data ?? [];

  const updateFilters = (nextCategory?: ResourceCategory, nextCity?: string) => {
    const nextParams = new URLSearchParams();
    if (nextCategory) nextParams.set("category", slugify(nextCategory));
    if (nextCity?.trim()) nextParams.set("city", nextCity.trim());
    setSearchParams(nextParams, { replace: true });
    setSelectedId(null);
  };

  const selectedResource = resources.find((resource) => resource.id === selectedId);
  const countLabel = `${resources.length} ${resources.length === 1 ? "service" : "services"}`;

  return (
    <>
      <header className="site-header">
        <a className="brand" href="/" aria-label="Harbor Help Directory home">
          <span className="brand-mark" aria-hidden="true">H</span>
          <span>Harbor Help</span>
        </a>
        <p className="header-note">Community resource navigator</p>
      </header>

      <main id="top">
        <section className="intro" aria-labelledby="page-title">
          <div>
            <p className="eyebrow">Boston's fictional support directory</p>
            <h1 id="page-title">A clearer path to <em>local support.</em></h1>
            <p className="intro-copy">Browse services for essentials, care, and next steps. Every listing is written for people looking for practical help today.</p>
          </div>
          <p className="intro-count"><span>{resourceQuery.isPending ? "..." : resources.length}</span> services listed</p>
        </section>

        <SearchBar city={city} keyword={keyword} onCityChange={(nextCity) => updateFilters(selectedCategory, nextCity)} onClear={() => { setKeyword(""); updateFilters(); }} onKeywordChange={setKeyword} />

        <section className="directory" aria-labelledby="directory-title">
          <div className="directory-heading">
            <div><p className="eyebrow">Explore services</p><h2 id="directory-title">Find what fits</h2></div>
            <p className="result-summary" aria-live="polite">{resourceQuery.isPending ? "Loading services" : `Showing ${countLabel}`}</p>
          </div>

          <FilterPanel categories={categories} selectedCategory={selectedCategory} onSelectCategory={(category) => updateFilters(category, city)} />

          <div className="directory-layout">
            <ul className="resource-list" aria-live="polite" aria-label="Matching services">
              {resourceQuery.isPending && <li className="state-panel"><h3>Loading services</h3><p>Retrieving the directory.</p></li>}
              {resourceQuery.isError && <li className="state-panel state-panel-error"><h3>We could not load services</h3><p>Please check that the directory API is running, then try again.</p><button className="retry-button" type="button" onClick={() => resourceQuery.refetch()}>Retry</button></li>}
              {resourceQuery.isSuccess && resources.length === 0 && <li className="empty-state"><h3>No services found</h3><p>Try another category, need, or location.</p></li>}
              {resourceQuery.isSuccess && resources.map((resource) => <ResourceCard accentColor={categoryColors[resource.category]} isSelected={resource.id === selectedId} key={resource.id} resource={resource} onSelect={setSelectedId} />)}
            </ul>

            <aside className="detail-panel" aria-live="polite" aria-label="Resource details"><ResourceDetail resource={selectedResource} onClose={() => setSelectedId(null)} /></aside>
          </div>
        </section>
      </main>
      <footer><span>Harbor Help Directory</span><span>Day 5 API-connected directory with fictional services</span></footer>
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter><Directory /></BrowserRouter>
  </QueryClientProvider>,
);