# Incredible Kinnaur Holidays — Static Multi-Page Site

Reference: https://www.incrediblekinnaurholidays.com/

## Pages
| File | Purpose |
|------|---------|
| `index.html` | Home — hero, features, popular packages, destinations, reviews, CTA |
| `about.html` | About — story, check-list, stats, quote band |
| `packages.html` | Tour Packages — filter tabs + 6 package cards |
| `package-detail.html` | Single tour — gallery, tabbed info, sticky booking card |
| `gallery.html` | Photo gallery — filterable masonry grid |
| `blog.html` | Travel blog — post list |
| `contact.html` | Contact form + details + map placeholder |
| `plan-trip.html` | Custom quote lead page |

## Structure
```
Operator Website/
├── *.html                 # 8 pages (header/footer inlined per page)
├── css/
│   ├── variables.css      # design tokens
│   ├── base.css           # reset, typography, helpers
│   ├── components.css     # buttons, cards, badges, chips, avatars
│   ├── main.css           # header/hero/home sections + responsive
│   └── pages.css          # inner-page components (tabs, filters, blog, contact…)
├── js/
│   ├── site.js            # SHARED: nav active/toggle, filters, tabs, gallery swap
│   └── main.js            # home data + card rendering
├── partials/
│   ├── header.html        # reference source for the shared header
│   └── footer.html        # reference source for the shared footer
└── assets/
    ├── logo/logo.svg
    └── images/*.jpg        # real photos
```

## Why header/footer are inlined (not fetch-included)
Opening via `file://` blocks `fetch()`, so partials can't be injected client-side
without a server. Header + footer are therefore **pasted into each page**.
`partials/header.html` / `partials/footer.html` are the single source of truth —
edit them, then propagate to every page (or just serve + switch to includes later).

## Run
Double-click `index.html`, or serve: `python -m http.server` → http://localhost:8000

## Interactions (all in `js/site.js`, zero dependencies)
- Active nav link — set by `<body data-page="...">`
- Mobile hamburger menu
- Filter tabs — `[data-filter-group="#target"]` + items with `[data-cat]`
- Detail tabs — `[data-tabs]` + panels `[data-panel]`
- Gallery thumb → main swap — `#galleryMain` + `.gallery-thumbs img`

## Editing content
- Home cards: `js/main.js` (`packages`, `destinations`, `reviews` arrays)
- Package list / blog / gallery: static markup in the respective `.html`
- Add `img` field per data item to swap images

## Images in use
hero-kinnaur-valley, kalpa-village, sangla-valley, mirror-lake, kaza-spiti,
temple-peak, chitkul-village, chandratal-lake (all `assets/images/*.jpg`).
`placeholder.svg` kept as fallback.
