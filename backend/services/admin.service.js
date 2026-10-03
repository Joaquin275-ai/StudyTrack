const pool = require("../config/db");

async function obtenerEstadisticas() {
    const usuarios = await pool.query(
        "SELECT COUNT(*) FROM usuarios"
    );

    const tareas = await pool.query(
        "SELECT COUNT(*) FROM tareas"
    );

    const completadas = await pool.query(
        "SELECT COUNT(*) FROM tareas WHERE estado = $1",
        ["completada"]
    );

    return {
        usuarios: Number(usuarios.rows[0].count),
        tareas: Number(tareas.rows[0].count),
        tareasCompletadas: Number(completadas.rows[0].count)
    };
}

module.exports = {
    obtenerEstadisticas
};