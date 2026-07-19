export type ResourceCategory =
  | "Food"
  | "Housing"
  | "Health"
  | "Legal Aid"
  | "Jobs"
  | "Education";

export interface Resource {
  id: number;
  name: string;
  category: ResourceCategory;
  address: string;
  city: string;
  phone: string;
  website: string;
  eligibility: string;
  hours: string;
}