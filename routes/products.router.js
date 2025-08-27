import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager("./data/products.json");

// Listar todos los productos
router.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.json(products);
});

// Obtener un producto por id
router.get("/:pid", async (req, res) => {
  const product = await productManager.getProductById(req.params.pid);
  product ? res.json(product) : res.status(404).json({ error: "Producto no encontrado" });
});

// Agregar un producto
router.post("/", async (req, res) => {
  const newProduct = await productManager.addProduct(req.body);
  res.status(201).json(newProduct);
});

// Actualizar un producto
router.put("/:pid", async (req, res) => {
  const updated = await productManager.updateProduct(req.params.pid, req.body);
  updated ? res.json(updated) : res.status(404).json({ error: "Producto no encontrado" });
});

// Eliminar un producto
router.delete("/:pid", async (req, res) => {
  const result = await productManager.deleteProduct(req.params.pid);
  result ? res.json(result) : res.status(404).json({ error: "Producto no encontrado" });
});

export default router;