import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function run(command, cwd = process.cwd()) {
  try {
    return execSync(command, { cwd, encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] }).trim();
  } catch (err) {
    console.error(`Command failed: ${command}`);
    if (err.stderr) console.error(err.stderr.toString());
    throw err;
  }
}

const PR_DEFINITIONS = [
  // 1-10: Users & Auth
  {
    branch: "feat/users-pagination-query",
    title: "feat(users): add pagination query parameters limit and page",
    commitMsg: "feat(users): support limit and page query params in list users",
    body: `### Summary of API Changes\n- Adds \`limit\` and \`page\` query parameters to \`GET /api/users\`.\n\n### Drift Status\n- **CONFIRMED DRIFT**: \`docs/api.md\` does not document \`limit\` and \`page\` query parameters.`,
    mutate: () => {
      const file = "src/routes/users.ts";
      let content = fs.readFileSync(file, "utf-8");
      content = content.replace(
        'router.get("/api/users", (req: Request, res: Response) => {',
        'router.get("/api/users", (req: Request, res: Response) => {\n  const limit = req.query.limit;\n  const page = req.query.page;'
      );
      fs.writeFileSync(file, content);
    }
  },
  {
    branch: "feat/users-role-parameter",
    title: "feat(users): require role parameter in user registration body",
    commitMsg: "feat(users): add role to POST /api/users payload",
    body: `### Summary of API Changes\n- Adds required \`role\` string parameter to \`POST /api/users\` body.\n\n### Drift Status\n- **CONFIRMED DRIFT - CRITICAL**: \`docs/api.md\` currently specifies only \`name\` and \`email\` as required body parameters.`,
    mutate: () => {
      const file = "src/routes/users.ts";
      let content = fs.readFileSync(file, "utf-8");
      content = content.replace(
        "const { name, email } = req.body;",
        "const { name, email, role } = req.body;\n  if (!role) return res.status(400).json({ error: 'Role is required' });"
      );
      fs.writeFileSync(file, content);
    }
  },
  {
    branch: "fix/users-404-not-found-status",
    title: "fix(users): return 404 status when user is not found",
    commitMsg: "fix(users): add 404 response for unknown user ID",
    body: `### Summary of API Changes\n- Returns \`404 Not Found\` from \`GET /api/users/:id\` when the user ID is invalid.\n\n### Drift Status\n- **CONFIRMED DRIFT**: \`docs/api.md\` only documents \`200 OK\` for this endpoint.`,
    mutate: () => {
      const file = "src/routes/users.ts";
      let content = fs.readFileSync(file, "utf-8");
      content = content.replace(
        'res.status(200).json({ id, name: "Alice Smith", email: "alice@example.com" });',
        'if (id === "unknown") {\n    return res.status(404).json({ error: "User not found" });\n  }\n  res.status(200).json({ id, name: "Alice Smith", email: "alice@example.com" });'
      );
      fs.writeFileSync(file, content);
    }
  },
  {
    branch: "feat/users-delete-endpoint",
    title: "feat(users): add DELETE /api/users/:id endpoint for account deletion",
    commitMsg: "feat(users): implement DELETE /api/users/:id with 204 status",
    body: `### Summary of API Changes\n- Implements new route \`DELETE /api/users/:id\` returning status \`204 No Content\`.\n\n### Drift Status\n- **CONFIRMED DRIFT - HIGH**: \`DELETE /api/users/:id\` is completely omitted from \`docs/api.md\`.`,
    mutate: () => {
      const file = "src/routes/users.ts";
      let content = fs.readFileSync(file, "utf-8");
      content = content.replace(
        "export default router;",
        '// DELETE /api/users/:id - Delete user account\nrouter.delete("/api/users/:id", (req: Request, res: Response) => {\n  res.status(204).send();\n});\n\nexport default router;'
      );
      fs.writeFileSync(file, content);
    }
  },
  {
    branch: "feat/auth-mfa-code-login",
    title: "feat(auth): add optional mfaCode field to login request body",
    commitMsg: "feat(auth): support mfaCode parameter in POST /api/auth/login",
    body: `### Summary of API Changes\n- Adds optional \`mfaCode\` field to \`POST /api/auth/login\` body.\n\n### Drift Status\n- **CONFIRMED DRIFT**: \`docs/api.md\` does not document the \`mfaCode\` parameter.`,
    mutate: () => {
      const file = "src/routes/auth.ts";
      let content = fs.readFileSync(file, "utf-8");
      content = content.replace(
        "const { email, password } = req.body;",
        "const { email, password, mfaCode } = req.body;"
      );
      fs.writeFileSync(file, content);
    }
  },
  {
    branch: "feat/auth-forgot-password",
    title: "feat(auth): add POST /api/auth/forgot-password endpoint",
    commitMsg: "feat(auth): implement password reset request route",
    body: `### Summary of API Changes\n- Adds new route \`POST /api/auth/forgot-password\` accepting \`email\` in request body.\n\n### Drift Status\n- **CONFIRMED DRIFT - HIGH**: Endpoint missing from authentication docs.`,
    mutate: () => {
      const file = "src/routes/auth.ts";
      let content = fs.readFileSync(file, "utf-8");
      content = content.replace(
        "export default router;",
        '// POST /api/auth/forgot-password - Request password reset\nrouter.post("/api/auth/forgot-password", (req: Request, res: Response) => {\n  const { email } = req.body;\n  if (!email) return res.status(400).json({ error: "Email is required" });\n  res.status(200).json({ message: "Password reset link dispatched" });\n});\n\nexport default router;'
      );
      fs.writeFileSync(file, content);
    }
  },
  {
    branch: "fix/auth-403-locked-account",
    title: "fix(auth): return 403 Forbidden when account is locked",
    commitMsg: "fix(auth): return 403 response for locked accounts",
    body: `### Summary of API Changes\n- Adds \`403 Forbidden\` response status to \`POST /api/auth/login\`.\n\n### Drift Status\n- **CONFIRMED DRIFT**: \`docs/api.md\` only documents 200 and 401 statuses.`,
    mutate: () => {
      const file = "src/routes/auth.ts";
      let content = fs.readFileSync(file, "utf-8");
      content = content.replace(
        'res.status(200).json({ token: "jwt_token_sample", user: { email } });',
        'if (email.includes("locked")) {\n    return res.status(403).json({ error: "Account temporarily locked" });\n  }\n  res.status(200).json({ token: "jwt_token_sample", user: { email } });'
      );
      fs.writeFileSync(file, content);
    }
  },
  {
    branch: "feat/users-avatar-endpoint",
    title: "feat(users): add POST /api/users/:id/avatar upload endpoint",
    commitMsg: "feat(users): add avatar update endpoint",
    body: `### Summary of API Changes\n- Adds route \`POST /api/users/:id/avatar\` for profile photo uploads.\n\n### Drift Status\n- **CONFIRMED DRIFT - HIGH**: New endpoint not present in documentation.`,
    mutate: () => {
      const file = "src/routes/users.ts";
      let content = fs.readFileSync(file, "utf-8");
      content = content.replace(
        "export default router;",
        '// POST /api/users/:id/avatar - Upload profile avatar\nrouter.post("/api/users/:id/avatar", (req: Request, res: Response) => {\n  const { avatarUrl } = req.body;\n  res.status(200).json({ success: true, avatarUrl });\n});\n\nexport default router;'
      );
      fs.writeFileSync(file, content);
    }
  },
  {
    branch: "docs/users-clean-sync",
    title: "feat(users): add status query param and sync documentation (Clean - NO DRIFT)",
    commitMsg: "feat(users): add status query param and update docs/api.md",
    body: `### Summary of API Changes\n- Adds \`status\` query parameter to \`GET /api/users\`.\n- Simultaneously updates \`docs/api.md\` with parameter documentation.\n\n### Drift Status\n- **NO DRIFT**: Code changes are completely reflected in documentation.`,
    mutate: () => {
      const file = "src/routes/users.ts";
      let content = fs.readFileSync(file, "utf-8");
      content = content.replace(
        'router.get("/api/users", (req: Request, res: Response) => {',
        'router.get("/api/users", (req: Request, res: Response) => {\n  const status = req.query.status;'
      );
      fs.writeFileSync(file, content);

      const doc = "docs/api.md";
      let docContent = fs.readFileSync(doc, "utf-8");
      docContent = docContent.replace(
        "**Request Query Parameters:**\nNone.",
        "**Request Query Parameters:**\n- `status` (string, optional): Filter users by status (`active`, `pending`, `suspended`)."
      );
      fs.writeFileSync(doc, docContent);
    }
  },
  {
    branch: "refactor/users-path-param-alias",
    title: "refactor(users): support userId alias in path /api/users/:userId",
    commitMsg: "refactor(users): rename path param id to userId in route",
    body: `### Summary of API Changes\n- Modifies path parameter from \`:id\` to \`:userId\` in \`GET /api/users/:userId\`.\n\n### Drift Status\n- **CONFIRMED DRIFT**: \`docs/api.md\` still references \`:id\`.`,
    mutate: () => {
      const file = "src/routes/users.ts";
      let content = fs.readFileSync(file, "utf-8");
      content = content.replace(
        'router.get("/api/users/:id", (req: Request, res: Response) => {',
        'router.get("/api/users/:userId", (req: Request, res: Response) => {'
      );
      fs.writeFileSync(file, content);
    }
  },

  // 11-20: Products & Catalog
  {
    branch: "feat/products-category-filter",
    title: "feat(products): add filter query params category and minPrice",
    commitMsg: "feat(products): support category and minPrice query filters",
    body: `### Summary of API Changes\n- Adds query filters \`category\` and \`minPrice\` to \`GET /api/products\`.\n\n### Drift Status\n- **CONFIRMED DRIFT**: Query filters omitted from \`docs/api.md\`.`,
    mutate: () => {
      const file = "src/routes/products.ts";
      let content = fs.readFileSync(file, "utf-8");
      content = content.replace(
        'router.get("/api/products", (req: Request, res: Response) => {',
        'router.get("/api/products", (req: Request, res: Response) => {\n  const category = req.query.category;\n  const minPrice = req.query.minPrice;'
      );
      fs.writeFileSync(file, content);
    }
  },
  {
    branch: "feat/products-stock-count-body",
    title: "feat(products): require stockCount in product creation body",
    commitMsg: "feat(products): add stockCount field to POST /api/products",
    body: `### Summary of API Changes\n- Adds \`stockCount\` field to \`POST /api/products\` body.\n\n### Drift Status\n- **CONFIRMED DRIFT**: \`docs/api.md\` does not document \`stockCount\`.`,
    mutate: () => {
      const file = "src/routes/products.ts";
      let content = fs.readFileSync(file, "utf-8");
      content = content.replace(
        "const { title, price } = req.body;",
        "const { title, price, stockCount } = req.body;\n  if (stockCount === undefined) return res.status(400).json({ error: 'stockCount required' });"
      );
      fs.writeFileSync(file, content);
    }
  },
  {
    branch: "feat/products-bulk-endpoint",
    title: "feat(products): add POST /api/products/bulk endpoint",
    commitMsg: "feat(products): implement bulk product creation",
    body: `### Summary of API Changes\n- Adds route \`POST /api/products/bulk\` for batch creating products.\n\n### Drift Status\n- **CONFIRMED DRIFT - HIGH**: Bulk endpoint missing from docs.`,
    mutate: () => {
      const file = "src/routes/products.ts";
      let content = fs.readFileSync(file, "utf-8");
      content = content.replace(
        "export default router;",
        '// POST /api/products/bulk - Bulk create\nrouter.post("/api/products/bulk", (req: Request, res: Response) => {\n  const { products } = req.body;\n  res.status(201).json({ created: products?.length || 0 });\n});\n\nexport default router;'
      );
      fs.writeFileSync(file, content);
    }
  },
  {
    branch: "fix/products-422-price-validation",
    title: "fix(products): return 422 Unprocessable Entity on invalid price format",
    commitMsg: "fix(products): add 422 validation status for negative price",
    body: `### Summary of API Changes\n- Returns \`422\` status when \`price\` is negative.\n\n### Drift Status\n- **CONFIRMED DRIFT**: \`docs/api.md\` does not list 422 response.`,
    mutate: () => {
      const file = "src/routes/products.ts";
      let content = fs.readFileSync(file, "utf-8");
      content = content.replace(
        "if (!title || price === undefined) {",
        "if (price < 0) return res.status(422).json({ error: 'Price must be positive' });\n  if (!title || price === undefined) {"
      );
      fs.writeFileSync(file, content);
    }
  },
  {
    branch: "feat/products-patch-pricing",
    title: "feat(products): add PATCH /api/products/:id/pricing endpoint",
    commitMsg: "feat(products): add dedicated pricing patch endpoint",
    body: `### Summary of API Changes\n- Adds route \`PATCH /api/products/:id/pricing\`.\n\n### Drift Status\n- **CONFIRMED DRIFT - HIGH**: Endpoint missing from docs.`,
    mutate: () => {
      const file = "src/routes/products.ts";
      let content = fs.readFileSync(file, "utf-8");
      content = content.replace(
        "export default router;",
        '// PATCH /api/products/:id/pricing - Update pricing\nrouter.patch("/api/products/:id/pricing", (req: Request, res: Response) => {\n  const { price } = req.body;\n  res.status(200).json({ id: req.params.id, price });\n});\n\nexport default router;'
      );
      fs.writeFileSync(file, content);
    }
  },
  {
    branch: "docs/products-clean-sync",
    title: "feat(products): add search query param and sync docs (Clean - NO DRIFT)",
    commitMsg: "feat(products): support search query and update api.md",
    body: `### Summary of API Changes\n- Adds \`search\` query filter to \`GET /api/products\` and documents it in \`docs/api.md\`.\n\n### Drift Status\n- **NO DRIFT**: Documentation is up to date with implementation.`,
    mutate: () => {
      const file = "src/routes/products.ts";
      let content = fs.readFileSync(file, "utf-8");
      content = content.replace(
        'router.get("/api/products", (req: Request, res: Response) => {',
        'router.get("/api/products", (req: Request, res: Response) => {\n  const search = req.query.search;'
      );
      fs.writeFileSync(file, content);

      const doc = "docs/api.md";
      let docContent = fs.readFileSync(doc, "utf-8");
      docContent = docContent.replace(
        "## Products API\n\n### GET /api/products\nList all available products in the catalog.\n\n**Request Query Parameters:**\nNone.",
        "## Products API\n\n### GET /api/products\nList all available products in the catalog.\n\n**Request Query Parameters:**\n- `search` (string, optional): Search keyword matching product title or description."
      );
      fs.writeFileSync(doc, docContent);
    }
  },
  {
    branch: "feat/products-tag-filter",
    title: "feat(products): add tag query parameter to GET /api/products",
    commitMsg: "feat(products): add tag query filtering",
    body: `### Summary of API Changes\n- Adds \`tag\` query parameter to \`GET /api/products\`.\n\n### Drift Status\n- **CONFIRMED DRIFT**: Query param not in documentation.`,
    mutate: () => {
      const file = "src/routes/products.ts";
      let content = fs.readFileSync(file, "utf-8");
      content = content.replace(
        'router.get("/api/products", (req: Request, res: Response) => {',
        'router.get("/api/products", (req: Request, res: Response) => {\n  const tag = req.query.tag;'
      );
      fs.writeFileSync(file, content);
    }
  },
  {
    branch: "feat/products-delete-endpoint",
    title: "feat(products): add DELETE /api/products/:id endpoint",
    commitMsg: "feat(products): implement DELETE /api/products/:id with 204",
    body: `### Summary of API Changes\n- Adds \`DELETE /api/products/:id\` returning status \`204\`.\n\n### Drift Status\n- **CONFIRMED DRIFT - HIGH**: Endpoint missing from docs.`,
    mutate: () => {
      const file = "src/routes/products.ts";
      let content = fs.readFileSync(file, "utf-8");
      content = content.replace(
        "export default router;",
        '// DELETE /api/products/:id - Delete product\nrouter.delete("/api/products/:id", (req: Request, res: Response) => {\n  res.status(204).send();\n});\n\nexport default router;'
      );
      fs.writeFileSync(file, content);
    }
  },
  {
    branch: "feat/products-sku-field-update",
    title: "feat(products): add sku field to PUT /api/products/:id body",
    commitMsg: "feat(products): support sku in product update",
    body: `### Summary of API Changes\n- Adds \`sku\` field to \`PUT /api/products/:id\` request body.\n\n### Drift Status\n- **CONFIRMED DRIFT**: Field missing in \`docs/api.md\`.`,
    mutate: () => {
      const file = "src/routes/products.ts";
      let content = fs.readFileSync(file, "utf-8");
      content = content.replace(
        "const { title, price } = req.body;",
        "const { title, price, sku } = req.body;"
      );
      fs.writeFileSync(file, content);
    }
  },
  {
    branch: "feat/products-reviews-endpoint",
    title: "feat(products): add GET /api/products/:id/reviews endpoint",
    commitMsg: "feat(products): implement reviews retrieval route",
    body: `### Summary of API Changes\n- Adds route \`GET /api/products/:id/reviews\`.\n\n### Drift Status\n- **CONFIRMED DRIFT - HIGH**: Missing from catalog documentation.`,
    mutate: () => {
      const file = "src/routes/products.ts";
      let content = fs.readFileSync(file, "utf-8");
      content = content.replace(
        "export default router;",
        '// GET /api/products/:id/reviews - Product reviews\nrouter.get("/api/products/:id/reviews", (req: Request, res: Response) => {\n  res.status(200).json([{ rating: 5, comment: "Excellent" }]);\n});\n\nexport default router;'
      );
      fs.writeFileSync(file, content);
    }
  },

  // 21-30: Orders & Checkout
  {
    branch: "feat/orders-currency-field",
    title: "feat(orders): require currency field in POST /api/orders body",
    commitMsg: "feat(orders): add currency parameter to order placement",
    body: `### Summary of API Changes\n- Adds required \`currency\` field to \`POST /api/orders\`.\n\n### Drift Status\n- **CONFIRMED DRIFT - CRITICAL**: Body parameter missing from docs.`,
    mutate: () => {
      const file = "src/routes/orders.ts";
      let content = fs.readFileSync(file, "utf-8");
      content = content.replace(
        "const { items, totalAmount } = req.body;",
        "const { items, totalAmount, currency } = req.body;\n  if (!currency) return res.status(400).json({ error: 'currency is required' });"
      );
      fs.writeFileSync(file, content);
    }
  },
  {
    branch: "feat/orders-shipping-address",
    title: "feat(orders): add shippingAddress object to order submission",
    commitMsg: "feat(orders): support shippingAddress in order placement",
    body: `### Summary of API Changes\n- Adds \`shippingAddress\` parameter to \`POST /api/orders\`.\n\n### Drift Status\n- **CONFIRMED DRIFT**: Missing from \`docs/api.md\`.`,
    mutate: () => {
      const file = "src/routes/orders.ts";
      let content = fs.readFileSync(file, "utf-8");
      content = content.replace(
        "const { items, totalAmount } = req.body;",
        "const { items, totalAmount, shippingAddress } = req.body;"
      );
      fs.writeFileSync(file, content);
    }
  },
  {
    branch: "fix/orders-409-conflict-status",
    title: "fix(orders): return 409 Conflict when item inventory is depleted",
    commitMsg: "fix(orders): add 409 status on inventory conflict",
    body: `### Summary of API Changes\n- Returns \`409 Conflict\` when product inventory is exhausted.\n\n### Drift Status\n- **CONFIRMED DRIFT**: Response status code missing from documentation.`,
    mutate: () => {
      const file = "src/routes/orders.ts";
      let content = fs.readFileSync(file, "utf-8");
      content = content.replace(
        "if (!items || !Array.isArray(items) || !totalAmount) {",
        "if (items.length > 50) return res.status(409).json({ error: 'Inventory stock conflict' });\n  if (!items || !Array.isArray(items) || !totalAmount) {"
      );
      fs.writeFileSync(file, content);
    }
  },
  {
    branch: "feat/orders-tracking-endpoint",
    title: "feat(orders): add GET /api/orders/:id/tracking endpoint",
    commitMsg: "feat(orders): implement order shipment tracking endpoint",
    body: `### Summary of API Changes\n- Adds \`GET /api/orders/:id/tracking\`.\n\n### Drift Status\n- **CONFIRMED DRIFT - HIGH**: Endpoint missing from docs.`,
    mutate: () => {
      const file = "src/routes/orders.ts";
      let content = fs.readFileSync(file, "utf-8");
      content = content.replace(
        "export default router;",
        '// GET /api/orders/:id/tracking - Shipment tracking\nrouter.get("/api/orders/:id/tracking", (req: Request, res: Response) => {\n  res.status(200).json({ orderId: req.params.id, carrier: "UPS", trackingNumber: "1Z999999" });\n});\n\nexport default router;'
      );
      fs.writeFileSync(file, content);
    }
  },
  {
    branch: "feat/orders-cancel-endpoint",
    title: "feat(orders): add POST /api/orders/:id/cancel endpoint",
    commitMsg: "feat(orders): add order cancellation route",
    body: `### Summary of API Changes\n- Adds route \`POST /api/orders/:id/cancel\`.\n\n### Drift Status\n- **CONFIRMED DRIFT - HIGH**: Endpoint omitted from docs.`,
    mutate: () => {
      const file = "src/routes/orders.ts";
      let content = fs.readFileSync(file, "utf-8");
      content = content.replace(
        "export default router;",
        '// POST /api/orders/:id/cancel - Cancel order\nrouter.post("/api/orders/:id/cancel", (req: Request, res: Response) => {\n  res.status(200).json({ success: true, status: "cancelled" });\n});\n\nexport default router;'
      );
      fs.writeFileSync(file, content);
    }
  },
  {
    branch: "feat/orders-status-query-param",
    title: "feat(orders): support status filter query param in GET /api/orders",
    commitMsg: "feat(orders): add status query param to list orders",
    body: `### Summary of API Changes\n- Adds \`status\` query parameter to \`GET /api/orders\`.\n\n### Drift Status\n- **CONFIRMED DRIFT**: Query param missing in docs.`,
    mutate: () => {
      const file = "src/routes/orders.ts";
      let content = fs.readFileSync(file, "utf-8");
      content = content.replace(
        'router.get("/api/orders", (req: Request, res: Response) => {',
        'router.get("/api/orders", (req: Request, res: Response) => {\n  const status = req.query.status;'
      );
      fs.writeFileSync(file, content);
    }
  },
  {
    branch: "docs/orders-clean-sync",
    title: "feat(orders): add couponCode and sync documentation (Clean - NO DRIFT)",
    commitMsg: "feat(orders): support couponCode and update api.md",
    body: `### Summary of API Changes\n- Adds \`couponCode\` field to \`POST /api/orders\` and documents it in \`docs/api.md\`.\n\n### Drift Status\n- **NO DRIFT**: Fully synchronized code and docs.`,
    mutate: () => {
      const file = "src/routes/orders.ts";
      let content = fs.readFileSync(file, "utf-8");
      content = content.replace(
        "const { items, totalAmount } = req.body;",
        "const { items, totalAmount, couponCode } = req.body;"
      );
      fs.writeFileSync(file, content);

      const doc = "docs/api.md";
      let docContent = fs.readFileSync(doc, "utf-8");
      docContent = docContent.replace(
        "- `totalAmount` (number, required): Order total in cents.",
        "- `totalAmount` (number, required): Order total in cents.\n- `couponCode` (string, optional): Promotional discount coupon code."
      );
      fs.writeFileSync(doc, docContent);
    }
  },
  {
    branch: "feat/orders-refund-endpoint",
    title: "feat(orders): add POST /api/orders/:id/refund endpoint",
    commitMsg: "feat(orders): implement refund request route",
    body: `### Summary of API Changes\n- Adds route \`POST /api/orders/:id/refund\`.\n\n### Drift Status\n- **CONFIRMED DRIFT - HIGH**: Missing from docs.`,
    mutate: () => {
      const file = "src/routes/orders.ts";
      let content = fs.readFileSync(file, "utf-8");
      content = content.replace(
        "export default router;",
        '// POST /api/orders/:id/refund - Refund order\nrouter.post("/api/orders/:id/refund", (req: Request, res: Response) => {\n  const { reason } = req.body;\n  res.status(200).json({ refundId: "ref_1", status: "processing" });\n});\n\nexport default router;'
      );
      fs.writeFileSync(file, content);
    }
  },
  {
    branch: "fix/orders-201-created-status",
    title: "fix(orders): return 201 Created instead of 200 on order placement",
    commitMsg: "fix(orders): change order creation status from 200 to 201",
    body: `### Summary of API Changes\n- Changes response status of \`POST /api/orders\` from \`200\` to \`201\`.\n\n### Drift Status\n- **CONFIRMED DRIFT**: \`docs/api.md\` still lists \`200 OK\`.`,
    mutate: () => {
      const file = "src/routes/orders.ts";
      let content = fs.readFileSync(file, "utf-8");
      content = content.replace(
        'res.status(200).json({ id: "ord_2", items, totalAmount, status: "pending" });',
        'res.status(201).json({ id: "ord_2", items, totalAmount, status: "pending" });'
      );
      fs.writeFileSync(file, content);
    }
  },
  {
    branch: "feat/orders-customer-id-query",
    title: "feat(orders): add customerId query filter to GET /api/orders",
    commitMsg: "feat(orders): add customerId query parameter",
    body: `### Summary of API Changes\n- Adds \`customerId\` query filter to \`GET /api/orders\`.\n\n### Drift Status\n- **CONFIRMED DRIFT**: Query param missing in docs.`,
    mutate: () => {
      const file = "src/routes/orders.ts";
      let content = fs.readFileSync(file, "utf-8");
      content = content.replace(
        'router.get("/api/orders", (req: Request, res: Response) => {',
        'router.get("/api/orders", (req: Request, res: Response) => {\n  const customerId = req.query.customerId;'
      );
      fs.writeFileSync(file, content);
    }
  },

  // 31-40: Payments & Webhooks
  {
    branch: "feat/payments-payment-method-field",
    title: "feat(payments): require paymentMethodId in checkout request",
    commitMsg: "feat(payments): add paymentMethodId to POST /api/payments/checkout",
    body: `### Summary of API Changes\n- Adds required \`paymentMethodId\` string field to \`POST /api/payments/checkout\`.\n\n### Drift Status\n- **CONFIRMED DRIFT - CRITICAL**: Parameter missing in docs.`,
    mutate: () => {
      const file = "src/routes/payments.ts";
      let content = fs.readFileSync(file, "utf-8");
      content = content.replace(
        "const { orderId, amount } = req.body;",
        "const { orderId, amount, paymentMethodId } = req.body;\n  if (!paymentMethodId) return res.status(400).json({ error: 'paymentMethodId required' });"
      );
      fs.writeFileSync(file, content);
    }
  },
  {
    branch: "feat/payments-idempotency-query",
    title: "feat(payments): support idempotencyKey query parameter",
    commitMsg: "feat(payments): add idempotencyKey support",
    body: `### Summary of API Changes\n- Adds \`idempotencyKey\` query parameter handling to checkout endpoint.\n\n### Drift Status\n- **CONFIRMED DRIFT**: Parameter omitted from docs.`,
    mutate: () => {
      const file = "src/routes/payments.ts";
      let content = fs.readFileSync(file, "utf-8");
      content = content.replace(
        'router.post("/api/payments/checkout", (req: Request, res: Response) => {',
        'router.post("/api/payments/checkout", (req: Request, res: Response) => {\n  const idempotencyKey = req.query.idempotencyKey;'
      );
      fs.writeFileSync(file, content);
    }
  },
  {
    branch: "fix/payments-402-declined-status",
    title: "fix(payments): return 402 Payment Required on card decline",
    commitMsg: "fix(payments): add 402 status code on transaction failure",
    body: `### Summary of API Changes\n- Adds \`402 Payment Required\` status code for card decline events.\n\n### Drift Status\n- **CONFIRMED DRIFT**: Status code not documented in \`docs/api.md\`.`,
    mutate: () => {
      const file = "src/routes/payments.ts";
      let content = fs.readFileSync(file, "utf-8");
      content = content.replace(
        "if (!orderId || !amount) {",
        "if (amount > 100000) return res.status(402).json({ error: 'Card declined: limit exceeded' });\n  if (!orderId || !amount) {"
      );
      fs.writeFileSync(file, content);
    }
  },
  {
    branch: "feat/webhooks-github-route",
    title: "feat(webhooks): add POST /api/webhooks/github endpoint",
    commitMsg: "feat(webhooks): implement GitHub webhook handler",
    body: `### Summary of API Changes\n- Adds route \`POST /api/webhooks/github\`.\n\n### Drift Status\n- **CONFIRMED DRIFT - HIGH**: Route completely missing from \`docs/api.md\`.`,
    mutate: () => {
      const file = "src/routes/webhooks.ts";
      let content = fs.readFileSync(file, "utf-8");
      content = content.replace(
        "export default router;",
        '// POST /api/webhooks/github\nrouter.post("/api/webhooks/github", (req: Request, res: Response) => {\n  res.status(200).json({ event: "push", delivered: true });\n});\n\nexport default router;'
      );
      fs.writeFileSync(file, content);
    }
  },
  {
    branch: "fix/webhooks-401-signature-status",
    title: "fix(webhooks): return 401 on invalid webhook signature",
    commitMsg: "fix(webhooks): return 401 when signature header verification fails",
    body: `### Summary of API Changes\n- Returns \`401 Unauthorized\` when signature header fails validation.\n\n### Drift Status\n- **CONFIRMED DRIFT**: Missing 401 status in documentation.`,
    mutate: () => {
      const file = "src/routes/webhooks.ts";
      let content = fs.readFileSync(file, "utf-8");
      content = content.replace(
        'return res.status(400).json({ error: "Missing stripe signature" });',
        'return res.status(401).json({ error: "Invalid stripe signature" });'
      );
      fs.writeFileSync(file, content);
    }
  },
  {
    branch: "docs/payments-clean-sync",
    title: "feat(payments): add metadata field and sync docs (Clean - NO DRIFT)",
    commitMsg: "feat(payments): add metadata parameter and update docs/api.md",
    body: `### Summary of API Changes\n- Adds \`metadata\` object parameter to \`POST /api/payments/checkout\` and documents it in \`docs/api.md\`.\n\n### Drift Status\n- **NO DRIFT**: Both code and docs updated.`,
    mutate: () => {
      const file = "src/routes/payments.ts";
      let content = fs.readFileSync(file, "utf-8");
      content = content.replace(
        "const { orderId, amount } = req.body;",
        "const { orderId, amount, metadata } = req.body;"
      );
      fs.writeFileSync(file, content);

      const doc = "docs/api.md";
      let docContent = fs.readFileSync(doc, "utf-8");
      docContent = docContent.replace(
        "- `amount` (number, required): Amount to charge in cents.",
        "- `amount` (number, required): Amount to charge in cents.\n- `metadata` (object, optional): Key-value metadata dictionary."
      );
      fs.writeFileSync(doc, docContent);
    }
  },
  {
    branch: "feat/payments-receipt-endpoint",
    title: "feat(payments): add GET /api/payments/:id/receipt endpoint",
    commitMsg: "feat(payments): implement receipt retrieval route",
    body: `### Summary of API Changes\n- Adds \`GET /api/payments/:id/receipt\` endpoint.\n\n### Drift Status\n- **CONFIRMED DRIFT - HIGH**: Endpoint missing from docs.`,
    mutate: () => {
      const file = "src/routes/payments.ts";
      let content = fs.readFileSync(file, "utf-8");
      content = content.replace(
        "export default router;",
        '// GET /api/payments/:id/receipt\nrouter.get("/api/payments/:id/receipt", (req: Request, res: Response) => {\n  res.status(200).json({ receiptUrl: "https://invoicing.example.com/rcpt_1.pdf" });\n});\n\nexport default router;'
      );
      fs.writeFileSync(file, content);
    }
  },
  {
    branch: "feat/payments-currency-param",
    title: "feat(payments): add currency parameter to POST /api/payments/checkout",
    commitMsg: "feat(payments): support currency in checkout payload",
    body: `### Summary of API Changes\n- Adds \`currency\` field to \`POST /api/payments/checkout\`.\n\n### Drift Status\n- **CONFIRMED DRIFT**: Parameter omitted from documentation.`,
    mutate: () => {
      const file = "src/routes/payments.ts";
      let content = fs.readFileSync(file, "utf-8");
      content = content.replace(
        "const { orderId, amount } = req.body;",
        "const { orderId, amount, currency } = req.body;"
      );
      fs.writeFileSync(file, content);
    }
  },
  {
    branch: "fix/webhooks-500-handler",
    title: "fix(webhooks): return 500 when downstream webhook worker times out",
    commitMsg: "fix(webhooks): add 500 error status handling",
    body: `### Summary of API Changes\n- Adds \`500 Internal Server Error\` response when processing times out.\n\n### Drift Status\n- **CONFIRMED DRIFT**: Missing 500 status in docs.`,
    mutate: () => {
      const file = "src/routes/webhooks.ts";
      let content = fs.readFileSync(file, "utf-8");
      content = content.replace(
        "res.status(200).json({ received: true });",
        "if (req.headers['x-simulate-error']) return res.status(500).json({ error: 'Worker timeout' });\n  res.status(200).json({ received: true });"
      );
      fs.writeFileSync(file, content);
    }
  },
  {
    branch: "feat/payments-refund-partial",
    title: "feat(payments): add POST /api/payments/:id/refunds endpoint",
    commitMsg: "feat(payments): add partial refund endpoint",
    body: `### Summary of API Changes\n- Adds \`POST /api/payments/:id/refunds\`.\n\n### Drift Status\n- **CONFIRMED DRIFT - HIGH**: Missing from payment docs.`,
    mutate: () => {
      const file = "src/routes/payments.ts";
      let content = fs.readFileSync(file, "utf-8");
      content = content.replace(
        "export default router;",
        '// POST /api/payments/:id/refunds\nrouter.post("/api/payments/:id/refunds", (req: Request, res: Response) => {\n  const { amount } = req.body;\n  res.status(200).json({ refundId: "ref_part_1", amount });\n});\n\nexport default router;'
      );
      fs.writeFileSync(file, content);
    }
  },

  // 41-50: Teams, Notifications & Analytics
  {
    branch: "feat/teams-invites-endpoint",
    title: "feat(teams): add POST /api/teams/:id/invites endpoint",
    commitMsg: "feat(teams): implement team invitation endpoint",
    body: `### Summary of API Changes\n- Adds route \`POST /api/teams/:id/invites\` accepting \`inviteeEmail\` in body.\n\n### Drift Status\n- **CONFIRMED DRIFT - HIGH**: Endpoint missing from docs.`,
    mutate: () => {
      const file = "src/routes/teams.ts";
      let content = fs.readFileSync(file, "utf-8");
      content = content.replace(
        "export default router;",
        '// POST /api/teams/:id/invites\nrouter.post("/api/teams/:id/invites", (req: Request, res: Response) => {\n  const { inviteeEmail } = req.body;\n  res.status(201).json({ success: true, inviteeEmail });\n});\n\nexport default router;'
      );
      fs.writeFileSync(file, content);
    }
  },
  {
    branch: "feat/teams-members-role-query",
    title: "feat(teams): add role query parameter to GET /api/teams/:id/members",
    commitMsg: "feat(teams): support role filter query param",
    body: `### Summary of API Changes\n- Adds \`role\` query parameter to \`GET /api/teams/:id/members\`.\n\n### Drift Status\n- **CONFIRMED DRIFT**: Parameter omitted from documentation.`,
    mutate: () => {
      const file = "src/routes/teams.ts";
      let content = fs.readFileSync(file, "utf-8");
      content = content.replace(
        "export default router;",
        '// GET /api/teams/:id/members\nrouter.get("/api/teams/:id/members", (req: Request, res: Response) => {\n  const role = req.query.role;\n  res.status(200).json([{ userId: "usr_1", role: role || "member" }]);\n});\n\nexport default router;'
      );
      fs.writeFileSync(file, content);
    }
  },
  {
    branch: "fix/teams-403-forbidden-delete",
    title: "fix(teams): return 403 Forbidden when non-owner deletes team",
    commitMsg: "fix(teams): add 403 status code for unauthorized team deletion",
    body: `### Summary of API Changes\n- Adds \`403 Forbidden\` status to \`DELETE /api/teams/:id\`.\n\n### Drift Status\n- **CONFIRMED DRIFT**: Status code not in \`docs/api.md\`.`,
    mutate: () => {
      const file = "src/routes/teams.ts";
      let content = fs.readFileSync(file, "utf-8");
      content = content.replace(
        "export default router;",
        '// DELETE /api/teams/:id\nrouter.delete("/api/teams/:id", (req: Request, res: Response) => {\n  if (!req.headers["x-owner-token"]) return res.status(403).json({ error: "Only team owner can delete" });\n  res.status(204).send();\n});\n\nexport default router;'
      );
      fs.writeFileSync(file, content);
    }
  },
  {
    branch: "feat/teams-transfer-ownership",
    title: "feat(teams): add PUT /api/teams/:id/owner endpoint",
    commitMsg: "feat(teams): implement transfer ownership route",
    body: `### Summary of API Changes\n- Adds route \`PUT /api/teams/:id/owner\`.\n\n### Drift Status\n- **CONFIRMED DRIFT - HIGH**: Missing from docs.`,
    mutate: () => {
      const file = "src/routes/teams.ts";
      let content = fs.readFileSync(file, "utf-8");
      content = content.replace(
        "export default router;",
        '// PUT /api/teams/:id/owner\nrouter.put("/api/teams/:id/owner", (req: Request, res: Response) => {\n  const { newOwnerId } = req.body;\n  res.status(200).json({ success: true, ownerId: newOwnerId });\n});\n\nexport default router;'
      );
      fs.writeFileSync(file, content);
    }
  },
  {
    branch: "feat/notifications-mark-read-all",
    title: "feat(notifications): add POST /api/notifications/read-all endpoint",
    commitMsg: "feat(notifications): add mark all notifications as read route",
    body: `### Summary of API Changes\n- Adds route \`POST /api/notifications/read-all\`.\n\n### Drift Status\n- **CONFIRMED DRIFT - HIGH**: Missing from notifications docs.`,
    mutate: () => {
      const file = "src/routes/notifications.ts";
      let content = fs.readFileSync(file, "utf-8");
      content = content.replace(
        "export default router;",
        '// POST /api/notifications/read-all\nrouter.post("/api/notifications/read-all", (req: Request, res: Response) => {\n  res.status(200).json({ success: true, updatedCount: 4 });\n});\n\nexport default router;'
      );
      fs.writeFileSync(file, content);
    }
  },
  {
    branch: "feat/notifications-channel-query",
    title: "feat(notifications): support channel query filter in GET /api/notifications",
    commitMsg: "feat(notifications): add channel query filter",
    body: `### Summary of API Changes\n- Adds \`channel\` query parameter to \`GET /api/notifications\`.\n\n### Drift Status\n- **CONFIRMED DRIFT**: Query parameter not documented.`,
    mutate: () => {
      const file = "src/routes/notifications.ts";
      let content = fs.readFileSync(file, "utf-8");
      content = content.replace(
        'router.get("/api/notifications", (req: Request, res: Response) => {',
        'router.get("/api/notifications", (req: Request, res: Response) => {\n  const channel = req.query.channel;'
      );
      fs.writeFileSync(file, content);
    }
  },
  {
    branch: "docs/teams-clean-sync",
    title: "feat(teams): add description field and sync docs (Clean - NO DRIFT)",
    commitMsg: "feat(teams): add description field and update api.md",
    body: `### Summary of API Changes\n- Adds optional \`description\` field to \`POST /api/teams\` and updates documentation.\n\n### Drift Status\n- **NO DRIFT**: Code and docs are fully in sync.`,
    mutate: () => {
      const file = "src/routes/teams.ts";
      let content = fs.readFileSync(file, "utf-8");
      content = content.replace(
        "const { name } = req.body;",
        "const { name, description } = req.body;"
      );
      fs.writeFileSync(file, content);

      const doc = "docs/api.md";
      let docContent = fs.readFileSync(doc, "utf-8");
      docContent = docContent.replace(
        "- `name` (string, required): Name of the team.",
        "- `name` (string, required): Name of the team.\n- `description` (string, optional): Team description."
      );
      fs.writeFileSync(doc, docContent);
    }
  },
  {
    branch: "feat/analytics-date-range-query",
    title: "feat(analytics): add from and to query params to GET /api/analytics/summary",
    commitMsg: "feat(analytics): add date range query filters from and to",
    body: `### Summary of API Changes\n- Adds \`from\` and \`to\` query parameters to \`GET /api/analytics/summary\`.\n\n### Drift Status\n- **CONFIRMED DRIFT**: Query parameters omitted from docs.`,
    mutate: () => {
      const file = "src/routes/analytics.ts";
      let content = fs.readFileSync(file, "utf-8");
      content = content.replace(
        'router.get("/api/analytics/summary", (req: Request, res: Response) => {',
        'router.get("/api/analytics/summary", (req: Request, res: Response) => {\n  const from = req.query.from;\n  const to = req.query.to;'
      );
      fs.writeFileSync(file, content);
    }
  },
  {
    branch: "feat/analytics-csv-format-query",
    title: "feat(analytics): support format=csv query param in GET /api/analytics/summary",
    commitMsg: "feat(analytics): add format query parameter for csv exports",
    body: `### Summary of API Changes\n- Adds \`format\` query parameter to \`GET /api/analytics/summary\`.\n\n### Drift Status\n- **CONFIRMED DRIFT**: Format parameter omitted from documentation.`,
    mutate: () => {
      const file = "src/routes/analytics.ts";
      let content = fs.readFileSync(file, "utf-8");
      content = content.replace(
        'router.get("/api/analytics/summary", (req: Request, res: Response) => {',
        'router.get("/api/analytics/summary", (req: Request, res: Response) => {\n  const format = req.query.format;'
      );
      fs.writeFileSync(file, content);
    }
  },
  {
    branch: "fix/analytics-400-range-validation",
    title: "fix(analytics): return 400 Bad Request when date range exceeds 90 days",
    commitMsg: "fix(analytics): validate max 90-day range with 400 error status",
    body: `### Summary of API Changes\n- Returns \`400 Bad Request\` when the requested date range exceeds 90 days.\n\n### Drift Status\n- **CONFIRMED DRIFT**: \`docs/api.md\` does not document the 400 validation response.`,
    mutate: () => {
      const file = "src/routes/analytics.ts";
      let content = fs.readFileSync(file, "utf-8");
      content = content.replace(
        "res.status(200).json({",
        "if (req.query.from && req.query.to) {\n    // validate range\n    return res.status(400).json({ error: 'Date range cannot exceed 90 days' });\n  }\n  res.status(200).json({"
      );
      fs.writeFileSync(file, content);
    }
  }
];

