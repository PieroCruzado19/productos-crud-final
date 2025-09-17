const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas API
const productosRoutes = require("./routes/productos");
app.use("/api/productos", productosRoutes);

// Servir archivos estáticos (Frontend desde /public)
app.use(express.static(path.join(__dirname, "public")));

// Si no encuentra ruta en la API, devuelve index.html del frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Conexión a MongoDB (Atlas)
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("✅ Conectado a MongoDB Atlas"))
  .catch(err => console.error("❌ Error de conexión:", err));

// Servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
