# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Enspeek web frontend (package name `conversationalaife-v2`) — a React 19 + TypeScript + Vite SPA for an AI-assisted survey/market-research platform. Users create studies, build questionnaires, publish surveys, run crosstabs, and view reports, all driven by a conversational AI agent ("Enspeek AI"). Deployed on Vercel; the backend is a separate API (`VITE_REACT_APP_API_URL`).

## Commands

```bash
npm run dev        # Vite dev server at http://localhost:5173
npm run build      # tsc -b (typecheck all project refs) then vite build
npm run lint       # ESLint over the repo
npm run preview    # preview production build
```

E2E tests (Playwright, Chromium-only by default):

```bash
npm run test:e2e                 # run against default (local) env
npm run test:e2e:ui              # Playwright UI mode
npm run test:e2e:headed          # headed browser
npm run test:e2e:all-browsers    # add firefox + webkit
npm run test:e2e:local|dev|staging|prod   # target an env (sets TEST_ENV)

npx playwright test tests/auth.signin.spec.ts        # single file
npx playwright test -g "signs in with valid OTP"     # single test by title
```

`TEST_ENV` selects the base URL (see `tests/config/environments.ts`); `BASE_URL` overrides for one-offs. When `TEST_ENV=local`, Playwright auto-starts the dev server. There is **no unit test runner** — all tests are E2E.

## Environment

- `.env` holds `VITE_REACT_APP_API_URL` (backend base URL) and `VITE_REACT_RECAPTCHA` (reCAPTCHA site key). `.env` is gitignored; toggling the target backend is done by commenting/uncommenting lines there.
- `vite.config.ts` and `Router.tsx` both have a commented-out `/enspeek/` base path — the app currently serves from `/`.

## Architecture

### Data flow: three cooperating layers

1. **`src/services/apiService.ts`** — the single axios wrapper (`apiRequest(method, url, data, responseType)`) every network call goes through. It:
   - Attaches the bearer `token` from `localStorage` (except for `AUTH_EXCLUDED_PATHS`), and refreshes it from the `access-token` response header.
   - Injects `apiToken` (from `store.user.apiToken`) into the request body for authenticated calls.
   - Centralizes response handling by the backend's `code` field (200/400/401/403/429/500) — it shows `sonner` toasts and, on 401, clears storage and redirects to `/login`. Errors that were already toasted are re-thrown tagged with `hasToast: true` so callers don't double-toast.

2. **`src/api-network/**`** — TanStack Query hooks, one folder per domain (`homepage`, `questionnaire`, `crosstab`, `report`, `publish-survey`, `admin-panel`, `auth`, `support`, `global`). Each folder typically has `query.tsx`, `mutation.tsx`, and `keys.ts`. Wrap `useQuery`/`useMutation` with the shared `query-template.tsx` / `mutation-template.tsx` helpers. **All endpoints are centralized in `src/api-network/url.ts`** as `{ endpoint, method, queryKey, mutationKey }` records — reference these instead of hardcoding paths. Path params use `:token` placeholders replaced via `.replace(":qId", id)`. Query keys come from per-domain `keys.ts` factories (e.g. `homepageKeys.studyList(selection, page)`).

3. **`src/store/**`** — Redux Toolkit. Slices are combined in `RootReducers.ts` (`user`, `question`, `trigger`, `filter`, `crosstab`, `crossTabData`, `study`, `chat`, `modal`). Dispatching `{ type: 'RESET_STORE' }` wipes all state (used on logout). `user` state is persisted to `localStorage` (base64-"encrypted" via `btoa`/`atob` in `UserSlice.ts`) and rehydrated on load. React Query owns server cache; Redux owns UI/session state — query hooks frequently `dispatch` results into slices (e.g. `useStudyList` writes into `CrosstabStudySlice`).

### Routing & auth

