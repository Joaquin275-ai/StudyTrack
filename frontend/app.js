const API_URL = "http://localhost:3000";

const loginSection = document.getElementById("login-section");
const registerSection = document.getElementById("register-section");
const appSection = document.getElementById("app-section");

const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const taskForm = document.getElementById("task-form");

const loginMessage = document.getElementById("login-message");
const registerMessage = document.getElementById("register-message");
const taskMessage = document.getElementById("task-message");

const tasksContainer = document.getElementById("tasks-container");
const loading = document.getElementById("loading");
const empty = document.getElementById("empty");

function obtenerToken() {
    return localStorage.getItem("studytrack_token");
}

function mostrarLogin() {
    loginSection.classList.remove("hidden");
    registerSection.classList.add("hidden");
    appSection.classList.add("hidden");
}

function mostrarRegistro() {
    loginSection.classList.add("hidden");
    registerSection.classList.remove("hidden");
    appSection.classList.add("hidden");
}

function mostrarApp() {
    loginSection.classList.add("hidden");
    registerSection.classList.add("hidden");
    appSection.classList.remove("hidden");
}

function cerrarSesion() {
    localStorage.removeItem("studytrack_token");
    localStorage.removeItem("studytrack_user");

    tasksContainer.innerHTML = "";

    mostrarLogin();
}

document.getElementById("show-register").addEventListener("click", () => {
    mostrarRegistro();
});

document.getElementById("show-login").addEventListener("click", () => {
    mostrarLogin();
});

document.getElementById("logout").addEventListener("click", () => {
    cerrarSesion();
});

/* =========================
   REGISTRO
========================= */

registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    registerMessage.textContent = "Registrando...";

    const nombre = document.getElementById("register-name").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;

    try {
        const response = await fetch(`${API_URL}/auth/registro`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre,
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            registerMessage.textContent = data.error;
            return;
        }

        registerMessage.textContent =
            "Cuenta creada correctamente. Ahora iniciá sesión.";

        registerForm.reset();

        setTimeout(() => {
            mostrarLogin();
            registerMessage.textContent = "";
        }, 1200);

    } catch (error) {
        registerMessage.textContent =
            "No se pudo conectar con el servidor.";
    }
});

/* =========================
   LOGIN
========================= */

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    loginMessage.textContent = "Iniciando sesión...";

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            loginMessage.textContent = data.error;
            return;
        }

        localStorage.setItem(
            "studytrack_token",
            data.token
        );

        localStorage.setItem(
            "studytrack_user",
            JSON.stringify(data.usuario)
        );

        loginForm.reset();
        loginMessage.textContent = "";

        document.getElementById("welcome").textContent =
            `Bienvenido/a, ${data.usuario.nombre}`;

        mostrarApp();

        cargarTareas();

    } catch (error) {
        loginMessage.textContent =
            "No se pudo conectar con el servidor.";
    }
});

/* =========================
   CREAR TAREA
========================= */

taskForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    taskMessage.textContent = "Guardando tarea...";

    const titulo = document.getElementById("task-title").value;
    const materia = document.getElementById("task-subject").value;
    const fecha_entrega = document.getElementById("task-date").value;
    const prioridad = document.getElementById("task-priority").value;
    const estado = document.getElementById("task-status").value;

    try {
        const response = await fetch(`${API_URL}/tareas`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${obtenerToken()}`
            },
            body: JSON.stringify({
                titulo,
                materia,
                fecha_entrega,
                prioridad,
                estado
            })
        });

        const data = await response.json();

        if (response.status === 401) {
            cerrarSesion();
            return;
        }

        if (!response.ok) {
            taskMessage.textContent = data.error;
            return;
        }

        taskMessage.textContent =
            "Tarea creada correctamente.";

        taskForm.reset();

        cargarTareas();

    } catch (error) {
        taskMessage.textContent =
            "No se pudo conectar con el servidor.";
    }
});

/* =========================
   CARGAR TAREAS
========================= */

async function cargarTareas() {
    loading.classList.remove("hidden");
    empty.classList.add("hidden");

    tasksContainer.innerHTML = "";

    try {
        const response = await fetch(`${API_URL}/tareas`, {
            headers: {
                Authorization: `Bearer ${obtenerToken()}`
            }
        });

        if (response.status === 401) {
            cerrarSesion();
            return;
        }

        const data = await response.json();

        loading.classList.add("hidden");

        if (!data.tareas || data.tareas.length === 0) {
            empty.classList.remove("hidden");
            return;
        }

        data.tareas.forEach((tarea) => {
            mostrarTarea(tarea);
        });

    } catch (error) {
        loading.classList.add("hidden");

        tasksContainer.textContent =
            "No se pudieron cargar las tareas.";
    }
}

/* =========================
   MOSTRAR TAREA
========================= */

function mostrarTarea(tarea) {
    const div = document.createElement("div");

    div.classList.add("task");

    const titulo = document.createElement("h4");
    titulo.textContent = tarea.titulo;

    const materia = document.createElement("p");
    materia.textContent = `Materia: ${tarea.materia}`;

    const fecha = document.createElement("p");
    fecha.textContent = `Entrega: ${tarea.fecha_entrega}`;

    /* PRIORIDAD */

    const prioridadTexto = document.createElement("p");

    prioridadTexto.textContent = "Prioridad: ";

    const prioridad = document.createElement("span");

    prioridad.textContent = tarea.prioridad;

    prioridad.classList.add("badge");

    if (tarea.prioridad === "alta") {
        prioridad.classList.add("badge-priority-high");
    } else if (tarea.prioridad === "media") {
        prioridad.classList.add("badge-priority-medium");
    } else {
        prioridad.classList.add("badge-priority-low");
    }

    prioridadTexto.appendChild(prioridad);

    /* ESTADO */

    const estadoTexto = document.createElement("p");

    estadoTexto.textContent = "Estado: ";

    const estado = document.createElement("span");

    estado.textContent = tarea.estado;

    estado.classList.add(
        "badge",
        "badge-status"
    );

    estadoTexto.appendChild(estado);

    /* BOTONES */

    const actions = document.createElement("div");

    actions.classList.add("task-actions");

    const editButton = document.createElement("button");

    editButton.textContent =
        tarea.estado === "completada"
            ? "Completada"
            : "Completar";

    editButton.classList.add("edit");

    if (tarea.estado === "completada") {
        editButton.disabled = true;
        editButton.style.opacity = "0.6";
        editButton.style.cursor = "default";
    } else {
        editButton.addEventListener("click", () => {
            actualizarEstado(tarea);
        });
    }

    const deleteButton = document.createElement("button");

    deleteButton.textContent = "Eliminar";

    deleteButton.classList.add("delete");

    deleteButton.addEventListener("click", () => {
        eliminarTarea(tarea.id);
    });

    actions.appendChild(editButton);
    actions.appendChild(deleteButton);

    /* ARMAR TARJETA */

    div.appendChild(titulo);
    div.appendChild(materia);
    div.appendChild(fecha);
    div.appendChild(prioridadTexto);
    div.appendChild(estadoTexto);
    div.appendChild(actions);

    tasksContainer.appendChild(div);
}

/* =========================
   COMPLETAR TAREA
========================= */

async function actualizarEstado(tarea) {
    try {
        const response = await fetch(
            `${API_URL}/tareas/${tarea.id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${obtenerToken()}`
                },

                body: JSON.stringify({
                    titulo: tarea.titulo,
                    materia: tarea.materia,
                    fecha_entrega: tarea.fecha_entrega,
                    prioridad: tarea.prioridad,
                    estado: "completada"
                })
            }
        );

        if (response.status === 401) {
            cerrarSesion();
            return;
        }

        if (!response.ok) {
            return;
        }

        cargarTareas();

    } catch (error) {
        tasksContainer.textContent =
            "No se pudo actualizar la tarea.";
    }
}

/* =========================
   ELIMINAR TAREA
========================= */

async function eliminarTarea(id) {
    const confirmar = confirm(
        "¿Querés eliminar esta tarea?"
    );

    if (!confirmar) {
        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/tareas/${id}`,
            {
                method: "DELETE",

                headers: {
                    Authorization: `Bearer ${obtenerToken()}`
                }
            }
        );

        if (response.status === 401) {
            cerrarSesion();
            return;
        }

        if (!response.ok) {
            return;
        }

        cargarTareas();

    } catch (error) {
        tasksContainer.textContent =
            "No se pudo eliminar la tarea.";
    }
}

/* =========================
   INICIAR APLICACIÓN
========================= */

function iniciarAplicacion() {
    const savedToken = obtenerToken();

    if (!savedToken) {
        mostrarLogin();
        return;
    }

    const usuarioGuardado =
        localStorage.getItem("studytrack_user");

    if (usuarioGuardado) {
        const usuario = JSON.parse(usuarioGuardado);

        document.getElementById("welcome").textContent =
            `Bienvenido/a, ${usuario.nombre}`;
    }

    mostrarApp();

    cargarTareas();
}

iniciarAplicacion();