## Testing Overview

This document tracks the current testing posture of the NorthWind Angular application and outlines the roadmap toward comprehensive coverage. The focus is on unit and end-to-end validation of the domain workflows (orders, products, customers, employees) while preparing for future security scenarios.

### Current Status (October 2025)

- **Unit specs**: Foundational Jasmine tests exist for key standalone components (`app`, `order-create`, `order-list`, shared form inputs) and for API services covering orders, customers, employees, and products (list/search/create/delete happy paths).
- **State orchestration**: NgRx reducers/facades under `features/orders` have limited or no direct spec coverage yet.
- **Execution environment**: Local `ng test` and `ng e2e` runs are currently blocked because the workspace uses Node.js v10.19.0; Angular CLI 20 requires ≥ v20.19.
- **E2E tests**: No Cypress/Playwright suites committed yet.
- **Automation**: No CI configuration for automated test execution or reporting.

### Near-Term Objectives

1. **Stabilise Tooling**
   - Upgrade Node.js to a supported version (≥ 20.19) and verify `ng test` runs for all existing specs.
   - Ensure Jest/Vitest evaluation if faster feedback is required; keep Jasmine baseline until a decision is made.

2. **Unit Testing Priorities**
   - Orders: cover `OrderCreateFacade`, `OrderCreateReducer`, `OrdersFacade`, and async effects (load/create/delete semantics, error propagation).
   - Validation flows: extend `OrderCreate` component spec to exercise reactive form validations (required fields, numeric ranges, selection guards).
   - Shared Components: add specs for `LoadingState`, `EntityLookup`, and `SearchInput` interactions that are not yet validated.
   - Service error paths: augment API service specs with error handling expectations (HTTP failures, retry wiring once implemented).

3. **End-to-End Testing Roadmap**
   - **Order list loading**: confirm pagination, sorting (when available), and error banners using stubs/MSW.
   - **Order creation**: validate field-level errors, product selection, submission success/failure, and navigation guards.
   - **Catalog loading**: ensure product search and lazy paging work within the create-order funnel.
   - **Lookup dialogs**: verify customer and employee lookup workflows integrate with the order form.
   - **Products menu**: once the products create flow is implemented, add coverage for listing and creation from the products area.

4. **Security & Access Control (Future)**
   - Introduce authorization test cases once role-based menus/routes ship: block unauthorised users from protected routes, assert guard redirects, verify session expiry handling.

### Working Agreement

- Track progress in this document at each sprint conclusion.
- Update the roadmap as new features land (e.g., SSR hydration, observability hooks).
- Prioritise tests alongside feature delivery so spec gaps do not accumulate.

