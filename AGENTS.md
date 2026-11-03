# Splitwise Demo – Agent Context

Implementation guide for coding agents changing **splitwise-demo**. Product pitch and user-facing install: [`README.md`](README.md). Component folder/CSS conventions: [`COMPONENT_DESIGN_GUIDE.md`](COMPONENT_DESIGN_GUIDE.md).

---

## Orientation

| Question | Answer |
| -------- | ------ |
| What is this? | Interview demo: Splitwise-style expense tracker (React SPA) |
| Source | `src/` — components, database, services, utils |
| Toolchain | npm + `package-lock.json` (Vite + TypeScript) |
| Node | **18+** (Vite 7 / modern tooling; prefer current LTS) |
| Tests | None today — do not invent a full suite in drive-by PRs unless asked |
| Secrets | None required; never commit API keys or real OAuth client secrets if added later |

```text
.
├── .github/                 # CODEOWNERS, dependabot, thin CI (when present on main)
├── public/
├── src/
│   ├── components/          # HomePage, GroupDetailsPage, common/
│   ├── database/            # models, Database<T>, LocalStorageDatabase
│   ├── services/            # user / group / payment / balance / database facades
│   ├── utils/               # currency, datetime
│   ├── App.tsx              # Router: `/`, `/group/:groupId`
│   └── main.tsx
├── COMPONENT_DESIGN_GUIDE.md
├── package.json
├── vite.config.ts
├── README.md                # Marketing / user docs
└── AGENTS.md                # This file
```

Shared CI: [`danielnachumdev/actions`](https://github.com/danielnachumdev/actions) (`@latest` on the thin workflow when adopted). How to adopt: [`HOW-TO-USE.md`](https://github.com/danielnachumdev/actions/blob/latest/HOW-TO-USE.md).

---

## Develop

```bash
npm install
npm run dev       # http://localhost:5173
npm run lint
npm run build     # tsc -b && vite build → dist/
npm run preview
```

| Task | Command |
| ---- | ------- |
| Dev server | `npm run dev` |
| Typecheck + prod build | `npm run build` |
| Lint | `npm run lint` |

### Dependencies (high level)

- **Runtime:** `react` / `react-dom`, `react-router-dom`, `@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`
- **Tooling:** `vite`, `@vitejs/plugin-react`, `typescript`, `eslint` + `typescript-eslint`, optional `tailwindcss` / `postcss` / `autoprefixer` (present in lockfile but **not** integrated into styles today)
- Prefer editing `package.json` and regenerating with `npm install`. Dependabot labels npm / actions PRs with `noBump` when configured.

---

## Code style & domain notes

- Follow [`COMPONENT_DESIGN_GUIDE.md`](COMPONENT_DESIGN_GUIDE.md): functional components, explicit props interfaces, folder + `ComponentName.css` when styling is non-trivial, business logic in **services** not components.
- **Storage:** all persistence goes through `Database<T>` (`src/database/Database.ts`) and `localStorageDatabase` (`LocalStorageDatabase.ts`). Domain ops use `databaseService` + `*Service` objects exported from `src/services/index.ts`. Do not read/write `localStorage` ad hoc from UI.
- **Models:** `User`, `Group`, `UserGroup`, `Payment`, `PaymentParticipant`, `UserBalance` in `src/database/models.ts`.
- **Demo auth:** `HomePage` hardcodes `DEMO_USER_ID = 'demo-user-123'`. There is no seeded “sample trip” dataset — empty LocalStorage means empty UI until the user creates groups/payments.
- **BalanceService:** `recalculateGroupBalances` and `getGroupDebtBreakdown` currently throw `Not implemented yet`. Do not pretend they work in README or UI copy.
- **Routes:** `/` → `HomePage`; `/group/:groupId` → `GroupDetailsPage`.
- Keep MUI + component CSS as the styling path unless a dedicated PR adopts Tailwind for real (config + imports).
- Do not rewrite onto a new framework or add a backend in drive-by changes; match the existing SPA + LocalStorage shape.

---

## PRs, CI, and releases

1. Branch off `main`; open a PR into `main`.
2. Attach **exactly one** semver label: `noBump` | `bumpPatch` | `bumpMinor` | `bumpMajor`.
3. **CI** (when `.github/workflows/ci.yml` is on the default branch) — thin orchestrator calls `danielnachumdev/actions` **`@latest`**: `ci.yml` + `semver-ci.yml`. Prefer required checks **`CI / CI`** and **`Semver / Semver`**.
4. Dependabot PRs stay on `noBump`.
5. Change shared CI/semver behavior in **`danielnachumdev/actions`**, not by re-vendoring here.
6. This repo is a **demo SPA** — no PyPI/npm publish CD; version in `package.json` is scaffold (`0.0.0`).

### Repo gates (when HOW-TO workflows land)

- `.github/CODEOWNERS` — `@danielnachumdev`
- Dependabot weekly for npm and github-actions with `noBump`
- Prefer private vulnerability reporting via GitHub Security Advisories

---

## Sensitive / ignored

Do not commit: `.env`, API keys, OAuth client secrets, `node_modules/`, `dist/`. Track `package-lock.json`. Respect `.gitignore`.