async function main() {
  console.log(`Starting automated generation of ${PR_DEFINITIONS.length} test Pull Requests...`);
  
  const createdPRs = [];

  for (let i = 0; i < PR_DEFINITIONS.length; i++) {
    const item = PR_DEFINITIONS[i];
    const prNum = i + 1;
    console.log(`\n==============================================`);
    console.log(`[PR ${prNum}/${PR_DEFINITIONS.length}] Processing: ${item.title}`);
    console.log(`Branch: ${item.branch}`);

    try {
      // 1. Reset to main
      run("git checkout main");
      run("git reset --hard origin/main");

      // 2. Checkout or create feature branch
      run(`git checkout -B ${item.branch}`);

      // 3. Mutate files
      item.mutate();

      // 4. Commit changes
      run("git add .");
      run(`git commit -m "${item.commitMsg}"`);

      // 5. Push to GitHub
      run(`git push -u origin ${item.branch} --force`);

      // 6. Create PR with gh CLI (with retry logic)
      let prUrl = "";
      let attempts = 0;
      while (!prUrl && attempts < 3) {
        attempts++;
        try {
          // Write body to temporary file to avoid shell escaping issues
          const tempBodyFile = "temp_pr_body.txt";
          fs.writeFileSync(tempBodyFile, item.body);
          prUrl = run(`gh pr create --title "${item.title}" --body-file "${tempBodyFile}" --base main --head ${item.branch}`);
          if (fs.existsSync(tempBodyFile)) fs.unlinkSync(tempBodyFile);
        } catch (prErr) {
          console.warn(`Attempt ${attempts} failed to create PR: ${prErr.message}`);
          console.log("Waiting 10 seconds before retrying...");
          await sleep(10000);
        }
      }

      console.log(`✓ Successfully created PR: ${prUrl}`);
      createdPRs.push({ number: prNum, title: item.title, url: prUrl, branch: item.branch });

      // Small throttle to avoid GitHub secondary rate limits
      await sleep(1500);
    } catch (err) {
      console.error(`Failed to create PR ${prNum}:`, err.message);
    }
  }

  // Back to main
  run("git checkout main");
  run("git reset --hard origin/main");

  console.log("\n==============================================");
  console.log(`All ${createdPRs.length} Pull Requests have been successfully created!`);
  fs.writeFileSync("created_prs.json", JSON.stringify(createdPRs, null, 2));
}

main().catch(console.error);
