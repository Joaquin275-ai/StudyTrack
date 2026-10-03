CREATE TABLE usuarios (
    id BIGINT PRIMARY KEY,
    nombre TEXT NOT NULL,
    email TEXT,
    password TEXT,
    rol TEXT,
    created_at TIMESTAMPTZ
);

CREATE TABLE tareas (
    id BIGINT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    titulo TEXT,
    materia TEXT,
    fecha_entrega DATE,
    prioridad TEXT,
    estado TEXT,
    created_at TIMESTAMPTZ,

    CONSTRAINT tareas_user_id_fkey
        FOREIGN KEY (user_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
);