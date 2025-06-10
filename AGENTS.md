# Codex Contribution Guide

This file provides guidance for running Codex in the `chat-frontier-flora` repository.

## Project Overview
- Cross-platform chat application using Expo, React Native Web, and Supabase.
- Node.js >= 18.18 required. Repo uses monorepo workspaces (`apps/` and `packages/`).
- Tests use the Stagehand framework with Playwright.
- Python tools exist for OpenAI integration (see `requirements.txt`).

## Recommended Startup
Run `./scripts/setup-codex.sh` from the repository root. It:
1. Installs Node 18 via `nvm` if necessary.
2. Runs `npm install` to install workspace dependencies.
3. Installs Playwright browsers (network access required; the script continues if this fails).
4. Installs Python requirements if `requirements.txt` exists.
5. Runs `npm run status:check` and `./scripts/verify-test-status.sh` to verify environment configuration.

## Testing
- Execute `npm run test:safe` to run Stagehand E2E tests after verification.
- `scripts/verify-test-status.sh` checks that environment variables like `OPENAI_API_KEY` are set and ensures only the Stagehand test files run.
- Quarantined tests live in `e2e/quarantined-playwright-tests`; do not run them.

## Environment Files
- A `.env` file exists in the project root. Verify with `ls -la | grep env`.
- During builds it is copied to `apps/web/.env` automatically.
- See `docs/PROJECT_CONTEXT.md` and `docs/ENVIRONMENT_FILE_CHECKLIST.md` for details.

## Development Workflow
- Always run Expo from `apps/web` (`cd apps/web && npm run web`).
- Follow the step-by-step workflow in `docs/DEVELOPMENT_WORKFLOW_CHECKLIST.md` before creating a pull request.
- Preview deploys are required before merging to `main`.

## Codex Environment Notes
- The container is ephemeral and resets for each session.
- You have root access but network connectivity may be limited; use the startup script to install dependencies early.
- Keep the git worktree clean and commit frequently.
- Consult `docs/CURRENT_TEST_INVENTORY.md` to understand current test coverage.

