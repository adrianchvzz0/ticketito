const express = require("express");
const cors = require("cors");
const routes = require("./routes");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Carga rutas
app.use("/", routes);

// Middleware de errores
app.use((err, req, res, next) => {

    console.error(err);
    res.status(500).json({ error: "Algo salió mal en el servidor" });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
