# [Duel Title]: [Handle A] vs [Handle B]

**Type:** Skill Duel (48-hour window)
**Disciplines:** [Discipline A] vs [Discipline B]
**XP reward:** Winner +50 · Runner-up +20
**Scoring:** Correctness 40 · Performance 30 · Style 30

## Participants

| Challenger | Handle | Discipline |
|------------|--------|------------|
| A          | @handle-a | Frontend |
| B          | @handle-b | Backend  |

## Spec

<!-- Describe the head-to-head challenge. Both participants solve the same problem. -->

### Requirements

<!-- List concrete, testable requirements -->
- Requirement 1
- Requirement 2

### Constraints

- Constraint 1
- Constraint 2

**Twist:** <!-- Optional asymmetric constraint for one challenger -->

## Submission

Each participant submits to their own folder:
- `challenges/active/[duel-slug]/submissions/[handle-a]/`
- `challenges/active/[duel-slug]/submissions/[handle-b]/`

Both PRs must be merged within the 48-hour window to count.
The AI judge scores each submission independently; highest total wins.
