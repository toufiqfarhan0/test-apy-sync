# test-apy-sync — API-Sync AI Test Playground

The Official Testbed Repository for API-Sync AI:
- Live Review Studio: https://api-sync-theta.vercel.app/studio
- Main Application Repository: https://github.com/toufiqfarhan0/api-sync

---

## Purpose

This repository is purpose-built as a realistic simulation and testing playground for API-Sync AI — the automated documentation drift detection and synchronization platform built with Gemini 3.7 Flash and SkillPatch.

It contains an Express REST API codebase with documentation in `docs/api.md` and 25 realistic Pull Requests covering diverse API modification patterns and documentation drift scenarios.

---

## How to Test with API-Sync AI

1. Open the API-Sync Review Studio: https://api-sync-theta.vercel.app/studio
2. Either:
   - Option A: Paste any Pull Request URL from the catalog below into the PR URL field.
   - Option B: Click "Connect GitHub", select `toufiqfarhan0/test-apy-sync` from the repository dropdown, and pick any PR.
3. Click "Analyze PR Drift".
4. Observe API-Sync AI deterministically extract route changes, query Gemini for semantic drift analysis, and generate targeted documentation fixes with SkillPatch.

---

## Catalog of 25 Test Pull Requests

| PR | Pull Request Title | Drift Category | Scenario Description |
| :---: | :--- | :--- | :--- |
| #2 | [feat(users): add pagination query parameters limit and page](https://github.com/toufiqfarhan0/test-apy-sync/pull/2) | CONFIRMED DRIFT | Adds `limit` and `page` query parameters to `GET /api/users`. |
| #3 | [feat(users): require role parameter in user registration body](https://github.com/toufiqfarhan0/test-apy-sync/pull/3) | CONFIRMED DRIFT - CRITICAL | Adds required `role` field to `POST /api/users` request body. |
| #4 | [fix(users): return 404 status when user is not found](https://github.com/toufiqfarhan0/test-apy-sync/pull/4) | CONFIRMED DRIFT | Returns `404 Not Found` for invalid user IDs in `GET /api/users/:id`. |
| #5 | [feat(users): add DELETE /api/users/:id endpoint](https://github.com/toufiqfarhan0/test-apy-sync/pull/5) | CONFIRMED DRIFT - HIGH | Completely new route `DELETE /api/users/:id` with `204 No Content`. |
| #6 | [feat(auth): add optional mfaCode field to login request](https://github.com/toufiqfarhan0/test-apy-sync/pull/6) | CONFIRMED DRIFT | Adds optional `mfaCode` parameter to `POST /api/auth/login`. |
| #7 | [feat(auth): add POST /api/auth/forgot-password endpoint](https://github.com/toufiqfarhan0/test-apy-sync/pull/7) | CONFIRMED DRIFT - HIGH | Adds new authentication endpoint `POST /api/auth/forgot-password`. |
| #8 | [fix(auth): return 403 Forbidden when account is locked](https://github.com/toufiqfarhan0/test-apy-sync/pull/8) | CONFIRMED DRIFT | Adds `403 Forbidden` response status code to login route. |
| #9 | [feat(users): add POST /api/users/:id/avatar upload endpoint](https://github.com/toufiqfarhan0/test-apy-sync/pull/9) | CONFIRMED DRIFT - HIGH | Adds nested resource endpoint `POST /api/users/:id/avatar`. |
| #10 | [feat(users): add status query param and sync documentation](https://github.com/toufiqfarhan0/test-apy-sync/pull/10) | NO DRIFT (CLEAN) | Code and docs updated simultaneously with `status` filter. |
| #11 | [refactor(users): support userId alias in path /api/users/:userId](https://github.com/toufiqfarhan0/test-apy-sync/pull/11) | CONFIRMED DRIFT | Path parameter renamed from `:id` to `:userId`. |
| #12 | [feat(products): add filter query params category and minPrice](https://github.com/toufiqfarhan0/test-apy-sync/pull/12) | CONFIRMED DRIFT | Adds `category` and `minPrice` query parameters to catalog endpoint. |
| #13 | [feat(products): require stockCount in product creation body](https://github.com/toufiqfarhan0/test-apy-sync/pull/13) | CONFIRMED DRIFT | Adds required `stockCount` integer field to `POST /api/products`. |
| #14 | [feat(products): add POST /api/products/bulk endpoint](https://github.com/toufiqfarhan0/test-apy-sync/pull/14) | CONFIRMED DRIFT - HIGH | Implements batch creation route `POST /api/products/bulk`. |
| #15 | [fix(products): return 422 Unprocessable Entity on invalid price](https://github.com/toufiqfarhan0/test-apy-sync/pull/15) | CONFIRMED DRIFT | Adds validation error status `422` for negative product prices. |
| #16 | [feat(products): add PATCH /api/products/:id/pricing endpoint](https://github.com/toufiqfarhan0/test-apy-sync/pull/16) | CONFIRMED DRIFT - HIGH | Introduces HTTP `PATCH` route for product price updates. |
| #19 | [feat(products): add search query param and sync docs](https://github.com/toufiqfarhan0/test-apy-sync/pull/19) | NO DRIFT (CLEAN) | Synchronized search query parameter added to code and docs. |
| #20 | [feat(products): add tag query parameter to GET /api/products](https://github.com/toufiqfarhan0/test-apy-sync/pull/20) | CONFIRMED DRIFT | Adds `tag` query filter to catalog endpoint. |
| #21 | [feat(products): add DELETE /api/products/:id endpoint](https://github.com/toufiqfarhan0/test-apy-sync/pull/21) | CONFIRMED DRIFT - HIGH | Implements `DELETE /api/products/:id` with `204 No Content`. |
| #22 | [feat(products): add sku field to PUT /api/products/:id body](https://github.com/toufiqfarhan0/test-apy-sync/pull/22) | CONFIRMED DRIFT | Adds `sku` parameter to product update request body. |
| #23 | [feat(products): add GET /api/products/:id/reviews endpoint](https://github.com/toufiqfarhan0/test-apy-sync/pull/23) | CONFIRMED DRIFT - HIGH | Adds new product reviews retrieval endpoint. |
| #24 | [feat(orders): require currency field in POST /api/orders body](https://github.com/toufiqfarhan0/test-apy-sync/pull/24) | CONFIRMED DRIFT - CRITICAL | Adds required `currency` string to order placement payload. |
| #25 | [feat(orders): add shippingAddress object to order submission](https://github.com/toufiqfarhan0/test-apy-sync/pull/25) | CONFIRMED DRIFT | Adds `shippingAddress` dictionary to order placement payload. |
| #26 | [fix(orders): return 409 Conflict when item inventory is depleted](https://github.com/toufiqfarhan0/test-apy-sync/pull/26) | CONFIRMED DRIFT | Adds `409 Conflict` status code for out-of-stock items. |
| #27 | [feat(orders): add GET /api/orders/:id/tracking endpoint](https://github.com/toufiqfarhan0/test-apy-sync/pull/27) | CONFIRMED DRIFT - HIGH | Implements order shipment tracking status endpoint. |
| #28 | [feat(orders): add POST /api/orders/:id/cancel endpoint](https://github.com/toufiqfarhan0/test-apy-sync/pull/28) | CONFIRMED DRIFT - HIGH | Adds order cancellation request endpoint. |

---

## Technical Specifications
- Runtime: Node.js & TypeScript
- Framework: Express.js REST API
- Documentation Format: Markdown (`docs/api.md`)
- Testing Companion: API-Sync AI (https://github.com/toufiqfarhan0/api-sync)
