function soloAdmin(req, res, next) {
    if (req.usuario.rol !== "admin") {
        return res.status(403).json({
            error: "Acceso exclusivo para administradores"
        });
    }

    next();
}

module.exports = soloAdmin;