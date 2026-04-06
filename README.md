# Personalized Search Demo

A side-by-side search experience that demonstrates Athos Commerce personalization in action. Two shopper personas run identical queries against the same catalog — powered by the same API, but ranked by each shopper's unique history and behavior.

**Live demo:** https://grrilla.github.io/personalized-search-demo/

---

## What it does

- **Side-by-side results** — both panes send the same search or collection browse request, differentiated only by persona context
- **Autocomplete** — debounced suggestions via the Athos Suggest API as you type
- **Collection browsing** — 11 curated collections browsable from the header nav (New Arrivals, His, Hers, Running, Yoga, etc.)
- **Diff highlighting** — products ranked differently between the two personas get a teal border, making personalization effects immediately visible
- **Persona profile cards** — each pane shows the shopper's avatar, tagline, and lifestyle bio
- **Cache warming** — fires the Preflight API for both personas on page load and every 60 seconds to keep personalization context hot

---

## Personas

| | Morgan | Jordan |
|---|---|---|
| **Profile** | Studio & Yoga Enthusiast | Trail Runner & Outdoor Adventurer |
| **Shops for** | Leggings, dresses, skorts, yoga gear, studio wear | Joggers, outerwear, running shoes, hiking boots, trail accessories |
| **Preferred lines** | Align, Flow, Halo, Studio, Lift | Stride, Momentum, Elevation, Pivot, CoreMotion |
| **Shopper ID** | `MORGAN-STUDIO-001` | `JORDAN-OUTDOOR-001` |

Persona purchase histories were generated from the VersaWear catalog and imported into the Athos backend to seed the personalization engine. The `lastViewed` parameter is also passed on every search request to provide immediate context.

---

## Tech stack

- **[Preact](https://preactjs.com/)** + Vite — lightweight UI, ~21 KB JS bundle
- **[Athos Commerce Search API](https://docs.athoscommerce.com/reference/search-result-pages)** — search, collection browse, suggest, preflight
- **[DiceBear](https://www.dicebear.com/)** — illustrated persona avatars
- **GitHub Pages** — static deploy via GitHub Actions on every push to `main`

---

## Local development

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173` (or next available port).

---

## Deployment

Pushes to `main` automatically deploy to GitHub Pages via the workflow in `.github/workflows/deploy.yml`. No manual steps required.

---

## Configuration

### Personas

Edit the `PERSONAS` array in `src/app.jsx` to change shopper IDs, `lastViewed` SKUs, or cart contents:

```js
{
  id: 'morgan',
  label: 'Morgan',
  tagline: 'Studio & Yoga Enthusiast',
  bio: '...',
  params: {
    shopper: 'MORGAN-STUDIO-001',
    lastViewed: 'SKU1,SKU2,...',
    // cart: 'SKU3,SKU4,...',
  },
}
```

### Collections nav

Edit the `NAV_COLLECTIONS` array in `src/app.jsx` to add, remove, or reorder collection links:

```js
{ handle: 'new-arrivals', label: 'New Arrivals' },
```

Collection handles come from the `collection_handle` field in search API responses.

### Site

The site ID and API base URLs are set at the top of `src/api.js`.

---

## Analytics

All search requests include `test=true` to suppress analytics reporting. This demo will not appear in production dashboards or skew search metrics.
