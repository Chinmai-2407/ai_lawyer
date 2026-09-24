---
trigger: always_on
---

# Git Synchronization Rule

- **Pull before modifying**: Before starting tasks or making code modifications, ensure local state is synchronized with remote by running `git pull origin main`.
- **Commit and Push after changes**: Whenever code changes or new features are implemented, stage them, commit with a clear descriptive message, and push immediately to `origin main` (`git push origin main`).
