const tareasService = require("../services/tareas.service");

async function obtenerTareas(req, res) {
    try {
        const tareas = await tareasService.obtenerTareas(req.usuario.id);

        res.json({
            tareas
        });
    } catch (error) {
        console.error("Error al obtener tareas:", error);

        res.status(500).json({
            error: "Error en el servidor"
        });
    }
}

async function obtenerTarea(req, res) {
    try {
        const tarea = await tareasService.obtenerTareaPorId(
            req.params.id,
            req.usuario.id
        );

        if (!tarea) {
            return res.status(404).json({
                error: "Tarea no encontrada"
            });
        }

        res.json({
            tarea
        });
    } catch (error) {
        console.error("Error al obtener tarea:", error);

        res.status(500).json({
            error: "Error en el servidor"
        });
    }
}

async function crearTarea(req, res) {
    try {
        const {
            titulo,
            materia,
            fecha_entrega,
            prioridad,
            estado
        } = req.body;

        if (!titulo || !materia || !fecha_entrega) {
            return res.status(400).json({
                error: "Título, materia y fecha de entrega son obligatorios"
            });
        }

        const tarea = await tareasService.crearTarea(
            req.usuario.id,
            {
                titulo,
                materia,
                fecha_entrega,
                prioridad: prioridad || "media",
                estado: estado || "pendiente"
            }
        );

        res.status(201).json({
            mensaje: "Tarea creada correctamente",
            tarea
        });
    } catch (error) {
        console.error("Error al crear tarea:", error);

        res.status(500).json({
            error: "Error en el servidor"
        });
    }
}

async function actualizarTarea(req, res) {
    try {
        const {
            titulo,
            materia,
            fecha_entrega,
            prioridad,
            estado
        } = req.body;

        if (!titulo || !materia || !fecha_entrega) {
            return res.status(400).json({
                error: "Título, materia y fecha de entrega son obligatorios"
            });
        }

        const tarea = await tareasService.actualizarTarea(
            req.params.id,
            req.usuario.id,
            {
                titulo,
                materia,
                fecha_entrega,
                prioridad: prioridad || "media",
                estado: estado || "pendiente"
            }
        );

        if (!tarea) {
            return res.status(404).json({
                error: "Tarea no encontrada"
            });
        }

        res.json({
            mensaje: "Tarea actualizada correctamente",
            tarea
        });
    } catch (error) {
        console.error("Error al actualizar tarea:", error);

        res.status(500).json({
            error: "Error en el servidor"
        });
    }
}

async function eliminarTarea(req, res) {
    try {
        const tarea = await tareasService.eliminarTarea(
            req.params.id,
            req.usuario.id
        );

        if (!tarea) {
            return res.status(404).json({
                error: "Tarea no encontrada"
            });
        }

        res.json({
            mensaje: "Tarea eliminada correctamente"
        });
    } catch (error) {
        console.error("Error al eliminar tarea:", error);

        res.status(500).json({
            error: "Error en el servidor"
        });
    }
}

module.exports = {
    obtenerTareas,
    obtenerTarea,
    crearTarea,
    actualizarTarea,
    eliminarTarea
};