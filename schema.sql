-- Esquema D1 para el gestor de cotizaciones.
--
-- Aplicar en local:
--   npx wrangler d1 execute alkance-cotizaciones --local --file=./schema.sql
-- Aplicar en producción (una vez creada la base y enlazada en Pages):
--   npx wrangler d1 execute alkance-cotizaciones --remote --file=./schema.sql
--
-- El contenido completo de la cotización vive en la columna `data` como JSON
-- (título, fases, ítems, footer). Las columnas sueltas existen solo para poder
-- listar y buscar sin abrir el JSON.

CREATE TABLE IF NOT EXISTS cotizaciones (
  id          TEXT PRIMARY KEY,           -- slug corto y público, usado en /c/:id
  titulo      TEXT NOT NULL DEFAULT '',
  cliente     TEXT NOT NULL DEFAULT '',
  fecha       TEXT NOT NULL DEFAULT '',   -- ISO YYYY-MM-DD
  estado      TEXT NOT NULL DEFAULT 'borrador', -- borrador | enviada
  version     INTEGER NOT NULL DEFAULT 1,
  total       INTEGER NOT NULL DEFAULT 0, -- suma de ítems, cacheada para el listado
  data        TEXT NOT NULL DEFAULT '{}', -- JSON con toda la cotización (VERSIONADO)
  avance      TEXT NOT NULL DEFAULT '{}', -- JSON de ejecución del proyecto (Gantt). NO versionado.
  ejecucion   TEXT NOT NULL DEFAULT '{}', -- JSON de planificación interna (fechaInicio, duraciones, pagos). NO versionado.
  created_at  TEXT NOT NULL,
  updated_at  TEXT NOT NULL
);

-- Para bases que ya existían antes de agregar el Gantt (ignora el error si ya está):
--   ALTER TABLE cotizaciones ADD COLUMN avance TEXT NOT NULL DEFAULT '{}';
-- Para bases anteriores al tablero interno (fechas + pagos):
--   ALTER TABLE cotizaciones ADD COLUMN ejecucion TEXT NOT NULL DEFAULT '{}';

CREATE INDEX IF NOT EXISTS idx_cotizaciones_updated ON cotizaciones (updated_at DESC);

-- Un snapshot por cada versión guardada: da el histórico y permite volver atrás.
CREATE TABLE IF NOT EXISTS revisiones (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  cotizacion_id  TEXT NOT NULL,
  version        INTEGER NOT NULL,
  total          INTEGER NOT NULL DEFAULT 0,
  data           TEXT NOT NULL,
  created_at     TEXT NOT NULL,
  FOREIGN KEY (cotizacion_id) REFERENCES cotizaciones (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_revisiones_cotizacion ON revisiones (cotizacion_id, version DESC);

-- Clientes: agenda reutilizable. Una cotización guarda el id + una copia de los
-- datos del cliente dentro de su JSON, así el histórico no cambia si luego se
-- edita la ficha del cliente.
CREATE TABLE IF NOT EXISTS clientes (
  id          TEXT PRIMARY KEY,
  nombre      TEXT NOT NULL DEFAULT '',
  empresa     TEXT NOT NULL DEFAULT '',
  rut         TEXT NOT NULL DEFAULT '',
  email       TEXT NOT NULL DEFAULT '',
  telefono    TEXT NOT NULL DEFAULT '',
  direccion   TEXT NOT NULL DEFAULT '',
  notas       TEXT NOT NULL DEFAULT '',
  created_at  TEXT NOT NULL,
  updated_at  TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_clientes_nombre ON clientes (nombre);

-- Configuración clave/valor. Hoy guarda 'emisor' = datos por defecto de
-- transferencia (los que llevan todas las cotizaciones nuevas).
CREATE TABLE IF NOT EXISTS config (
  clave       TEXT PRIMARY KEY,
  valor       TEXT NOT NULL,          -- JSON
  updated_at  TEXT NOT NULL
);
