const express = require("express");
const tareasController = require("../controllers/tareas.controller");
const autenticar = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(autenticar);

router.get("/", tareasController.obtenerTareas);
router.get("/:id", tareasController.obtenerTarea);
router.post("/", tareasController.crearTarea);
router.put("/:id", tareasController.actualizarTarea);
router.delete("/:id", tareasController.eliminarTarea);

module.exports = router;