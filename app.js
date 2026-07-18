const resources = [
  { id: 1, name: "Harbor Pantry Collective", category: "Food", address: "18 Bay Street, East Boston, MA", city: "East Boston", phone: "(617) 555-0101", website: "https://example.com/harbor-pantry", eligibility: "Open to all Boston residents. Photo ID requested, not required.", hours: "Mon, Wed, Fri: 10 AM - 3 PM" },
  { id: 2, name: "Maple Street Community Kitchen", category: "Food", address: "216 Maple Street, Roxbury, MA", city: "Roxbury", phone: "(617) 555-0102", website: "https://example.com/maple-kitchen", eligibility: "Walk-in meals for individuals and families.", hours: "Daily: 4 PM - 6 PM" },
  { id: 3, name: "Bridgeway Housing Desk", category: "Housing", address: "77 Summer Street, Downtown Boston, MA", city: "Boston", phone: "(617) 555-0103", website: "https://example.com/bridgeway-housing", eligibility: "Boston residents experiencing housing instability.", hours: "Mon - Thu: 9 AM - 5 PM" },
  { id: 4, name: "North Shore Tenant Clinic", category: "Housing", address: "52 Ocean Avenue, Revere, MA", city: "Revere", phone: "(781) 555-0104", website: "https://example.com/north-shore-tenants", eligibility: "Renters in Revere, Chelsea, and East Boston.", hours: "Tue & Thu: 12 PM - 7 PM" },
  { id: 5, name: "Commonwell Health Van", category: "Health", address: "Rotating stops in Dorchester, MA", city: "Dorchester", phone: "(617) 555-0105", website: "https://example.com/commonwell-health", eligibility: "Uninsured and underinsured adults welcome.", hours: "Tue - Sat: See weekly route" },
  { id: 6, name: "Beacon Family Counseling", category: "Health", address: "310 Beacon Road, Allston, MA", city: "Allston", phone: "(617) 555-0106", website: "https://example.com/beacon-counseling", eligibility: "Low-cost counseling for Boston-area families.", hours: "Mon - Fri: 8 AM - 7 PM" },
  { id: 7, name: "Justice Corner Legal Aid", category: "Legal Aid", address: "94 Court Street, Downtown Boston, MA", city: "Boston", phone: "(617) 555-0107", website: "https://example.com/justice-corner", eligibility: "Income-eligible Massachusetts residents.", hours: "Mon - Fri: 9 AM - 4 PM" },
  { id: 8, name: "New Start Employment Lab", category: "Jobs", address: "12 Foundry Lane, Jamaica Plain, MA", city: "Jamaica Plain", phone: "(617) 555-0108", website: "https://example.com/new-start-jobs", eligibility: "Adults seeking work, career changes, or resume support.", hours: "Mon - Sat: 10 AM - 6 PM" },
  { id: 9, name: "Harbor Youth Apprenticeships", category: "Jobs", address: "455 Seaport Boulevard, Boston, MA", city: "Boston", phone: "(617) 555-0109", website: "https://example.com/harbor-youth", eligibility: "Boston residents ages 16-24.", hours: "Mon - Fri: 11 AM - 6 PM" },
  { id: 10, name: "Bright Path Adult Learning", category: "Education", address: "81 Schoolhouse Way, Cambridge, MA", city: "Cambridge", phone: "(617) 555-0110", website: "https://example.com/bright-path", eligibility: "Adults pursuing GED, English language, or digital skills courses.", hours: "Mon - Thu: 9 AM - 8 PM" },
  { id: 11, name: "Neighborhood Family Navigator", category: "Education", address: "34 Cedar Park, Mattapan, MA", city: "Mattapan", phone: "(617) 555-0111", website: "https://example.com/family-navigator", eligibility: "Parents and caregivers of school-age children.", hours: "Wed - Sat: 10 AM - 5 PM" },
  { id: 12, name: "Open Door Benefits Support", category: "Legal Aid", address: "600 Washington Street, Chelsea, MA", city: "Chelsea", phone: "(617) 555-0112", website: "https://example.com/open-door", eligibility: "Anyone needing help with public-benefits applications.", hours: "Mon - Fri: 9:30 AM - 4:30 PM" }
];

const categoryColors = {
  Food: "#e96d4e",
  Housing: "#0a716b",
  Health: "#f4be54",
  "Legal Aid": "#587aa5",
  Jobs: "#b55c87",
  Education: "#6c8e52"
};

