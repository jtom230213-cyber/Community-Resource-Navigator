import type { ResourceCategory } from "../types";

interface FilterPanelProps {
  categories: ResourceCategory[];
  selectedCategory?: ResourceCategory;
  onSelectCategory: (category?: ResourceCategory) => void;
}

export function FilterPanel({ categories, selectedCategory, onSelectCategory }: FilterPanelProps) {
  return (
    <fieldset className="filter-panel">
      <legend className="visually-hidden">Filter by service category</legend>
      <div className="filter-row">
        <button className="filter-button" type="button" aria-pressed={!selectedCategory} onClick={() => onSelectCategory()}>All</button>
        {categories.map((category) => <button className="filter-button" type="button" key={category} aria-pressed={selectedCategory === category} onClick={() => onSelectCategory(category)}>{category}</button>)}
      </div>
    </fieldset>
  );
}