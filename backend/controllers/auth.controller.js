const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authService = require("../services/auth.service");

async function registrar(req, res) {
    try {
        const { nombre, email, password } = req.body;

        if (!nombre || !email || !password) {
            return res.status(400).json({
                error: "Nombre, email y contraseña son obligatorios"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                error: "La contraseña debe tener al menos 6 caracteres"
            });
        }

        const usuario = await authService.registrarUsuario(
            nombre,
            email,
            password
        );

        res.status(201).json({
            mensaje: "Usuario registrado correctamente",
            usuario
        });
    } catch (error) {
        console.error("Error en registro:", error);

        if (error.code === "23505") {
            return res.status(409).json({
                error: "El email ya está registrado"
            });
        }

        res.status(500).json({
            error: "Error en el servidor"
        });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: "Email y contraseña son obligatorios"
            });
        }

        const usuario = await authService.buscarUsuarioPorEmail(email);

        if (!usuario) {
            return res.status(401).json({
                error: "Credenciales inválidas"
            });
        }

        const passwordCorrecta = await bcrypt.compare(
            password,
            usuario.password
        );

        if (!passwordCorrecta) {
            return res.status(401).json({
                error: "Credenciales inválidas"
            });
        }

        const token = jwt.sign(
            {
                id: usuario.id,
                rol: usuario.rol
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "2h"
            }
        );

        res.status(200).json({
            mensaje: "Login exitoso",
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
            }
        });
    } catch (error) {
        console.error("Error en login:", error);

        res.status(500).json({
            error: "Error en el servidor"
        });
    }
}

module.exports = {
    registrar,
    login
};