- `src/routes/Router.tsx` — `createBrowserRouter`. Two `/` branches: authenticated app under `Root.layout`, and auth pages (`/login`, `/userlogin`) under `Auth.layout`.
- `src/routes/ProtectedRoutes.tsx` — `<ProtectedRoute>` gates on `localStorage.token`. `reverse` redirects authed users away from login; `adminOnly` / `profileOnly` gate on role via `getUserAccessConfig`.
- **`src/config/userAccess.ts`** is the source of truth for role-based access. Login type (`admin` / `client` / `support` / `user`) maps to a capability config (admin panel access, visible admin tabs, profile access, support). Use `getUserAccessConfig(loginType, userType)` rather than checking roles inline.
- **`studyID` is passed through React Router navigation `state`, not the URL** (`navigate(route, { state: { studyID } })`, read via `useLocation().state?.studyID`). Deep-linking to a study page without that state will not have a study context. `src/config/studyNavigation.ts` computes which study nav items are visible based on questionnaire/launch flags.

### Global modal system

Modals are driven by Redux (`ModalSlice`) rather than local component state:
- `useModalController()` (`src/hooks/useModalController.ts`) exposes `openById(id, payload)` / `closeCurrentModal()`.
- `src/config/modalDefinitions.tsx` holds every modal's static config (title, icon, tone, button labels, confirmation keywords, validation messages) keyed by id.
- `src/config/modalRegistry.tsx` maps modal ids to components; `GlobalModalHost` (mounted once in `App.tsx`) renders the active modal. The registry is intentionally populated at runtime.

### AI chat (`src/api-network/global/ai-chat.tsx`)

The `useChat()` hook is the core of the conversational flow and is intricate. Key behaviors:
- Sends prompts to `studyChatbot`; responses can carry a `recallFlag` that triggers a **recall chain** (up to `MAX_RECALL_CHAIN_CALLS`), and a stored "process" that drives a **polling loop** (`runStoredProcessLoop`, 5s interval) until background AI work completes.
- A response can imperatively steer the app: navigate routes, refetch questionnaire/publish/home queries, open the study, trigger downloads. It coordinates across React Query, Redux, `localStorage` master-data (`src/utils/masterData.ts`), and window `CustomEvent`s (`CHAT_HISTORY_READY_EVENT`, `REFRESH_STUDY_LIST_EVENT`). Treat changes here carefully — context-key guards prevent stale loops from running after navigation.

### Component organization

- `src/components/ui/` — presentational primitives (`Button`, `Modal`, `Table`, `Select`, modal scaffolding, etc.).
- `src/components/global/` — app-wide chrome (header, sidebars, chat textarea, modal host, error boundary fallback).
- `src/components/common/<Feature>/` — feature screens (Auth, Questionnaire, Crosstab, Report, Publish-survey, table-List, UserManagement, list).
- `src/pages/` — a handful of route-level page components; many routes render `components/common` screens directly.
- `src/utils/` — mix of pure helpers and hooks; `src/utils/index.ts` exports `cn()` (clsx + tailwind-merge) plus survey→chart/table transformers (`ChartResponseReFactor`, `getTableDataFromSurvey`).

## Conventions

- **Styling:** Tailwind CSS v4 via `@tailwindcss/vite` (no `tailwind.config.js`; config lives in `src/index.css`). Compose classes with `cn(...)`. Theme colors are referenced as CSS vars (e.g. `var(--color-chart-series-primary)`).
- **Charts:** Highcharts via `highcharts-react-official`.
- **Toasts:** `sonner` — but prefer letting `apiService` surface API errors rather than toasting manually in call sites.
- **TypeScript is strict** (`noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`). Use `import type` for type-only imports. Global ambient types live in `src/types/types.d.ts` (e.g. `User`, `Question`, `SurveyData` are used unqualified across the app).
- Adding an endpoint: register it in `url.ts`, add a key factory in the domain's `keys.ts`, then a hook in `query.tsx`/`mutation.tsx` using the shared templates.
