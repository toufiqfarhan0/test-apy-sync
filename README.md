# 🧪 test-apy-sync — API-Sync AI Test Playground

> **The Official Testbed Repository for [API-Sync AI](https://github.com/toufiqfarhan0/api-sync)**
> 
> 🌐 **Live Review Studio:** [https://api-sync-theta.vercel.app/studio](https://api-sync-theta.vercel.app/studio)  
> 📦 **Main Application Repo:** [https://github.com/toufiqfarhan0/api-sync](https://github.com/toufiqfarhan0/api-sync)

---

## 🎯 Purpose

This repository is purpose-built as a realistic simulation and testing playground for **API-Sync AI** — the automated documentation drift detection and synchronization platform built with **Gemini 3.7 Flash** and **SkillPatch**.

It contains a full Express REST API codebase with documentation in [`docs/api.md`](docs/api.md) and **50 realistic Pull Requests** covering every API modification pattern and documentation drift scenario.

---

## 🚀 How to Test with API-Sync AI

1. Open the [API-Sync Review Studio](https://api-sync-theta.vercel.app/studio).
2. Either:
   - **Option A:** Paste any Pull Request URL from this repository (e.g. `https://github.com/toufiqfarhan0/test-apy-sync/pull/1`).
   - **Option B:** Click **Connect GitHub**, select `toufiqfarhan0/test-apy-sync` from the dropdown, and pick any PR.
3. Click **Analyze PR Drift**.
4. Observe **API-Sync AI** deterministically extract route changes, query Gemini for semantic drift analysis, and generate targeted documentation fixes with SkillPatch!

---

## 📋 Catalog of Test Pull Requests

The repository features 50 distinct Pull Requests simulating real-world engineering workflows across 5 core domains:

| Category | PR Range | Drift Scenarios Tested |
| :--- | :--- | :--- |
| **Users & Auth** | PR #1 – #10 | Path parameters (`:id`), query params (`limit`, `page`), body fields (`role`, `mfaCode`), status codes (`401`, `404`), and clean documentation updates (`NO_DRIFT`). |
| **Products & Catalog** | PR #11 – #20 | Filtering query parameters (`category`, `minPrice`), bulk endpoints, status `422`, PATCH price updates, and tag validation. |
| **Orders & Checkout** | PR #21 – #30 | Nested shipping address fields, currency specifications, status `409 Conflict`, cancellation endpoints, and status `201 Created`. |
| **Payments & Webhooks** | PR #31 – #40 | Idempotency keys, card decline statuses (`402`), Stripe & GitHub webhook signatures, and receipt endpoints. |
| **Teams & Analytics** | PR #41 – #50 | Team invitation endpoints, CSV export query params, date range validation (`from`, `to`), and notification state transitions. |

### Featured Test PRs to Try:
- **Critical Drift (Missing Required Params):** [PR #2](https://github.com/toufiqfarhan0/test-apy-sync/pull/2) — Adds required `role` to user creation without updating docs.
- **Breaking Status Code Change:** [PR #3](https://github.com/toufiqfarhan0/test-apy-sync/pull/3) — Returns `404 Not Found` for invalid user IDs.
- **Clean PR (Zero Drift):** [PR #9](https://github.com/toufiqfarhan0/test-apy-sync/pull/9) — Both route code and `docs/api.md` are updated simultaneously.
- **Query Parameter Drift:** [PR #11](https://github.com/toufiqfarhan0/test-apy-sync/pull/11) — Adds `category`, `minPrice`, and `maxPrice` query filters.
- **Webhook Signature Enforcement:** [PR #35](https://github.com/toufiqfarhan0/test-apy-sync/pull/35) — Adds required webhook signature validation headers.

---

## 🛠️ Repository Tech Stack
- **Runtime:** Node.js & TypeScript
- **Framework:** Express.js REST API
- **Docs Format:** Markdown ([`docs/api.md`](docs/api.md))
- **Testing Companion:** [API-Sync AI](https://github.com/toufiqfarhan0/api-sync)
