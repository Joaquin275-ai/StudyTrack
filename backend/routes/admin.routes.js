const express = require("express");

const adminController = require("../controllers/admin.controller");
const autenticar = require("../middlewares/auth.middleware");
const soloAdmin = require("../middlewares/admin.middleware");

const router = express.Router();

router.get(
    "/estadisticas",
    autenticar,
    soloAdmin,
    adminController.obtenerEstadisticas
);

module.exports = router;