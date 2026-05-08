# AreaDot (angular-stain)

## Stack

Angular 18.2 standalone (no NgModules), Angular Material, Tailwind CSS v3, SCSS, FontAwesome, Karma + Jasmine.

## Commands

```sh
npm start          # ng serve at localhost:4200
npm test           # ng test (Karma + Jasmine in Chrome)
npm run build      # ng build → dist/angular-stain
```

No lint or typecheck scripts exist. No CI.

## Architecture

| Directory | Purpose |
|-----------|---------|
| `src/app/core/models/` | Interfaces (`ResultRow`, `LastResult`, `Dialog`) |
| `src/app/core/services/` | DI services (all `providedIn: 'root'`) |
| `src/app/core/utils/pipes/` | `NumerosPipe` (Chilean number format: `.` thousands, `,` decimal) |
| `src/app/pages/home/` | Monte Carlo estimator (lazy-loaded, **default export**) |
| `src/app/pages/record/` | Calculation history table (lazy-loaded, **default export**) |
| `src/app/shared/components/layout/` | Tab-based shell with `<router-outlet>` |
| `src/app/shared/components/ui/` | Alert dialog, loading, stepper |

**Entrypoint**: `src/main.ts` → `bootstrapApplication(AppComponent, appConfig)`

## Routing

- Hash-based (`withHashLocation()` in `app.config.ts`)
- `LayoutComponent` wraps lazy pages, uses `MatTabs` for nav (Calcular area / Resultados anteriores)
- Wildcard redirects to `/home`

## Path aliases

`@core/*`, `@shared/*`, `@Pages/*` — all resolve from `tsconfig.json`.

## Key conventions

- **Lazy routes use `default export`** — `export default class HomeComponent`, loaded via `loadComponent: () => import('./home.component')`
- Stepper component tracks workflow progress; service (`ImageSignalStateService`) uses Angular signals for toast/blur state
- Stain = **white** pixels (R/G/B >= 225) on a binary black-and-white PNG image
- History stored in `localStorage` under key `'historial'`
- `NumerosPipe` formats: `1234567` → `"1.234.567"` (thousands with `.`, decimals with `,`)
- Only PNG accepted (`accept="image/png"`)
- `angular-cli-ghpages` is installed but no deploy script is configured

## Testing

- Jasmine specs next to each component/service/pipe
- Karma with Chrome launcher — **Chrome must be available**
- Specs are basic (mostly `toBeTruthy()` checks)
- Run focused suite: `ng test` (no `--watch` flag supported by default config)
