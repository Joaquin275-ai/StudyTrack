# StudyTrack

**StudyTrack** es una plataforma web pensada para estudiantes que necesitan organizar sus tareas y entregas por materia.

> “StudyTrack le sirve a estudiantes para organizar sus tareas y entregas por materia, que hoy suelen llevar en la cabeza, en WhatsApp o en notas del celular.”

---

## 🎯 Objetivo

El proyecto busca ofrecer una herramienta sencilla para que cada estudiante pueda:

* Crear una cuenta.
* Iniciar sesión de forma segura.
* Crear tareas y entregas.
* Organizarlas por materia.
* Establecer prioridad y estado.
* Consultar sus propias tareas.
* Actualizar tareas.
* Marcar tareas como completadas.
* Eliminar tareas.
* Mantener sus datos separados de los demás usuarios.

Además, existe una sección exclusiva para administradores con estadísticas generales de la plataforma.

---

## ✨ Funcionalidades

### 👤 Usuarios

* Registro de usuarios.
* Contraseñas almacenadas mediante `bcrypt`.
* Inicio de sesión.
* Autenticación mediante JWT.
* Tokens con expiración.
* Cierre de sesión.
* Protección de rutas privadas.

### 📝 Tareas

Cada tarea contiene:

* Título.
* Materia.
* Fecha de entrega.
* Prioridad.
* Estado.

Estados disponibles:

* Pendiente.
* En proceso.
* Completada.

Operaciones disponibles:

* Crear.
* Consultar.
* Consultar por ID.
* Actualizar.
* Eliminar.

### 👑 Administración

Los usuarios con rol `admin` pueden acceder a:

`GET /admin/estadisticas`

Esta ruta muestra:

* Cantidad de usuarios.
* Cantidad de tareas.
* Cantidad de tareas completadas.

---

## 🛠️ Tecnologías

### Backend

* Node.js
* Express
* PostgreSQL
* Supabase
* `pg`
* bcrypt
* JSON Web Token
* Helmet
* CORS
* express-rate-limit
* dotenv

### Frontend

* HTML5
* CSS3
* JavaScript
* Fetch API
* LocalStorage

### Diseño

La interfaz utiliza una estética académica inspirada en bibliotecas clásicas, con:

* Tonos beige y dorados.
* Tipografía de estilo medieval para títulos.
* Diseño responsive.
* Modo oscuro automático según la configuración del sistema.
* Estados visuales para tareas.
* Animaciones sutiles.

---

## 📁 Estructura del proyecto

```text
StudyTrack/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── admin.controller.js
│   │   ├── auth.controller.js
│   │   └── tareas.controller.js
│   │
│   ├── middlewares/
│   │   ├── admin.middleware.js
│   │   ├── auth.middleware.js
│   │   └── rateLimiter.middleware.js
│   │
│   ├── routes/
│   │   ├── admin.routes.js
│   │   ├── auth.routes.js
│   │   └── tareas.routes.js
│   │
│   ├── services/
│   │   ├── admin.service.js
│   │   ├── auth.service.js
│   │   └── tareas.service.js
│   │
│   ├── .env
│   ├── .env.example
│   └── server.js
│
├── frontend/
│   ├── app.js
│   ├── index.html
│   └── style.css
│
├── .gitignore
├── package.json
├── README.md
└── requests.http
```

---

## ⚙️ Instalación

Clonar el repositorio:

```bash
git clone URL_DEL_REPOSITORIO
```

Entrar al proyecto:

```bash
cd StudyTrack
```

Instalar dependencias:

```bash
pnpm install
```

---

## 🔐 Variables de entorno

Crear un archivo:

```text
.env
```

con las siguientes variables:

```env
PORT=3000
DATABASE_URL=
SUPABASE_URL=
SUPABASE_KEY=
JWT_SECRET=
FRONTEND_URL=http://localhost:5500
```

Los valores reales de las variables de entorno no deben subirse al repositorio.

El archivo `.env` está incluido en `.gitignore`.

---

## ▶️ Ejecutar el backend

