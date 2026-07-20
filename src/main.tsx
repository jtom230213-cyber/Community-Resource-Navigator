import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, useSearchParams } from "react-router-dom";
import { FilterPanel } from "./components/FilterPanel";
import { ResourceCard } from "./components/ResourceCard";
import { ResourceDetail } from "./components/ResourceDetail";
import { SearchBar } from "./components/SearchBar";
import resourceData from "./data/resources.json";
import type { Resource, ResourceCategory } from "./types";
import "./styles.css";

const resources = resourceData as Resource[];
const categoryColors: Record<ResourceCategory, string> = {
  Food: "#e96d4e",
  Housing: "#0a716b",
  Health: "#f4be54",
  "Legal Aid": "#587aa5",
  Jobs: "#b55c87",
  Education: "#6c8e52",
};
const categories = Object.keys(categoryColors) as ResourceCategory[];

function slugify(value: string) {
  return value.toLowerCase().replaceAll(" ", "-");
}

function Directory() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const categoryParam = searchParams.get("category") ?? "";
  const city = searchParams.get("city") ?? "";
  const selectedCategory = categories.find((category) => slugify(category) === categoryParam);

  useEffect(() => {
    const timer = window.setTimeout(() => setStatus("ready"), 250);
    return () => window.clearTimeout(timer);
  }, []);

  const updateFilters = (nextCategory?: ResourceCategory, nextCity?: string) => {
    const nextParams = new URLSearchParams();
    if (nextCategory) nextParams.set("category", slugify(nextCategory));
    if (nextCity?.trim()) nextParams.set("city", nextCity.trim());
    setSearchParams(nextParams, { replace: true });
    setSelectedId(null);
  };

  const filteredResources = resources.filter((resource) => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    const categoryMatches = !selectedCategory || resource.category === selectedCategory;
    const cityMatches = !city || [resource.city, resource.address].join(" ").toLowerCase().includes(city.toLowerCase());
    const keywordMatches = !normalizedKeyword || [resource.name, resource.category, resource.eligibility]
      .join(" ")
      .toLowerCase()
      .includes(normalizedKeyword);
    return categoryMatches && cityMatches && keywordMatches;
  });

  const selectedResource = resources.find((resource) => resource.id === selectedId);
  const countLabel = `${filteredResources.length} ${filteredResources.length === 1 ? "service" : "services"}`;

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
          <p className="intro-count"><span>{resources.length}</span> services listed</p>
        </section>

        <SearchBar city={city} keyword={keyword} onCityChange={(nextCity) => updateFilters(selectedCategory, nextCity)} onClear={() => { setKeyword(""); updateFilters(); }} onKeywordChange={setKeyword} />

        <section className="directory" aria-labelledby="directory-title">
          <div className="directory-heading">
            <div><p className="eyebrow">Explore services</p><h2 id="directory-title">Find what fits</h2></div>
            <p className="result-summary" aria-live="polite">{filteredResources.length === resources.length ? `Showing all ${countLabel}` : `Showing ${countLabel}`}</p>
          </div>

          <FilterPanel categories={categories} selectedCategory={selectedCategory} onSelectCategory={(category) => updateFilters(category, city)} />

          <div className="directory-layout">
            <ul className="resource-list" aria-live="polite" aria-label="Matching services">
              {status === "loading" && <li className="state-panel"><h3>Loading services</h3><p>Preparing the local directory.</p></li>}
              {status === "error" && <li className="state-panel state-panel-error"><h3>We could not load services</h3><p>Please try again.</p><button className="retry-button" type="button" onClick={() => setStatus("loading")}>Retry</button></li>}
              {status === "ready" && filteredResources.length === 0 && <li className="empty-state"><h3>No services found</h3><p>Try another category, need, or location.</p></li>}
              {status === "ready" && filteredResources.map((resource) => <ResourceCard accentColor={categoryColors[resource.category]} isSelected={resource.id === selectedId} key={resource.id} resource={resource} onSelect={setSelectedId} />)}
            </ul>

            <aside className="detail-panel" aria-live="polite" aria-label="Resource details"><ResourceDetail resource={selectedResource} onClose={() => setSelectedId(null)} /></aside>
          </div>
        </section>
      </main>
      <footer><span>Harbor Help Directory</span><span>Day 3 component and accessibility pass with fictional services</span></footer>
    </>
  );
}

createRoot(document.getElementById("root")!).render(<BrowserRouter><Directory /></BrowserRouter>);