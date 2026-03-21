# Challenges

This directory contains all challenge submissions and specs for The Last Code Bender.

## Structure

```
challenges/
├── active/          # Currently open challenges
│   └── week-01-pagination/
│       ├── CHALLENGE.md         # Spec and scoring criteria
│       └── submissions/
│           └── [your-handle]/   # Your submission folder
├── completed/       # Archived challenges with results
└── templates/       # Templates for new challenges
```

## How to Submit

1. Find an open challenge under `challenges/active/`
2. Read the `CHALLENGE.md` in that folder carefully
3. Create a folder at `challenges/active/<challenge-slug>/submissions/<your-github-handle>/`
4. Add your solution files inside that folder
5. Open a PR — the AI judge will automatically score your submission when merged

## Scoring

Each submission is scored by an AI judge across three dimensions:

| Dimension   | Weight |
|-------------|--------|
| Correctness | /40    |
| Performance | /30    |
| Style       | /30    |
| **Total**   | **/100** |

- Submissions scoring **≥ 40** receive **+10 XP**
- The top-scoring submission for each challenge receives **+50 XP** and a challenge win

## Challenge Types

| Type           | Duration  | Description                              |
|----------------|-----------|------------------------------------------|
| Weekly Sprint  | 72 hours  | Focused coding problem open to all       |
| Monthly        | 30 days   | Larger project-style challenge           |
| Skill Duel     | 48 hours  | Head-to-head between two CodeBenders     |
| Relay          | Ongoing   | Sequential contributions build one thing |

## Creating a New Challenge

Use one of the templates in `challenges/templates/` and open a PR.
