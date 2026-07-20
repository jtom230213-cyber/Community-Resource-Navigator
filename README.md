# Harbor Help Directory

> A calm, accessible starting point for finding local support.

Harbor Help Directory is the Day 3 React component and accessibility pass in a 30-day Community Resource Navigator roadmap. It is a responsive, client-side directory that helps people quickly browse fictional local services for food, housing, health, legal aid, jobs, and education.

The project focuses on the essential public-facing experience: make support information easier to scan, filter, and act on when someone needs practical next steps.

![Harbor Help Directory desktop view](assets/screenshots/harbor-help-desktop.png)

<p align="center">
	<img src="assets/screenshots/harbor-help-mobile.png" alt="Harbor Help Directory mobile view" width="280" />
</p>

## Target users

- Residents who need reliable starting points for food, housing, health, legal aid, jobs, or education.
- Community organizers who want a simple model for presenting local listings.

## Problem statement

Support information is often scattered across outdated pages and difficult to scan under pressure. Harbor Help groups a small fictional service directory into clear categories, lets visitors narrow listings by need and location, and keeps contact details in a focused resource view.

## Features

- 12 fictional Boston-area resource listings.
- Live keyword search and URL-driven category and city filters.
- Category filters for Food, Housing, Health, Legal Aid, Jobs, and Education.
- Focused resource-detail view with address, phone, website, eligibility, and hours.
- Loading, empty, and error-style states for the directory surface.
- Responsive desktop and mobile layouts.
- Reusable, typed search, filter, resource-card, and resource-detail components.
- Visible keyboard focus states, labelled controls, semantic result lists, and live result updates.

## Built with

- React
- TypeScript
- Vite
- React Router
- Modern CSS

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Create a production bundle with:

```bash
npm run build
```

## URL filters

Category and city are stored in the URL, so a filtered directory view can be shared or refreshed without losing context.

```text
/?category=food&city=Boston
```

The accepted categories are `food`, `housing`, `health`, `legal-aid`, `jobs`, and `education`.

## Project structure

```text
.
|- index.html                 # Vite entry point
|- src/
|  |- data/resources.json     # Typed local seed data
|  |- main.tsx                # React directory experience
|  |- styles.css              # Responsive visual design
|  `- types.ts                # Resource contract
|- package.json               # Vite development commands
`- assets/screenshots/        # README previews
```

## Resource data model

| Field | Description |
| --- | --- |
| `id` | Unique numeric identifier |
| `name` | Public service name |
| `category` | Service type, such as Food or Housing |
| `address` | Public location or service area |
| `phone` | Contact phone number |
| `website` | Public service URL |
| `eligibility` | Who can use the service |
| `hours` | Operating hours |

All data in this prototype is fictional. The seed records live in [src/data/resources.json](src/data/resources.json).

## Component inventory

| Component | Responsibility |
| --- | --- |
| `SearchBar` | Collects keyword and location input, and clears active search terms. |
| `FilterPanel` | Presents category filters with an announced selected state. |
| `ResourceCard` | Displays one matching resource and selects its detail view. |
| `ResourceDetail` | Presents the selected service's full contact and eligibility information. |

## Accessibility checklist

- [x] Every search field has a visible, programmatic label.
- [x] Interactive controls have high-visibility keyboard focus states.
- [x] Category filters expose their selected state with `aria-pressed`.
- [x] Search-result counts and detail changes use polite live regions.
- [x] Search results use semantic list markup and the selected result is identified with `aria-current`.
- [x] Color is not the only category indicator; resource cards include text category labels.

## Roadmap context

Day 1 established the static directory experience. Day 2 recreated that public flow with React, typed local data, and URL-driven filters. Day 3 extracts the core components and completes an accessibility pass. Later milestones add APIs and persistent data, introduce organizer workflows, and explore AI-assisted resource maintenance.
