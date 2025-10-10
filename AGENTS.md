# NorthWind Angular Best Practices

Guidelines below reflect Angular 20 conventions, Angular Material integration, and the needs of an enterprise operations platform (orders, products, employees). Treat these as guardrails for daily development and for onboarding new team members.

## Architecture & Project Structure
- Adopt a domain-first, standalone architecture: group features under `src/app/features/{orders|products|employees|shared}` with co-located components, routes, and data services.
- Create dedicated `core/` (singleton services, interceptors, layout shell) and `shared/` (reusable components, pipes, directives) directories; keep them free of feature-specific logic.
- Use Angular's standalone APIs exclusively (`bootstrapApplication`, route providers, feature providers) to avoid legacy NgModules and reduce boilerplate.
- Define clear layering boundaries: UI components → feature facades (signals-based state) → domain services → API access layer; prohibit cross-layer imports through lint rules.
- Plan for SSR + hydration early (`ng add @angular/ssr` once ready) to improve performance of data-heavy views such as catalog and dashboards.

## Routing & Navigation
- Model the app shell with top-level routes for each domain area; lazy load feature routes using deferrable views to minimize bundle size.
- Name routes consistently (`/orders`, `/products/:id`, `/employees/onboarding`) and derive breadcrumbs from route config metadata.
- Centralize route guards and resolvers in feature directories; guards should rely on facades/services rather than hitting HttpClient directly.

## Angular 20 Conventions
- Prefer the `inject()` function inside classes (components, services) to reduce constructor boilerplate and enable optional dependencies.
- Use Signals for in-component state and computed values; bridge to RxJS with `toSignal`/`toObservable` at integration points.
- Apply built-in control flow (`@if`, `@for`, `@switch`) for template logic and combine with deferrable views (`@defer`) for heavy widgets.
- Enable zoneless change detection when feasible (`provideExperimentalZonelessChangeDetection`) and use signals/event loops for manual triggers.
- Stick to strict TypeScript configs (`"strictTemplates": true`) and enable Angular's new template diagnostics to surface runtime issues at build time.

## Data & Domain Modeling
- Define typed DTOs and domain models per aggregate (Order, OrderLine, Product, Employee); centralize in `shared/models`.
- Introduce a data-access layer per domain (`orders-data.service.ts`) that encapsulates HttpClient calls, API routes, and caching policy.
- For complex orchestration (e.g., order fulfillment workflows), expose feature-level facades that combine server data with local UI state through Signals.
- Validate payloads on both sides: use Angular reactive forms with strongly typed form controls and reuse validation rules from the backend schema.
- Enforce consistent error handling via Http interceptors; map server errors into actionable UI messages while logging details to an observability service.

## Angular Material Guidelines
- Install and manage Angular Material using the Angular CLI schematics to ensure theming tokens and typography are configured correctly.
- Maintain a centralized theme file (`src/styles/material-theme.scss`) defining primary/accent/warn palettes, density scales, and typography aligned with brand.
- Wrap Material components with feature-specific presenters when domain behavior is needed (e.g., `<nw-order-list>` around `mat-table`).
- Use `cdk-table`, `mat-table`, and paginator/sort headers for data grids; encapsulate reusable configurations (column definitions, export options).
- Leverage Angular CDK overlays, drag-drop, stepper, and dialogs for advanced workflows; prefer CDK primitives when Material widgets are too opinionated.
- Adopt Material Harnesses in unit/integration tests to keep selectors resilient.

## Forms & User Experience
- Default to reactive forms; co-locate form models and validators, and type them with the Angular 20 `FormGroup<{ ... }>` syntax.
- Utilize `mat-form-field` variants (outlined, filled) consistently; apply density tokens for high-information screens while maintaining accessibility minimums.
- Provide contextual inline validation with `mat-error`; avoid alerting via snack bars for validation-grade feedback.
- For tabular bulk updates, support copy/paste and keyboard shortcuts; ensure form arrays scale via virtual scrolling when record counts are large.

