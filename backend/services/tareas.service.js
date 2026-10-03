const pool = require("../config/db");

async function obtenerTareas(userId) {
    const resultado = await pool.query(
        `SELECT id, user_id, titulo, materia, fecha_entrega, prioridad, estado, created_at
         FROM tareas
         WHERE user_id = $1
         ORDER BY fecha_entrega ASC`,
        [userId]
    );

    return resultado.rows;
}

async function obtenerTareaPorId(id, userId) {
    const resultado = await pool.query(
        `SELECT id, user_id, titulo, materia, fecha_entrega, prioridad, estado, created_at
         FROM tareas
         WHERE id = $1 AND user_id = $2`,
        [id, userId]
    );

    return resultado.rows[0];
}

async function crearTarea(userId, datos) {
    const { titulo, materia, fecha_entrega, prioridad, estado } = datos;

    const resultado = await pool.query(
        `INSERT INTO tareas
        (user_id, titulo, materia, fecha_entrega, prioridad, estado, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW())
        RETURNING id, user_id, titulo, materia, fecha_entrega, prioridad, estado, created_at`,
        [
            userId,
            titulo,
            materia,
            fecha_entrega,
            prioridad,
            estado
        ]
    );

    return resultado.rows[0];
}

async function actualizarTarea(id, userId, datos) {
    const { titulo, materia, fecha_entrega, prioridad, estado } = datos;

    const resultado = await pool.query(
        `UPDATE tareas
         SET titulo = $1,
             materia = $2,
             fecha_entrega = $3,
             prioridad = $4,
             estado = $5
         WHERE id = $6 AND user_id = $7
         RETURNING id, user_id, titulo, materia, fecha_entrega, prioridad, estado, created_at`,
        [
            titulo,
            materia,
            fecha_entrega,
            prioridad,
            estado,
            id,
            userId
        ]
    );

    return resultado.rows[0];
}

async function eliminarTarea(id, userId) {
    const resultado = await pool.query(
        `DELETE FROM tareas
         WHERE id = $1 AND user_id = $2
         RETURNING id`,
        [id, userId]
    );

    return resultado.rows[0];
}

module.exports = {
    obtenerTareas,
    obtenerTareaPorId,
    crearTarea,
    actualizarTarea,
    eliminarTarea
};