# Branch Protection: `main`

Recommended settings for the `main` branch on GitHub. Configure these under:
**Settings → Branches → Add branch protection rule → `main`**

---

## Settings

### Require a pull request before merging
- **Enabled**: Yes
- **Required approvals**: 0
  - The `pr-router` bot handles validation and auto-merging for profile PRs. Human approval is not required.

### Require status checks to pass before merging
- **Enabled**: Yes
- **Required checks**:
  - `pr-router`
- **Require branches to be up to date before merging**: Yes

### Restrict who can push to matching branches
- **Enabled**: Yes
- **Allowed**: `@suleigolden` only

### Do not allow bypassing the above settings
- **Enabled**: Yes
  - This applies to administrators as well. No one bypasses branch protection.