## Performance & Observability
- Use route-level and component-level code splitting; mark seldom-used admin views as deferred with informative preload triggers.
- Memoize expensive calculations with computed signals or pure pipes; avoid `async` pipe when signals are more appropriate.
- Apply `ngOptimizedImage` for product thumbnails and marketing assets, and serve responsive image sets from the backend/CDN.
- Instrument critical user journeys with Angular's built-in `EventTrackingService` (or similar) and send metrics to the platform’s observability stack.
- Cache GET requests with `rxjs` `shareReplay` in services; invalidate caches deterministically after mutations.

## Testing Strategy
- Keep unit tests colocated with source (`*.spec.ts`) and convert to Jest or Vitest when practical to benefit from faster feedback.
- Cover complex forms and data tables with Angular Component Test Harnesses; focus on behavior (what) instead of implementation details (how).
- Add integration tests per critical workflow (order create, approval, fulfillment) using Cypress or Playwright; stub backend responses via MSW or similar.
- Track accessibility regressions with automated checks (e.g., `@axe-core/playwright`) and include them in CI.
- Prefer Angular CLI generators (`ng generate component/service ...`) so specs are scaffolded automatically; when files are added manually, create the corresponding tests immediately.

## Tooling & Automation
- Configure ESLint (`ng add @angular-eslint/schematics`) with custom rules enforcing layering boundaries and selector naming.
- Keep Prettier & ESLint in sync via `eslint-config-prettier`; run both in pre-commit (Husky) and CI pipelines.
- Use Angular CLI's environment system for API endpoints and feature flags; avoid hardcoding URLs inside services.
- Add commit-based versioning (e.g., semantic-release) to align frontend deployments with backend contracts.

## Security & Compliance
- Sanitize all HTML input using Angular's DomSanitizer only when absolutely necessary; default to built-in sanitization.
- Enforce strict Content Security Policy headers; ensure Material icons/fonts are loaded through approved CDNs or self-hosted bundles.
- Gate administrative routes with both route guards and server-side authorization checks; prefer JWT + refresh token flows stored in secure cookies.
- Maintain audit trails for critical entity mutations by instrumenting API calls and correlating with backend logs.

## Delivery & Collaboration
- Document API contracts with OpenAPI and generate TypeScript clients where possible to prevent drift.
- Keep a living design system that mirrors Material tokens; collaborate with design via Figma → tokens pipeline.
- Maintain ADRs (architecture decision records) for major choices (state management, theming approach, auth strategy) in `/docs/adr`.
- Schedule recurring tech debt reviews to evolve structure as domains (orders, products, employees) scale.

These practices should evolve with the codebase. Revisit the document at each major release to capture lessons learned and adjust to Angular platform updates.

## Commands
- `ng generate component <component-name>`
- `ng generate service <service-name>`
- `ng generate interface <interface-name>`
- `ng generate pipe <pipe-name>`
- `ng generate directive <directive-name>`
- `ng generate module <module-name>`
- `ng generate guard <guard-name>`
- `ng generate resolver <resolver-name>`
- `ng generate interceptor <interceptor-name>`
- `ng generate feature <feature-name>`
- `ng generate application <application-name>`
- `ng generate library <library-name>`
- `ng generate component <component-name> --project=<project-name>`
- `ng generate service <service-name> --project=<project-name>`
- `ng generate interface <interface-name> --project=<project-name>`
- `ng generate pipe <pipe-name> --project=<project-name>`
- `ng generate directive <directive-name> --project=<project-name>`
- `ng generate module <module-name> --project=<project-name>`
- `ng generate guard <guard-name> --project=<project-name>`
- `ng generate resolver <resolver-name> --project=<project-name>`
- `ng generate interceptor <interceptor-name> --project=<project-name>`
- `ng generate feature <feature-name> --project=<project-name>`
- `ng generate application <application-name> --project=<project-name>`
- `ng generate library <library-name> --project=<project-name>`
