# The Pagination Problem

**Type:** Weekly Sprint (72-hour window)
**Disciplines:** All
**XP reward:** Winner +50 · All valid submissions +10
**Scoring:** Correctness 40 · Performance 30 · Style 30

## Spec

Build a cursor-based pagination API for a posts table. Must handle 1M+ rows.
No OFFSET queries. Use your declared primary language.

### Requirements

- Implement `GET /posts?cursor=<cursor>&limit=<n>` returning `{ items, nextCursor }`
- Use a stable, opaque cursor (not page numbers)
- The cursor must survive re-sorting without returning duplicates or skipping rows
- Include proper index usage — explain why your chosen column(s) are indexed
- Return a `hasMore` boolean alongside `nextCursor`

### Constraints

- No `OFFSET` or `SKIP` in any query
- Must work correctly under concurrent inserts/deletes
- `limit` must be capped at 100

**Bonus:** Add a rate-limiter without a Redis dependency.

## Submission

Path: `challenges/active/week-01-pagination/submissions/[your-handle]/`

Open a PR adding your files to that path. Include at minimum:
- `solution.<ext>` — your implementation
- `README.md` — brief explanation of your cursor strategy and index choices

The AI judge will score your submission automatically when the PR is merged.