Desde la raíz del proyecto:

```bash
pnpm run dev
```

El servidor estará disponible en:

```text
http://localhost:3000
```

---

## 🌐 Ejecutar el frontend

El frontend está compuesto por archivos estáticos.

Puede abrirse mediante una extensión como **Five Server** desde VS Code.

Por ejemplo:

```text
http://localhost:5500
```

---

## 🔑 Autenticación

### Registrar usuario

```http
POST /auth/registro
```

Ejemplo:

```json
{
  "nombre": "Joaquin",
  "email": "usuario@example.com",
  "password": "123456"
}
```

### Iniciar sesión

```http
POST /auth/login
```

El servidor devuelve un JWT que posteriormente se utiliza mediante:

```http
Authorization: Bearer TOKEN
```

---

## 📝 Endpoints de tareas

Todas las rutas de tareas requieren autenticación.

### Obtener tareas

```http
GET /tareas
```

### Obtener una tarea

```http
GET /tareas/:id
```

### Crear tarea

```http
POST /tareas
```

Ejemplo:

```json
{
  "titulo": "Estudiar funciones",
  "materia": "Matemática",
  "fecha_entrega": "2026-10-10",
  "prioridad": "alta",
  "estado": "pendiente"
}
```

### Actualizar tarea

```http
PUT /tareas/:id
```

### Eliminar tarea

```http
DELETE /tareas/:id
```

---

## 👑 Administración

La ruta:

```http
GET /admin/estadisticas
```

requiere:

1. Un JWT válido.
2. Que el usuario tenga el rol `admin`.

Un usuario autenticado sin permisos recibe:

```text
403 Forbidden
```

Un usuario sin token recibe:

```text
401 Unauthorized
```

---

## 🛡️ Seguridad

StudyTrack implementa diferentes medidas de seguridad:

### Contraseñas

Las contraseñas no se almacenan directamente.

Se utiliza:

```text
bcrypt
```

para generar hashes.

### JWT

La autenticación utiliza tokens JWT con expiración.

### SQL Injection

Las consultas utilizan parámetros:

```sql
WHERE email = $1
```

en lugar de concatenar directamente datos proporcionados por el usuario.

### Aislamiento de usuarios

Las tareas se consultan utilizando simultáneamente:

```sql
WHERE id = $1 AND user_id = $2
```

Esto evita que un usuario pueda acceder o modificar tareas pertenecientes a otra cuenta.

### Helmet

Se utiliza Helmet para agregar headers de seguridad HTTP.

### CORS

El backend solamente permite el origen configurado en:

```env
FRONTEND_URL
```

### Rate limiting

El login posee un límite de:

```text
5 intentos cada 15 minutos
```

Superado el límite, la API responde:

```text
429 Too Many Requests
```

### Variables de entorno

Los secretos y credenciales se almacenan mediante variables de entorno.

El archivo `.env` no se incluye en Git.

---

## 🧪 Pruebas

El archivo:

```text
requests.http
```

contiene ejemplos para probar el funcionamiento completo de la API.

Incluye:

* Registro.
* Login.
* Autenticación.
* CRUD de tareas.
* SQL Injection.
* Validación de datos.
* Acceso sin token.
* Tareas inexistentes.
* Ruta administrativa.
* Health check.

---

## ❤️ Problema que resuelve

Los estudiantes suelen organizar sus tareas utilizando distintos medios:

* Memoria.
* WhatsApp.
* Notas del celular.
* Hojas de papel.
* Distintos calendarios.

StudyTrack centraliza esta información en una única aplicación para facilitar el seguimiento de tareas y entregas.

---

## 🚀 Estado del proyecto

Proyecto desarrollado como trabajo final, con:

* Backend funcional.
* Base de datos PostgreSQL mediante Supabase.
* Autenticación segura.
* CRUD completo.
* Aislamiento por usuario.
* Ruta administrativa.
* Medidas de seguridad.
* Frontend funcional.
* Diseño responsive.

---

## 📌 Autor

Proyecto desarrollado por **Joaquín Alvarez**.
