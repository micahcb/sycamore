# LordIcon Instructions

Use this doc when adding or changing Lordicon usage in the budget app frontend. We use **Lordicon** for all icons (animated, themable).

---

## 1. Package & component

- **Package**: `@lordicon/element` (see `frontend/package.json`).
- **Do not use** `@lordicon/react` or the `Player` component; this project uses the **element** API only.
- **Wrapper component**: `frontend/src/components/lord-icon.tsx`  
  It registers the `<lord-icon>` custom element once in the browser and exposes a React component `LordIcon` with a consistent API.

---

## 2. Import

Always use the project wrapper:

```ts
import { LordIcon } from "@/components/lord-icon";
```

Do not import from `@lordicon/element` or `@lordicon/react` in UI code.

---

## 3. Icon sources (URLs)

Icons are loaded from **Lordicon CDN** as JSON URLs.

- Browse and copy: [lordicon.com](https://lordicon.com) → pick an icon → use the **embed** URL.
- Format: `https://cdn.lordicon.com/<id>.json`

Define URLs as constants (per screen or shared):

```ts
const LORDICON_WALLET = "https://cdn.lordicon.com/ynsswhvj.json";

// Or a map for nav/sidebar:
const LORDICON = {
  home: "https://cdn.lordicon.com/ewtxwele.json",
  accounts: "https://cdn.lordicon.com/bgfqzjey.json",
  transactions: "https://cdn.lordicon.com/hnzvpwtz.json",
  logout: "https://cdn.lordicon.com/ggirnlzk.json",
} as const;
```

---

## 4. LordIcon props (API)

| Prop        | Type     | Default   | Description |
|------------|----------|-----------|-------------|
| `src`      | `string` | required  | Icon JSON URL (CDN or path). |
| `trigger`  | `string` | `"hover"` | When to play: `"hover"`, `"click"`, `"loop"`, `"in"`, `"morph"`, `"boomerang"`, `"sequence"`, `"loop-on-hover"`. |
| `target`   | `string` | —         | CSS selector for the element that receives hover/click. When set, the icon animates when **that** element is hovered/clicked (e.g. parent button or link). |
| `size`     | `number` | `24`      | Width/height in pixels. |
| `colors`   | `string` | —         | Optional Lordicon color overrides (see Lordicon docs). |
| `className`| `string` | —         | Merged with `shrink-0 current-color` for layout and theme (e.g. `text-primary`, `text-sidebar-foreground`). |

The wrapper sets `aria-hidden="true"` on the icon. For icon-only buttons, put `aria-label` on the **button**, not on `LordIcon`.

---

## 5. Usage patterns

### In a button (icon animates when button is hovered)

Give the button an `id` and pass it to `target`:

```tsx
<Button size="lg" className="gap-2" id="home-cta-btn">
  Get started
  <LordIcon
    src={LORDICON_WALLET}
    trigger="hover"
    target="#home-cta-btn"
    size={20}
    className="text-primary-foreground"
  />
</Button>
```

### In a link (e.g. sidebar nav)

Same idea: put an `id` on the link and use it as `target`:

```tsx
<Link href="/" id="nav-home" className="...">
  <LordIcon
    src={LORDICON.home}
    trigger="hover"
    target="#nav-home"
    size={20}
    className="text-sidebar-foreground"
  />
  <span>Home</span>
</Link>
```

### Icon-only button (e.g. logout)

Use `target` with the button’s `id` and set `aria-label` on the button:

```tsx
<button type="button" id="sidebar-logout" aria-label="Log out" className="...">
  <LordIcon
    src={LORDICON.logout}
    trigger="hover"
    target="#sidebar-logout"
    size={20}
    className="text-sidebar-foreground"
  />
  <span>Log out</span>
</button>
```

### Theming (semantic colors)

Use Tailwind semantic tokens via `className` so the icon follows theme (dark/light, sidebar, etc.):

- `text-primary`, `text-primary-foreground`
- `text-sidebar-foreground`, `text-muted-foreground`
- etc.

The component already applies `current-color`, so the icon will use the text color of the context.

---

## 6. Where LordIcon is used (reference)

- **`frontend/src/components/home-landing.tsx`** – CTA button with wallet icon; `target="#home-cta-btn"`.
- **`frontend/src/components/app-sidebar.tsx`** – Nav items (home, accounts, transactions) and logout; each link/button has an `id` and is used as `target`.
- **`frontend/src/app/login/page.tsx`** – Send OTP and verify icons; constants `LORDICON_SEND`, `LORDICON_VERIFY`.

When adding new icons, follow the same pattern: constant for URL, `LordIcon` from `@/components/lord-icon`, and `target` when the trigger should be the parent control.

---

## 7. Conventions

- Use **Lordicon for all icons** in the app (per project style).
- Prefer **hover** trigger for nav and buttons; use `target` so the whole control triggers the animation.
- Use **semantic color classes** in `className` (no raw hex); see `STYLE.md` for tokens.
- Icon-only buttons: **always** give the button an `aria-label`; keep `LordIcon` as decorative (`aria-hidden` is set by the wrapper).
- Keep icon URLs in constants at the top of the file or in a shared constants module; avoid inline long URLs.

---

## 8. Wrapper implementation (for reference)

Location: `frontend/src/components/lord-icon.tsx`.

- Calls `defineElement()` from `@lordicon/element` once in the browser (guarded so it only runs once).
- Renders a `<lord-icon>` custom element with: `src`, `trigger`, `target`, `colors`, `className` (with `cn()` and base classes `shrink-0 current-color`), inline `width`/`height` from `size`, and `aria-hidden="true"`.

Do not replace this with `@lordicon/react`’s `Player` unless the whole project is migrated and STYLE.md is updated.