const state = { category: "All", keyword: "", location: "", selectedId: null };
const categoryFilters = document.querySelector("#category-filters");
const resourceList = document.querySelector("#resource-list");
const detailPanel = document.querySelector("#detail-panel");
const keywordInput = document.querySelector("#keyword");
const locationInput = document.querySelector("#location");
const resultSummary = document.querySelector("#result-summary");

function matchingResources() {
  const keyword = state.keyword.trim().toLowerCase();
  const location = state.location.trim().toLowerCase();
  return resources.filter((resource) => {
    const categoryMatch = state.category === "All" || resource.category === state.category;
    const keywordMatch = !keyword || [resource.name, resource.category, resource.eligibility].join(" ").toLowerCase().includes(keyword);
    const locationMatch = !location || [resource.city, resource.address].join(" ").toLowerCase().includes(location);
    return categoryMatch && keywordMatch && locationMatch;
  });
}

function renderFilters() {
  const categories = ["All", ...Object.keys(categoryColors)];
  categoryFilters.innerHTML = categories.map((category) => `
    <button class="filter-button" type="button" data-category="${category}" aria-pressed="${state.category === category}">
      ${category}
    </button>
  `).join("");
}

function renderResources() {
  const filtered = matchingResources();
  const countLabel = `${filtered.length} ${filtered.length === 1 ? "service" : "services"}`;
  resultSummary.textContent = filtered.length === resources.length ? `Showing all ${countLabel}` : `Showing ${countLabel}`;

  if (!filtered.some((resource) => resource.id === state.selectedId)) state.selectedId = null;

  resourceList.innerHTML = filtered.length ? filtered.map((resource) => `
    <button class="resource-card ${resource.id === state.selectedId ? "is-selected" : ""}" type="button" data-id="${resource.id}" aria-label="View details for ${resource.name}">
      <span class="category-dot" style="background:${categoryColors[resource.category]}" aria-hidden="true"></span>
      <span>
        <span class="card-category">${resource.category}</span>
        <h3>${resource.name}</h3>
        <p>${resource.city}</p>
      </span>
      <span class="card-arrow" aria-hidden="true">&#8594;</span>
    </button>
  `).join("") : `
    <div class="empty-state">
      <h3>No services found</h3>
      <p>Try another category, need, or location.</p>
    </div>
  `;
}

function renderDetails() {
  const resource = resources.find((item) => item.id === state.selectedId);
  if (!resource) {
    detailPanel.innerHTML = `
      <div class="detail-placeholder">
        <span class="placeholder-symbol" aria-hidden="true">+</span>
        <h3>Choose a service</h3>
        <p>Open a listing to see contact details, hours, and eligibility.</p>
      </div>
    `;
    return;
  }

  detailPanel.innerHTML = `
    <article class="detail-content">
      <div class="detail-topline">
        <div>
          <p class="detail-category">${resource.category}</p>
          <h3>${resource.name}</h3>
        </div>
        <button class="detail-close" type="button" aria-label="Close resource details">&#215;</button>
      </div>
      <p class="detail-address">${resource.address}</p>
      <dl class="detail-meta">
        <div><dt>Phone</dt><dd><a href="tel:${resource.phone.replace(/[^\d+]/g, "")}">${resource.phone}</a></dd></div>
        <div><dt>Website</dt><dd><a href="${resource.website}" target="_blank" rel="noreferrer">Visit service website</a></dd></div>
        <div><dt>Eligibility</dt><dd>${resource.eligibility}</dd></div>
        <div><dt>Hours</dt><dd>${resource.hours}</dd></div>
      </dl>
    </article>
  `;
}

function render() {
  renderFilters();
  renderResources();
  renderDetails();
}

categoryFilters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  state.category = button.dataset.category;
  render();
});

resourceList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-id]");
  if (!button) return;
  state.selectedId = Number(button.dataset.id);
  render();
  if (window.innerWidth < 761) detailPanel.scrollIntoView({ behavior: "smooth", block: "start" });
});

detailPanel.addEventListener("click", (event) => {
  if (!event.target.closest(".detail-close")) return;
  state.selectedId = null;
  render();
});

keywordInput.addEventListener("input", (event) => { state.keyword = event.target.value; render(); });
locationInput.addEventListener("input", (event) => { state.location = event.target.value; render(); });

document.querySelector("#clear-filters").addEventListener("click", () => {
  state.category = "All";
  state.keyword = "";
  state.location = "";
  state.selectedId = null;
  keywordInput.value = "";
  locationInput.value = "";
  render();
});

render();