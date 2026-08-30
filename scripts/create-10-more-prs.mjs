import { execSync } from "child_process";
import fs from "fs";

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
  {
    branch: "docs/products-clean-sync",
    title: "feat(products): add search query param and sync docs (Clean - NO DRIFT)",
    commitMsg: "feat(products): support search query and update api.md",
    body: `### Summary of API Changes\n- Adds \`search\` query filter to \`GET /api/products\` and documents it in \`docs/api.md\`.\n\n### Drift Status\n- **NO DRIFT**: Documentation is fully synchronized.`,
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
    body: `### Summary of API Changes\n- Adds \`tag\` query parameter to \`GET /api/products\`.\n\n### Drift Status\n- **CONFIRMED DRIFT**: Query parameter not in documentation.`,
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
    body: `### Summary of API Changes\n- Adds \`DELETE /api/products/:id\` returning status \`204\`.\n\n### Drift Status\n- **CONFIRMED DRIFT - HIGH**: Endpoint missing from documentation.`,
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
  }
];

async function main() {
  console.log(`Creating 10 additional PRs to reach exactly 25...`);

  for (let i = 0; i < PR_DEFINITIONS.length; i++) {
    const item = PR_DEFINITIONS[i];
    console.log(`\nProcessing [${i + 1}/10]: ${item.title}`);
    console.log(`Branch: ${item.branch}`);

    run("git checkout main");
    run("git reset --hard origin/main");
    run(`git checkout -B ${item.branch}`);

    item.mutate();

    run("git add .");
    run(`git commit -m "${item.commitMsg}"`);
    run(`git push -u origin ${item.branch} --force`);

    const tempBodyFile = "temp_pr_body.txt";
    fs.writeFileSync(tempBodyFile, item.body);
    const prUrl = run(`gh pr create --title "${item.title}" --body-file "${tempBodyFile}" --base main --head ${item.branch}`);
    if (fs.existsSync(tempBodyFile)) fs.unlinkSync(tempBodyFile);

    console.log(`Created: ${prUrl}`);
    await sleep(1500);
  }

  run("git checkout main");
  run("git reset --hard origin/main");
  console.log("\nFinished creating 10 PRs. Total PRs is now exactly 25.");
}

main().catch(console.error);
