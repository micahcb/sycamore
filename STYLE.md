# Style Guide

This document describes the visual and interaction design system used in the Channel3 Take Home app (frontend).

---

## Tech Stack

- **Styling**: Tailwind CSS v4 with `@theme` and CSS variables
- **Components**: shadcn/ui (Radix primitives, CVA for variants)
- **Fonts**: Geist Sans (primary), Geist Mono (monospace), loaded via Next.js `next/font/google`
- **Animations**: `tw-animate-css` for motion
- **Theme**: Dark mode by default (`className="dark"` on `<html>`)

---

## Color System

Colors are defined as OKLCH CSS variables in `globals.css` and mapped into Tailwind via `@theme inline`. Use semantic tokens, not raw hex/oklch in components.

### Semantic Tokens

| Token | Use |
|-------|-----|
| `background` / `foreground` | Page and body text |
| `card` / `card-foreground` | Cards and content surfaces |
| `primary` / `primary-foreground` | Primary actions, links, emphasis |
| `secondary` / `secondary-foreground` | Secondary surfaces and chips |
| `muted` / `muted-foreground` | De-emphasized text and backgrounds |
| `accent` / `accent-foreground` | Hover states, highlights |
| `destructive` | Errors and destructive actions |
| `border` | Borders and dividers |
| `input` | Input borders and backgrounds |
| `ring` | Focus rings |
| `popover` / `popover-foreground` | Overlays and popovers |
| `chart-1` … `chart-5` | Charts and data viz |
| `sidebar-*` | Sidebar (if used) |

### Usage in Components

- Prefer `text-foreground`, `text-muted-foreground`, `text-primary`, `text-destructive` for type.
- Use `bg-background`, `bg-card`, `bg-muted`, `bg-secondary` for surfaces.
- Borders: `border-border`; focus: `ring-ring` or theme ng utilities.
- Navbar uses opaque overrides: `text-white/90`, `text-white/50`, `border-white/10`, `hover:text-white` for contrast on dark.

---

## Typography

- **Body**: `font-sans` (Geist Sans), `antialiased` on `<body>`.
- **Headings**: Prefer `font-semibold` or `font-medium` with `tracking-tight`.
- **Scale**: Use Tailwind type scale; custom `--text-4xl` (2.25rem) is defined in theme.
- **Page title (home)**: `text-2xl font-semibold tracking-tight text-foreground`.
- **Page title (brand)**: `text-4xl font-semibold tracking-tight text-foreground`.
- **Product name (detail)**: `text-2xl font-medium` (or `md:text-3xl`), `line-clamp-2`.
- **Section labels**: `text-md font-medium text-primary`.
- **Body/copy**: `text-md text-primary` or `text-muted-foreground` where appropriate.
- **Small/labels**: `text-sm`, `text-xs` for chips and metadata.

---

## Spacing & Layout

- **Base radius**: `--radius: 0.625rem`; derived radii: `radius-sm` through `radius-4xl` (e.g. `rounded-md`, `rounded-lg`, `rounded-xl`).
- **Page layout**: `min-h-screen bg-background font-sans` on root wrapper; `main` with `mx-auto max-w-5xl px-4 py-12`.
- **Card padding**: `py-6`, content areas `px-6` (Card, CardHeader, CardContent, CardFooter).
- **Gaps**: `gap-2`, `gap-4`, `gap-6`, `gap-8` for sections; `space-y-*` for vertical stacks (e.g. `space-y-8` on product detail).
- **Navbar**: Fixed height `h-[56px]`, full width, `border-b border-white/10`, `px-4`.

---

## Components

### Buttons

