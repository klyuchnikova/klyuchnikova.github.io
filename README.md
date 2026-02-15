# cyberpunk_web

---

## Project structure

### Current layout (after migration)

```
WebSignal/
├── index.html
├── news.html
├── map.html
├── contacts.html         # Fragment only (no full document)
├── styles/
│   ├── style.css        # Global base
│   ├── layout/
│   │   └── header.css
│   ├── components/
│   │   ├── glass-banner.css
│   │   ├── carousel.css
│   │   ├── carousel_card.css
│   │   └── modal_card.css
│   ├── pages/
│   │   ├── news.css
│   │   ├── map.css
│   │   └── contacts.css
│   └── cyberpunk/       # Framework (unchanged)
├── scripts/
│   ├── components/
│   │   ├── mobile-menu.js
│   │   ├── glass-banner.js
│   │   └── modal_card.js
│   └── pages/
│       ├── main.js
│       ├── news.js
│       └── map.js
└── src/images/
```

**Load order (per page):** Base → framework → layout → components (only what the page uses) → page CSS; then scripts: components → page.

---

## Components (how to use)

Reusable pieces live in their own CSS + JS (and sometimes shared HTML). Include only what the page needs.

### Glass banner

Fixed bottom strip with scrolling neon text (yellow borders, tilted parallelograms).

**Files:** `styles/components/glass-banner.css`, `scripts/components/glass-banner.js`

**Include on a page:**

1. In `<head>` after other stylesheets:
   ```html
   <link rel="stylesheet" href="styles/components/glass-banner.css">
   ```
2. Before `</body>`:
   ```html
   <script src="scripts/components/glass-banner.js"></script>
   ```
3. Place the banner markup. The script runs only when `.glass-banner` exists.

**HTML (example):**

```html
<div class="glass-banner">
    <div class="glass-banner-content">
        <div class="glass-banner-content-wrapper">
            <div class="glass-banner-original">
                <div class="glass-banner-parallelogram"></div>
                <div class="glass-banner-text">YOUR TEXT HERE</div>
                <div class="glass-banner-parallelogram"></div>
            </div>
            <div class="glass-banner-duplicate" aria-hidden="true">
                <div class="glass-banner-parallelogram"></div>
                <div class="glass-banner-text">YOUR TEXT HERE</div>
                <div class="glass-banner-parallelogram"></div>
            </div>
        </div>
    </div>
</div>
```

### Other components (same idea)

- **Header/nav:** `styles/layout/header.css` + `scripts/components/mobile-menu.js`; nav HTML is shared across pages.
- **Carousel (home):** `styles/components/carousel.css`, `styles/components/carousel_card.css`, `scripts/pages/main.js`.
- **Modal card:** `styles/components/modal_card.css`, `scripts/components/modal_card.js`; include where modals are used.
