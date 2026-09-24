---
trigger: always_on
---

# Git Synchronization Rule

## BEFORE every task (mandatory)

1. **Pull latest changes** from remote to get the most up-to-date files:
   ```
   git pull origin main
   ```

2. **Check if the requested change is already done** by reading the relevant files and comparing against what the user is asking for. If the change already exists:
   - Inform the user: "This change already exists in the codebase."
   - Do NOT re-apply it.
   - Only proceed if the change is genuinely missing or incomplete.

## AFTER every task (mandatory)

Once any code change or new feature is implemented:

1. **Stage all changes**:
   ```
   git add .
   ```

2. **Commit with a clear, descriptive message**:
   ```
   git commit -m "<type>: <short description of what changed>"
   ```
   Use conventional commit prefixes: `feat`, `fix`, `style`, `refactor`, `docs`, `chore`.

3. **Push immediately to remote**:
   ```
   git push origin main
   ```

## Rules summary
- Always pull first, always push last.
- Never push without a descriptive commit message.
- Never re-apply a change that already exists — check the file content first.
- If `git push` fails due to auth, inform the user to configure their GitHub credentials.
