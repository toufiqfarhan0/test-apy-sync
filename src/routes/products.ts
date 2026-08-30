import { Router, Request, Response } from "express";

const router = Router();

// GET /api/products - List products
router.get("/api/products", (req: Request, res: Response) => {
  res.status(200).json([
    { id: "prod_1", title: "Wireless Mouse", price: 2999 },
    { id: "prod_2", title: "Mechanical Keyboard", price: 8999 }
  ]);
});

// GET /api/products/:id - Product details
router.get("/api/products/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  res.status(200).json({ id, title: "Wireless Mouse", price: 2999 });
});

// POST /api/products - Create product
router.post("/api/products", (req: Request, res: Response) => {
  const { title, price, stockCount } = req.body;
  if (stockCount === undefined) return res.status(400).json({ error: 'stockCount required' });
  if (!title || price === undefined) {
    return res.status(400).json({ error: "Title and price are required" });
  }
  res.status(201).json({ id: "prod_3", title, price });
});

// PUT /api/products/:id - Update product
router.put("/api/products/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, price } = req.body;
  res.status(200).json({ id, title, price });
});

export default router;
