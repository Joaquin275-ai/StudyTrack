require("dotenv").config();

const express = require("express");
const pool = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const autenticar = require("./middlewares/auth.middleware");
const tareasRoutes = require("./routes/tareas.routes");
const cors = require("cors");
const helmet = require("helmet");
const adminRoutes = require("./routes/admin.routes");

const app = express();

app.use(helmet());

app.use(cors({
    origin: process.env.FRONTEND_URL
}));

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/tareas", tareasRoutes);
app.use("/admin", adminRoutes);

app.get("/salud", async (req, res) => {
    try {
        const resultado = await pool.query("SELECT NOW()");

        res.status(200).json({
            mensaje: "StudyTrack API funcionando",
            baseDeDatos: "Conectada",
            hora: resultado.rows[0].now
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "Error al conectar con la base de datos"
        });
    }
});
app.get("/privado", autenticar, (req, res) => {
    res.json({
        mensaje: "Entraste a una ruta protegida",
        usuario: req.usuario
    });
});
app.listen(PORT, () => {
    console.log(`StudyTrack API funcionando en http://localhost:${PORT}`);
});