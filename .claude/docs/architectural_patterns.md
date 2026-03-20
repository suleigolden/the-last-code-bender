# Architectural Patterns

## 1. IDE Chrome Pattern (Universal Layout)

Every page wraps content in a VS Code-style shell composed of four components:

```
<IDESidebar>   ← collapsible file explorer (src/components/ide/IDESidebar.tsx)
<IDETabBar>    ← editor tabs (src/components/ide/IDETabBar.tsx)
<main>         ← scrollable content area
<IDEStatusBar> ← bottom status bar (src/components/ide/IDEStatusBar.tsx)
```

The sidebar is always visible on `lg:` breakpoints and hidden by default on mobile, toggled via a menu button with an overlay backdrop. State lives in the page component (`isSidebarOpen`).

See: `src/apps/landing-page/index.tsx`, `src/apps/codebender-profile/index.tsx`

## 2. Page Component Structure

Each page under `src/apps/` follows this shape:

1. **URL params drive state** — `useParams()` extracts `codebenderId` / `section`; `useNavigate()` handles programmatic navigation
2. **Section state** — `useState` for the active section; sidebar + tab bar both read and write it
3. **Smooth scroll** — `useRef` on section containers; `handleSectionChange` scrolls to the ref
4. **Callbacks down** — `onSectionChange`, `onToggle`, `onNavigate` are passed as props to IDE chrome components

See: `src/apps/codebender-profile/index.tsx:1-80`, `src/apps/landing-page/index.tsx`

## 3. Rank Data Generation Pattern

Rank names are generated procedurally, not stored statically:

- `src/lib/ordinals.ts` — converts a number to its ordinal word form ("first", "second", … "two-hundredth")
- `src/lib/code-bender-names.ts` — builds a `Map<string, string>` keyed by normalized specialization+rank ID; uses ordinals to produce titles like "The First Frontend Bender"
- Lookup is O(1) via the map; the map is built once at module load

This pattern means adding a specialization requires only updating the specialization list and rank count in `code-bender-names.ts`.

## 4. Tailwind + shadcn/ui Component Pattern

All UI primitives live in `src/components/ui/` and follow the shadcn/ui convention:

- Each file exports a single component built on a Radix UI primitive
- Variants are defined with `class-variance-authority` (`cva`) — see `src/components/ui/button.tsx`
- Classnames are merged with `cn()` from `src/lib/utils.ts` (wraps `clsx` + `tailwind-merge`)
- Custom IDE-themed Tailwind tokens (sidebar colors, syntax highlight colors, glow animations) are defined in `tailwind.config.ts` as CSS variable references

Never write inline hex/rgb colors; use the design token classes (`bg-ide-sidebar`, `text-syntax-keyword`, etc.).

## 5. Static Content + Placeholder Fallback Pattern

Contributor profile content is static (hardcoded in component files). When a rank is unclaimed, `CodeBenderPlaceholder` renders a call-to-action instead. The `CodeBenderProfile` page decides which to render based on whether a real profile component exists for the given `codebenderId`.

See: `src/apps/codebender-profile/CodeBenderPlaceholder.tsx`, `src/apps/codebender-profile/index.tsx`

## 6. Provider Stack (App.tsx)

Providers are nested in this order at `src/App.tsx`:

```
<QueryClientProvider>   ← TanStack Query
  <TooltipProvider>     ← Radix tooltip context
    <Toaster />         ← Toast notifications (Sonner)
    <BrowserRouter>
      <Routes> …
```

TanStack Query is wired up for future API use but no active `useQuery` calls exist yet. Add queries inside page components or dedicated hooks in `src/hooks/`.

## 7. Responsive Breakpoint Convention

- Mobile-first defaults, `lg:` prefix for desktop overrides
- Sidebar width: `w-64` on desktop, full-height overlay on mobile
- Grid layouts in sections use `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- `useIsMobile()` hook (`src/hooks/use-mobile.tsx`) returns `true` below the `md` breakpoint for JS-driven responsive logic
