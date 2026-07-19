# Compfest Frontend — Slotting & Picking Optimization

A single-page warehouse slotting-and-picking optimisation dashboard built with **React 19**, **TypeScript 6**, and **Vite 8**. The application visualises warehouse layouts, compares "before vs. after" slotting configurations, renders picking routes on an HTML5 Canvas (Konva), and displays distance-saving metrics — all driven by a state-machine UI flow.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Architecture Overview](#architecture-overview)
4. [Feature Walkthrough](#feature-walkthrough)
5. [Getting Started](#getting-started)
6. [Environment Variables](#environment-variables)
7. [Available Scripts](#available-scripts)
8. [Build & Bundle Optimisation](#build--bundle-optimisation)
9. [Type System & Validation](#type-system--validation)
10. [State Machine (App Flow)](#state-machine-app-flow)
11. [API Integration](#api-integration)
12. [Styling](#styling)
13. [ESLint Configuration](#eslint-configuration)

---

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| **Runtime** | React 19 + React DOM 19 | Concurrent features, `use()` hook ready |
| **Language** | TypeScript 6.0 | Strict mode, project references (`tsconfig.app.json`, `tsconfig.node.json`) |
| **Bundler** | Vite 8 | Rolldown-powered, `@vitejs/plugin-react` |
| **Compiler** | React Compiler (Babel plugin) | Auto-memoisation via `babel-plugin-react-compiler` |
| **Server State** | TanStack React Query v5 | Caching, retry, dedup for all API calls |
| **Canvas** | Konva 10 + react-konva 19 | Warehouse grid + picking-route polyline rendering |
| **Animation** | Framer Motion 12 | Page transitions, loading states, micro-interactions |
| **Validation** | Zod 4 | Runtime schema validation for API request/response contracts |
| **Icons** | Lucide React | Consistent iconography across the UI |
| **Fonts** | IBM Plex Sans + IBM Plex Mono | Typography via `@fontsource` |

---

## Project Structure

```
frontend/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── main.tsx                          # React entry point
│   ├── App.tsx                           # Root component + state-machine router
│   ├── index.css                         # Global styles & CSS custom properties
│   ├── app/
│   │   └── query-client.ts               # TanStack QueryClient factory
│   ├── shared/                           # Cross-feature shared modules
│   │   ├── api/
│   │   │   └── api-client.ts             # Generic HTTP client (GET/POST + timeout + error parsing)
│   │   └── lib/
│   │       └── env.ts                    # Typed environment-variable loader
│   └── features/
│       ├── slotting/                     # Main feature: slotting optimisation
│       │   ├── api/
│       │   │   ├── recommend.api.ts      # POST /api/recommend
│       │   │   └── demo.api.ts           # GET  /api/demo/datasets
│       │   ├── components/
│       │   │   ├── input/                # Dataset selection, file upload, "How It Works"
│       │   │   ├── loading/              # Animated loading state with progress ring
│       │   │   ├── error/                # Error display with retry/reset actions
│       │   │   ├── result/               # Warehouse grid, picking sequence, metrics, toggle
│       │   │   └── shared/               # Reusable progress-ring component
│       │   ├── hooks/
│       │   │   ├── use-demo-datasets.ts   # Fetch available demo datasets
│       │   │   ├── use-recommend-mutation.ts # Trigger optimisation + lifecycle callbacks
│       │   │   └── use-grid-dimensions.ts # Responsive warehouse-grid dimension calculator
│       │   ├── mocs/
│       │   │   └── mock-recommend-response.ts # Mock data for development/storybook
│       │   ├── schemas/
│       │   │   ├── recommend.schema.ts   # Zod schema for /recommend response
│       │   │   └── demo.schema.ts        # Zod schema for /demo/datasets response
│       │   ├── types/
│       │   │   └── slotting.types.ts     # All domain types (RecommendationData, AppState, etc.)
│       │   └── utils/
│       │       ├── grid-layout.ts        # Grid coordinate math & layout calculation
│       │       ├── color-mapper.ts       # Product → colour mapping for grid cells
│       │       ├── progress-messages.ts  # Human-readable progress-step labels
│       │       └── error-messages.ts     # Human-readable error-code → message mapping
│       └── store/
│           └── app-state.reducer.ts      # useReducer-based state machine
├── docs/                                 # Project documentation (Indonesian)
│   ├── 00-ringkasan-dan-audit-slotting.md
│   ├── 00-AI-EXECUTION-RULES-SLOTTING.md
│   ├── 01-stack-dan-struktur-proyek-slotting.md
│   ├── 02-desain-uiux-dan-token-slotting.md
│   ├── 06-pengembangan-testing-slotting.md
│   └── slotting-picking-dinamis-analisis-dan-perancangan.md
├── index.html                            # Vite entry HTML
├── vite.config.ts                        # Vite config (plugins, aliases, manual chunks)
├── tsconfig.json                         # TS project references root
├── tsconfig.app.json                     # TS config for src/
├── tsconfig.node.json                    # TS config for vite.config.ts
├── eslint.config.js                      # Flat ESLint config (ESLint 10)
└── package.json
```

---

## Architecture Overview

```

Data Flow:
  InputPage → useRecommendMutation.mutate(datasetId)
            → POST /api/recommend
            → response validated with Zod
            → reducer dispatches PROCESSING_SUCCESS
            → ResultPage renders warehouse grid, picking sequence, metrics
```

### Key Design Decisions

1. **State machine via `useReducer`** — The entire application flow (`idle → loading → success | error`) is encoded as a discriminated union (`AppState`). This eliminates impossible states (e.g. showing results while loading) at the type level.
2. **Feature-based folder structure** — Each feature (currently `slotting`) is self-contained with its own API layer, components, hooks, schemas, types, and utils. New features follow the same pattern under `src/features/<name>/`.
3. **Shared API client** — `ApiClient` in `shared/api/` provides a generic HTTP interface with configurable timeouts, structured error parsing, and abort-controller support. Feature-specific API modules compose on top of it.
4. **Runtime validation at the boundary** — All API responses are validated with Zod schemas before they enter application state. This catches backend contract mismatches early (fail on the boundary, not deep in the render tree).
5. **React Compiler enabled** — The Babel plugin `babel-plugin-react-compiler` auto-memoises components and hooks, reducing the need for manual `useMemo`/`useCallback`/`React.memo`.

---

## Feature Walkthrough

### 1. Input Page (`InputPage`)

- **Dataset Selector** — Dropdown populated from `GET /demo/datasets`. Shows available demo datasets (small / medium / large).
- **File Upload Zone** — Drag-and-drop area for custom CSV/JSON warehouse data (UI placeholder — backend integration ready).
- **How It Works** — Expandable section explaining the slotting optimisation workflow.
- **Submit button** — Disabled until a dataset is selected. Triggers the optimisation pipeline.

### 2. Loading State (`LoadingState`)

- Animated progress ring (`ProgressRing` SVG component) with Framer Motion.
- Step-by-step progress messages (simulated / driven by `PROGRESS_TICK` actions):
  1. Memvalidasi data warehouse
  2. Menganalisis pola permintaan
  3. Menjalankan algoritma optimasi
  4. Menyusun hasil rekomendasi
- Cancel button to abort ongoing mutation.

### 3. Result Page (`ResultPage`)

#### a. Result Summary (`ResultSummary`)
- Warehouse name, total orders, total items processed.
- Tab-style summary cards.

#### b. Before / After Toggle (`BeforeAfterToggle`)
- Toggle between "before optimisation" and "after optimisation" warehouse layouts.
- Smooth animated transition.

#### c. Warehouse Grid (`WarehouseGrid`)
- Rendered on an HTML5 Canvas via **Konva**.
- Each cell represents a product at a warehouse location (aisle × position).
- Products are colour-coded via `color-mapper.ts`.
- Responsive grid dimensions calculated by `use-grid-dimensions` hook.
- Picking route polyline (`PickingRouteLine`) overlaid on the grid.

#### d. Picking Sequence (`PickingSequence`)
- Horizontal scrollable list of locations in the optimised picking order.
- Visual connector lines between consecutive stops.

#### e. Distance Metrics (`DistanceMetrics`)
- Comparison cards: before distance, after distance, distance saved (absolute), and saving percentage.
- Colour-coded indicators (red = before, green = after).

#### f. Data Disclaimer (`DataDisclaimer`)
- Legal/accuracy notice about the visualisation.

---

## Getting Started

### Prerequisites

| Tool | Minimum Version | Check |
|---|---|---|
| Node.js | ≥ 20.x | `node -v` |
| npm | ≥ 10.x | `npm -v` |
| Backend API | Running at `VITE_API_BASE_URL` 

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
# Start Vite dev server (default: http://localhost:5173)
npm run dev
```

### Production Build

```bash
# Type-check + bundle
npm run build

# Preview the production build locally
npm run preview
```

---

## Environment Variables

Create a `.env` file in `frontend/` (not committed). All variables are prefixed with `VITE_` to be exposed to the client bundle.

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_BASE_URL` | Yes | — | Base URL of the backend API (e.g. `http://localhost:8000`) |

The `env.ts` module loads and validates these via `import.meta.env`:

```ts
// src/shared/lib/env.ts
export const env = {
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL as string,
};
```

---

## Available Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `vite` | Start development server with HMR |
| `build` | `tsc -b && vite build` | Type-check with project references, then bundle for production |
| `preview` | `vite preview` | Serve the production build locally |
| `lint` | `eslint .` | Run ESLint 10 flat config across the project |

---

## Build & Bundle Optimisation

Vite is configured with **manual code splitting** via `rollupOptions.output.manualChunks`:

| Chunk | Contents |
|---|---|
| `vendor-react` | `react`, `react-dom` |
| `vendor-canvas` | `konva`, `react-konva` |
| `vendor-forms` | `zod` |
| `vendor-query` | `@tanstack/react-query` |
| `vendor-icons` | `lucide-react` |
| `vendor-motion` | `framer-motion` |
| `vendor` | All other `node_modules` |

This ensures that large dependencies are loaded in parallel and cached independently by the browser. The chunk size warning threshold is raised to **600 kB** to accommodate the canvas library's size.

The build target is **ES2020** for modern browser support.

---

## Type System & Validation

All domain types live in `src/features/slotting/types/slotting.types.ts` and are **immutable** (`readonly` properties on every interface).

### Zod Validation

API responses are validated at the boundary before they touch application state:

```ts
// schemas/recommend.schema.ts
import { z } from 'zod';

export const recommendResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: z.object({
    summary: z.object({
      warehouse: z.string(),
      total_orders: z.number(),
      total_items: z.number(),
    }),
    slotting: z.object({
      before: z.array(z.object({ product: z.string(), location: z.string() })),
      after: z.array(z.object({ product: z.string(), location: z.string() })),
    }),
    picking_route: z.array(z.string()),
    distance: z.object({
      before: z.number(),
      after: z.number(),
      saved: z.number(),
      saving_percentage: z.number(),
    }),
  }),
});
```

This pattern ensures:
- Backend contract mismatches are caught at the JSON boundary.
- The rest of the application works with **typed, guaranteed-shape data**.
- Error messages are descriptive and include the exact field that failed validation.

---

## State Machine (App Flow)

```ts
type AppState =
  | { status: "idle"; selectedDatasetId: string | null }
  | { status: "loading"; datasetId: string; progressStep: number }
  | { status: "success"; data: RecommendationData }
  | { status: "error"; error: AppError; lastDatasetId?: string };
```

### State Transitions

| Current | Action | Next |
|---|---|---|
| `idle` | `START_PROCESSING` | `loading` |
| `loading` | `PROGRESS_TICK` | `loading` (updated step) |
| `loading` | `PROCESSING_SUCCESS` | `success` |
| `loading` | `PROCESSING_ERROR` | `error` |
| `error` | (retry via `START_PROCESSING`) | `loading` |
| `success` / `error` | `RESET` | `idle` |

The reducer (`app-state.reducer.ts`) enforces these transitions exhaustively, so TypeScript will flag any unhandled action types.

---

## API Integration

### API Client (`shared/api/api-client.ts`)

A lightweight wrapper around `fetch` with:

- **Base URL** configured from `VITE_API_BASE_URL`.
- **Configurable timeout** per request (default 30 s for POST, none for GET).
- **AbortController** for timeout enforcement.
- **Structured error parsing** — extracts `error_code`, `message`, HTTP status, and details from backend error responses.

### Feature API Modules

| Module | Method | Endpoint | Purpose |
|---|---|---|---|
| `demo.api.ts` | `GET` | `/demo/datasets` | Fetch available demo dataset list |
| `recommend.api.ts` | `POST` | `/recommend` | Submit dataset for slotting optimisation |

Both modules validate responses with Zod schemas before returning typed data to hooks.

### React Query Hooks

| Hook | Query/Mutation | Description |
|---|---|---|
| `useDemoDatasets` | `useQuery` | Fetches dataset list on mount |
| `useRecommendMutation` | `useMutation` | Triggers optimisation; accepts `onStartProcessing`, `onSuccess`, `onError` callbacks to drive the state machine |

---

## Styling

- **Global styles**: `src/index.css` defines CSS custom properties (design tokens) for colours, spacing, typography, and dark-mode support.
- **Component styles**: Each component has a co-located `.css` file (e.g. `input-page.tsx` + `input-page.css`). No CSS-in-JS or utility framework is used — this keeps styles predictable and easy to override.
- **Typography**: IBM Plex Sans (UI text) + IBM Plex Mono (code, data, metrics). Loaded via `@fontsource` packages.
- **Responsive**: The warehouse grid uses the `use-grid-dimensions` hook to calculate cell sizes based on container width.

---

## ESLint Configuration

The project uses **ESLint 10** with the **flat config** format (`eslint.config.js`). Key plugins:

| Plugin | Purpose |
|---|---|
| `typescript-eslint` | Type-aware lint rules (`recommendedTypeChecked`, `strictTypeChecked`, `stylisticTypeChecked`) |
| `eslint-plugin-react-hooks` | Rules of Hooks enforcement |
| `eslint-plugin-react-refresh` | Ensures only components export HMR-compatible code |
| `@eslint/js` | Core ESLint recommended rules |

Type-aware rules require `parserOptions.project` pointing to both `tsconfig.app.json` and `tsconfig.node.json`.

## License

This project is part of **Compfest** — an internal warehouse optimisation platform.