- Use `Button` from `@/components/ui/button` with CVA variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`.
- Sizes: `default`, `xs`, `sm`, `lg`, `icon`, `icon-xs`, `icon-sm`, `icon-lg`.
- Shared behavior: `transition-all`, focus-visible ring, disabled opacity 50%, `rounded-md`.
- Icon buttons: `variant="ghost" size="icon"` with `aria-label`; icon color e.g. `text-muted-foreground` when secondary.

### Inputs

- Use `Input` from `@/components/ui/input`: `h-9`, `rounded-md`, `border-input`, placeholder `text-muted-foreground`, focus `border-ring` and `ring-ring/50`.
- Prefer `focus-visible:` for focus styles; support `aria-invalid` and destructive border/ring when invalid.

### Cards

- Use `Card` and subcomponents from `@/components/ui/card`: `rounded-xl border py-6 shadow-sm`, `bg-card text-card-foreground`, `gap-6`.
- **CardHeader**: grid with optional **CardAction**; **CardTitle** (leading-none, font-semibold), **CardDescription** (text-muted-foreground, text-sm).
- **CardContent** / **CardFooter**: `px-6`; footer can have `border-t` and `pt-6`.

### Skeletons

- Use `Skeleton` from `@/components/ui/skeleton`: `animate-pulse rounded-md bg-muted`.
- List skeleton: rows at `h-[57px]` to match **VirtualizedProductList** row height (57px).
- Product card skeleton: mirror ProductCard layout (image + content blocks) with `rounded-xl border border-border bg-card shadow-sm`.

---

## Product-Specific Patterns

### Product list (virtualized)

- **Row height**: 57px (`ITEM_HEIGHT`).
- **Grid**: `grid-cols-[80px_1fr_1fr]` — thumbnail column 80px, then Title, then Brand.
- **Cells**: `p-2`, `align-middle`, `whitespace-nowrap`; text cells `min-w-0 truncate`.
- **Thumbnail**: 40×40px, `rounded object-contain`; empty state `h-10 w-10 rounded bg-muted`.
- **Header**: Sticky, `bg-background`, same grid; column headers `h-10`, `font-medium`, `text-foreground`.
- **Row states**: `hover:bg-muted/50`, `data-[state=selected]:bg-muted`; `border-b` between rows (last row `border-b-0`).

### Product detail (card)

- Two-columnyout: `grid grid-cols-1 md:grid-cols-2 gap-8` (image carousel | details).
- **Image**: Container `h-96`, `bg-muted`, `object-contain`; carousel nav with `bg-background/80`, dots with `bg-primary` (active) or `bg-muted-foreground/40`.
- **Brand**: Link `text-md font-medium text-primary hover:underline`.
- **Price**: Compare-at strikethrough `text-muted-foreground`; current price `text-lg font-semibold`.
- **Sections**: Description, Key Features (list-disc), Colors (chips), Video link, Variants.
- **Chips (colors)**: `rounded-sm border border-border bg-secondary px-2 py-0.5 text-xs text-secondary-foreground`.
- **Variant options**: Available `border-border bg-secondary text-secondary-foreground`; unavailable `border-muted bg-muted text-muted-foreground`; show “(unavailable)” and optional price.

---

## Accessibility

- **Focus**: All interactive elements use `focus-visible:` ring (e.g. `focus-visible:border-ring focus-visible:ring-ring/50`); outline uses `outline-r50` at base.
- **Borders**: Base `@apply border-border outline-ring/50` on `*`.
- **ARIA**: Use `aria-label` on icon-only buttons; `aria-invalid` and `aria-current` where appropriate; list/table roles (`role="row"`, `role="cell"`, etc.) on virtualized list.
- **Carousel**: `role="region"`, `aria-roledescription="carousel"`, labeled prev/next and dot buttons.

---

## Utilities

- **Class merging**: Use `cn()` from `@/lib/utils` (clsx + tailwind-merge) for conditional or overridable classes.
- **Data attributes**: Components use `data-slot` and `data-variant` / `data-size` for styling and debugging; list rows use `data-[state=selected]` for selection.

---

## File & Structure Conventions

- **Global styles**: `app/globals.css` — Tailwind imports, `@theme`, `:root` and `.dark` variables, base layer (body, borders, outline).
- **Layout**: `app/layout.tsx` — fonts, `Navbar`, `antialiased` body, dark theme on `<html>`.
- **UI ptives**: `components/ui/*` — button, card, input, skeleton; use shadcn patterns and `cn()`.
- **Feature components**: `components/` — ProductCard, ProductListRow, VirtualizedProductList, Navbar, skeletons; use semantic tokens and spacing from this guide.

---

## Summary

- **Theme**: Dark, OKLCH-based semantic palette.
- **Fonts**: Geist Sans/Mono, antialiased.
- **Layout**: Centered `max-w-5xl` main content, consistent padding and gaps.
- **Compts**: shadcn/ui + custom product components; semantic colors, clear focus and hover states, and accessible markup.

