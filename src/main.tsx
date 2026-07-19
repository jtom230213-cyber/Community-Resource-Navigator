import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, useSearchParams } from "react-router-dom";
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

        <section className="search-panel" aria-label="Search resources">
          <div className="search-field">
            <label htmlFor="keyword">What do you need?</label>
            <input id="keyword" name="keyword" type="search" placeholder="Try food, housing, jobs..." autoComplete="off" value={keyword} onChange={(event) => setKeyword(event.target.value)} />
          </div>
          <div className="location-field">
            <label htmlFor="city">Location</label>
            <input id="city" name="city" type="search" placeholder="Neighborhood or city" autoComplete="off" value={city} onChange={(event) => updateFilters(selectedCategory, event.target.value)} />
          </div>
          <button className="clear-button" type="button" onClick={() => { setKeyword(""); updateFilters(); }}>Clear</button>
        </section>

        <section className="directory" aria-labelledby="directory-title">
          <div className="directory-heading">
            <div><p className="eyebrow">Explore services</p><h2 id="directory-title">Find what fits</h2></div>
            <p className="result-summary" aria-live="polite">{filteredResources.length === resources.length ? `Showing all ${countLabel}` : `Showing ${countLabel}`}</p>
          </div>

          <div className="filter-row" aria-label="Resource categories">
            <button className="filter-button" type="button" aria-pressed={!selectedCategory} onClick={() => updateFilters(undefined, city)}>All</button>
            {categories.map((category) => <button className="filter-button" type="button" key={category} aria-pressed={selectedCategory === category} onClick={() => updateFilters(category, city)}>{category}</button>)}
          </div>

          <div className="directory-layout">
            <div className="resource-list" aria-live="polite">
              {status === "loading" && <div className="state-panel"><h3>Loading services</h3><p>Preparing the local directory.</p></div>}
              {status === "error" && <div className="state-panel state-panel-error"><h3>We could not load services</h3><p>Please try again.</p><button className="retry-button" type="button" onClick={() => setStatus("loading")}>Retry</button></div>}
              {status === "ready" && filteredResources.length === 0 && <div className="empty-state"><h3>No services found</h3><p>Try another category, need, or location.</p></div>}
              {status === "ready" && filteredResources.map((resource) => <button className={`resource-card ${resource.id === selectedId ? "is-selected" : ""}`} type="button" key={resource.id} onClick={() => setSelectedId(resource.id)} aria-label={`View details for ${resource.name}`}>
                <span className="category-dot" style={{ background: categoryColors[resource.category] }} aria-hidden="true" />
                <span><span className="card-category">{resource.category}</span><span className="card-title">{resource.name}</span><span className="card-city">{resource.city}</span></span>
                <span className="card-arrow" aria-hidden="true">&rarr;</span>
              </button>)}
            </div>

            <aside className="detail-panel" aria-live="polite">
              {!selectedResource && <div className="detail-placeholder"><span className="placeholder-symbol" aria-hidden="true">+</span><h3>Choose a service</h3><p>Open a listing to see contact details, hours, and eligibility.</p></div>}
              {selectedResource && <article className="detail-content">
                <div className="detail-topline"><div><p className="detail-category">{selectedResource.category}</p><h3>{selectedResource.name}</h3></div><button className="detail-close" type="button" aria-label="Close resource details" onClick={() => setSelectedId(null)}>&times;</button></div>
                <p className="detail-address">{selectedResource.address}</p>
                <dl className="detail-meta"><div><dt>Phone</dt><dd><a href={`tel:${selectedResource.phone.replace(/[^\d+]/g, "")}`}>{selectedResource.phone}</a></dd></div><div><dt>Website</dt><dd><a href={selectedResource.website} target="_blank" rel="noreferrer">Visit service website</a></dd></div><div><dt>Eligibility</dt><dd>{selectedResource.eligibility}</dd></div><div><dt>Hours</dt><dd>{selectedResource.hours}</dd></div></dl>
              </article>}
            </aside>
          </div>
        </section>
      </main>
      <footer><span>Harbor Help Directory</span><span>Day 2 React prototype with fictional services</span></footer>
    </>
  );
}

createRoot(document.getElementById("root")!).render(<BrowserRouter><Directory /></BrowserRouter>);