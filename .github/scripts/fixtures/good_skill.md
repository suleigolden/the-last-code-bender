# Skills

## TypeScript

I work with TypeScript daily and rely heavily on strict mode to catch errors at compile
time. I lean into utility types (`Partial`, `Pick`, `Record`) and write generic
components and hooks to avoid `any` creeping into the codebase.

## React

My primary framework. I build component trees with a clear separation between smart
(data-fetching) and presentational components. I use `useMemo` and `useCallback`
deliberately, profiling first before optimising. Custom hooks are my preferred way to
share non-visual logic.

## Vite

Day-to-day I use Vite for local development and production bundling. I configure
`resolve.alias` for clean path imports, leverage HMR extensively, and have set up
environment-variable typing via `vite-env.d.ts`.

## Node.js

I use Node for tooling scripts, lightweight API proxies, and build pipelines. Comfortable
with the module system (both ESM and CJS) and writing async/await-based scripts.

## Functional Patterns

I prefer immutable data flows — spreading objects rather than mutating, mapping over
arrays rather than pushing. This keeps components predictable and makes state bugs easier
to trace.
