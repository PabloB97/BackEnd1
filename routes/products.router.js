import { Router } from "express";
import { io, productManager } from "../server.js"; // usamos la instancia creada en server.js

const router = Router();

// Obtener todos los productos
router.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.json(products);
});

// Agregar producto
router.post("/", async (req, res) => {
  const newProduct = await productManager.addProduct(req.body);

  // 🔥 Notificar a todos los clientes conectados que hay cambios
  io.emit("updateProducts", await productManager.getProducts());

  res.status(201).json(newProduct);
});

// Eliminar producto
router.delete("/:pid", async (req, res) => {
  const { pid } = req.params;
  await productManager.deleteProduct(parseInt(pid));

  // 🔥 Notificar la actualización
  io.emit("updateProducts", await productManager.getProducts());

  res.json({ message: "Producto eliminado" });
});

export default router;