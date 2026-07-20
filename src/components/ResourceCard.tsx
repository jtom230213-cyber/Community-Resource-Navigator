import type { Resource } from "../types";

interface ResourceCardProps {
  accentColor: string;
  isSelected: boolean;
  resource: Resource;
  onSelect: (resourceId: number) => void;
}

export function ResourceCard({ accentColor, isSelected, resource, onSelect }: ResourceCardProps) {
  return (
    <li>
      <button className={`resource-card ${isSelected ? "is-selected" : ""}`} type="button" onClick={() => onSelect(resource.id)} aria-label={`View details for ${resource.name}`} aria-current={isSelected ? "true" : undefined}>
        <span className="category-dot" style={{ background: accentColor }} aria-hidden="true" />
        <span><span className="card-category">{resource.category}</span><span className="card-title">{resource.name}</span><span className="card-city">{resource.city}</span></span>
        <span className="card-arrow" aria-hidden="true">&rarr;</span>
      </button>
    </li>
  );
}