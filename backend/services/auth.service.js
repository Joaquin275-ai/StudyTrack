const bcrypt = require("bcrypt");
const pool = require("../config/db");

async function registrarUsuario(nombre, email, password) {
    const passwordHash = await bcrypt.hash(password, 10);

    const resultado = await pool.query(
        `INSERT INTO usuarios (nombre, email, password, rol, created_at)
         VALUES ($1, $2, $3, $4, NOW())
         RETURNING id, nombre, email, rol, created_at`,
        [nombre, email, passwordHash, "usuario"]
    );

    return resultado.rows[0];
}

async function buscarUsuarioPorEmail(email) {
    const resultado = await pool.query(
        `SELECT id, nombre, email, password, rol
         FROM usuarios
         WHERE email = $1`,
        [email]
    );

    return resultado.rows[0];
}

module.exports = {
    registrarUsuario,
    buscarUsuarioPorEmail
};