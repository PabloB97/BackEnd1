import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import ProductManager from "./managers/ProductManager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const PORT = 8080;

// 📌 Instancia de ProductManager
const productManager = new ProductManager(path.join(__dirname, "data", "products.json"));

// --- Middlewares ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Handlebars config ---
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// --- Rutas API ---
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// --- Vistas ---
app.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("home", { products });
});

app.get("/realtimeproducts", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("realTimeProducts", { products });
});

// --- WebSockets ---
io.on("connection", async (socket) => {
  console.log("🟢 Nuevo cliente conectado");

  // Enviar productos iniciales
  socket.emit("updateProducts", await productManager.getProducts());
});

// 📌 Exportamos io para usarlo en los routers
export { io, productManager };

httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});