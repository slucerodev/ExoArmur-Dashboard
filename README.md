# ExoArmur Dashboard

Web UI for [ExoArmur-Core](https://github.com/slucerodev/ExoArmur-Core) — live visibility into governance decisions, audit streams, and replay bundles.

## What it does

- **Live audit stream** — every ActionIntent → PolicyDecision → SafetyGate → Execution with cryptographic proof
- **Replay inspection** — load any correlation ID, see the deterministic reconstruction
- **Policy decisions** — allowed vs. denied vs. queued-for-approval, with rationale
- **Feature flag view** — current state of V2 federation / control plane / operator approval

## Quick start

```bash
# 1. Start ExoArmur-Core backend (see slucerodev/ExoArmur-Core)
cd /path/to/ExoArmur-Core
docker compose up -d

# 2. Install dashboard deps
cd /path/to/ExoArmur-Dashboard
npm install

# 3. Configure backend URL
echo "NEXT_PUBLIC_EXOARMUR_API_URL=http://localhost:8000" > .env.local

# 4. Run the dev server
npm run dev
```

Open http://localhost:3000

## Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: React 19 + TailwindCSS + shadcn/ui
- **Icons**: Lucide
- **State**: React hooks (no external store yet)

## Project structure

```
dashboard/
├── src/
│   ├── app/               # Next.js App Router pages
│   ├── components/        # Reusable UI components (shadcn-based)
│   └── lib/               # API client, utilities
├── public/                # Static assets
├── next.config.ts
├── tsconfig.json
└── package.json
```

## Pairing with ExoArmur-Core

This dashboard talks to the ExoArmur-Core FastAPI backend via the V2 Visibility API. Backend must be running on the URL configured in `.env.local`. The dashboard gracefully handles empty-state responses while the backend is warming up.

## License

Apache-2.0 — same as ExoArmur-Core.
