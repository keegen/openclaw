# Workspace conventions

- **Durable notes:** prefer `notes/` in this workspace for anything you want the agent to read later (create the folder as needed).
- **Scratch:** ephemeral drafts can live in `scratch/` (create if needed).
- **Secrets:** never store API tokens or passwords in tracked files; use Render environment variables or OpenClaw credential flows instead.

When the operator asks for something recurring, consider whether `cron` or a short checklist in `notes/` is the better fit.
