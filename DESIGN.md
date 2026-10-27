# Project Navigator — Design System

> Product name: **Project Navigator**. Independent student project; not affiliated
> with or endorsed by 42 School. Never use "42" as the product brand.

The interface uses the **Vibrant Peer Tech** design language: a near-white editorial
canvas, electric magenta primary, cyan secondary, Geist type, pill controls and
hairline structure. It should feel like a modern developer tool, not a school intranet.

## Design sources (Stitch)

| Item | Value |
| --- | --- |
| Stitch project | `projects/2487374441795342081` |
| Canvas | https://stitch.google.com/projects/2487374441795342081 |
| Design system | `assets/91fd018b78f6400a9dde28b788f9f142` ("Vibrant Peer Tech") |
| Landing screen | `fafb9305c5844d839cb1166034d5d4cc` |
| Explorer screen | `5796307cdb5a4b2ca15e8154a0119e59` |
| Explorer duplicates | `d203d1e1b26e4541a7b0e781097541bd`, `004242a69f0643ecb10bcc99621dcfe3` |

Screen canvas URL pattern:
`https://stitch.google.com/projects/2487374441795342081?node-id=<screen-id>`

The live implementation is the source of truth; the Stitch screens are the visual
reference used to build it.

## Tokens

Implemented as CSS custom properties in `frontend/src/index.css` and exposed to
Tailwind v4 through `@theme inline`.

### Color

| Token | Value | Use |
| --- | --- | --- |
| `--background` | `#f9f9f9` | page canvas |
| `--card` | `#ffffff` | surfaces, header, table |
| `--foreground` | `#1a1c1c` | primary text |
| `--muted-foreground` | `#6b7280` | metadata, secondary copy |
| `--border` | `#e5e7eb` | hairlines, card outlines |
| `--brand-magenta` | `#e60067` | primary CTA, active nav, XP, key highlights |
| `--brand-magenta-dark` | `#d0005c` | primary hover |
| `--brand-magenta-deep` | `#b80051` | text links on tint |
| `--brand-magenta-soft` | `#ffe7ee` | primary-tinted chips |
| `--brand-cyan` | `#00b4d8` | secondary accent, live status |
| `--brand-cyan-dark` | `#009bbf` | secondary hover |
| `--brand-cyan-soft` | `#e6f8fd` | secondary-tinted chips |
| `--surface-low` | `#f3f3f4` | expanded rows, hover rows, neutral chips |

Track chips also use small semantic tints: green (`#ecfdf3`/`#15803d`), amber
(`#fff4e5`/`#b45309`), red (`#fee2e2`/`#b91c1c`), purple (`#f3e8ff`/`#7e22ce`),
blue (`#e8f1ff`/`#1d4ed8`), pink (`#fce7f3`/`#be185d`). Keep them muted; they are
labels, not actions.

### Typography

- Family: **Geist** (Google Fonts), weights 300–700.
- Headlines: 700, tracking `-0.02em` to `-0.03em`.
- Body: 15px / 24px, regular.
- Labels: 11–13px, semibold, uppercase with `0.08em`–`0.14em` tracking for table
  headers, eyebrows and section labels.

### Shape & spacing

- Cards: 16px radius (`rounded-2xl`), 1px hairline border, no heavy shadow.
- Controls: pills (`rounded-full`) for buttons, filter controls, chips, pagination.
- Inputs: 12px radius by default; search field is a full pill.
- Page shell: max width `1280px`, 24px mobile / 48px desktop side padding.
- Rhythm: 4/8px baseline; sections separated by hairlines rather than shadows.

## Components

- **Primary button** — solid magenta pill, white semibold label, subtle hover
  `scale(1.02)` and magenta glow.
- **Secondary button** — solid cyan pill, white label, cyan glow.
- **Outline button** — white surface, hairline border, charcoal label.
- **Chips** — soft tinted pill with matching saturated text. Dismissible filter chips
  include a 12px X.
- **Search** — pill field with leading magnifier, `⌘K`/`Ctrl K` keycap, clear button.
- **Filter row** — segmented All/Solo/Group pill, rounded selects for language, track
  and sort, and a right-aligned "Clear filters" text button.
- **Table** — hairline dividers only, uppercase label headers, 2-line muted
  descriptions, magenta XP, tinted mode/language/track chips, chevron affordance.
- **Expanded row** — full-width `surface-low` panel with a 2px magenta left rule,
  "Project brief" heading, description, two-column objectives, prerequisites, track
  chips and an external subject link.
- **Footer** — hairline top border, wordmark, non-affiliation disclaimer, GitHub /
  Contribute links and a cyan "API online" status chip.

## Accessibility

- Minimum 4.5:1 contrast for body text; magenta is used on white only at large sizes
  or with dark magenta text on tint.
- All interactive icons have `aria-label`s; expandable rows expose `aria-expanded`.
- Search is keyboard reachable (`Ctrl/⌘ + K`) and `Escape` clears it.

## Implementation map

| Concern | File |
| --- | --- |
| Tokens, base styles, utilities | `frontend/src/index.css` |
| Logo mark / wordmark | `frontend/src/components/Logo.tsx` |
| Landing page | `frontend/src/components/LandingPage.tsx` |
| Hero illustration | `frontend/src/components/CurriculumGraph.tsx` |
| Explorer dashboard | `frontend/src/components/ProjectsDashboard.tsx` |
| Footer | `frontend/src/components/SiteFooter.tsx` |
| OAuth callback states | `frontend/src/components/OAuthCallback.tsx` |
| Primitives | `frontend/src/components/ui/*` |
| App title, favicon, fonts | `frontend/index.html` |
