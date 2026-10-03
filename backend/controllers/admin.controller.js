const adminService = require("../services/admin.service");

async function obtenerEstadisticas(req, res) {
    try {
        const estadisticas =
            await adminService.obtenerEstadisticas();

        res.json({
            estadisticas
        });
    } catch (error) {
        console.error("Error al obtener estadísticas:", error);

        res.status(500).json({
            error: "Error en el servidor"
        });
    }
}

module.exports = {
    obtenerEstadisticas
};