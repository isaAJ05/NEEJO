# Modelo de Datos - Módulo Contratación

## Diagrama Entidad-Relación (ER)

```
┌─────────────────────┐
│      Usuario        │
├─────────────────────┤
│ id (PK)             │
│ nombre              │
│ email (UNIQUE)      │
│ telefono            │
│ rol                 │──┐
│ createdAt           │  │
│ updatedAt           │  │
└─────────────────────┘  │
          │              │
          │              │
          │ 1:N          │ 1:N (como cliente)
          ▼              │
┌──────────────────────────┐
│  SolicitudServicio       │
├──────────────────────────┤
│ id (PK)                  │
│ titulo                   │
│ descripcion              │
│ clienteId (FK) ──────────┘
│ tipoServicio             │
│ presupuestoEstimado      │
│ estado                   │
│ createdAt                │
│ updatedAt                │
└─────────┬────────────────┘
          │
          │ 1:N
          ▼
┌──────────────────────┐
│     Cotizacion       │
├──────────────────────┤
│ id (PK)              │
│ solicitudId (FK)     │
│ montoTotal           │
│ duracionEstimadaHoras│
│ descripcionDetalle   │
│ createdAt            │
│ updatedAt            │
└──────────┬───────────┘
           │
           │ 1:1
           ▼
┌──────────────────────────┐
│    OrdenServicio         │
├──────────────────────────┤
│ id (PK)                  │
│ codigoOrden (UNIQUE)     │
│ solicitudId (FK)         │
│ cotizacionId (FK)        │
│ clienteId (FK) ──────────┐
│ proveedorId (FK)         │ 1:N (como cliente)
│ tipoServicio             │ 1:N (como proveedor)
│ montoTotal               │
│ estado                   │────┐
│ fechaInicio              │    │
│ fechaFinalizacion        │    │
│ motivoCancelacion        │    │
│ createdAt                │    │
│ updatedAt                │    │
└─────────┬────────────────┘    │
          │                     │
          │ 1:N                 │
          ▼                     │
┌──────────────────────┐        │
│  HistorialEstado     │        │
├──────────────────────┤        │
│ id (PK)              │        │
│ ordenId (FK) ────────┘        │
│ estadoAnterior               │
│ estadoNuevo                  │
│ motivo                       │
│ cambiadoPor                  │
│ createdAt                    │
└──────────────────────┘
```

---

## Entidades Detalladas

### 1. Usuario

Representa tanto clientes como proveedores del marketplace.

| Campo       | Tipo     | Restricciones    | Descripción               |
| ----------- | -------- | ---------------- | ------------------------- |
| `id`        | UUID     | PK, NOT NULL     | Identificador único       |
| `nombre`    | String   | NOT NULL         | Nombre completo           |
| `email`     | String   | UNIQUE, NOT NULL | Correo electrónico        |
| `telefono`  | String   | NULLABLE         | Teléfono de contacto      |
| `rol`       | Enum     | DEFAULT: CLIENTE | CLIENTE, PROVEEDOR, AMBOS |
| `createdAt` | DateTime | AUTO             | Fecha de registro         |
| `updatedAt` | DateTime | AUTO             | Última actualización      |

**Relaciones:**

- 1:N con `SolicitudServicio` (como cliente)
- 1:N con `OrdenServicio` (como cliente)
- 1:N con `OrdenServicio` (como proveedor)

**Índices:**

- `email` (UNIQUE)

---

### 2. SolicitudServicio

Representa la publicación inicial de necesidad de un servicio.

| Campo                 | Tipo     | Restricciones      | Descripción                       |
| --------------------- | -------- | ------------------ | --------------------------------- |
| `id`                  | UUID     | PK, NOT NULL       | Identificador único               |
| `titulo`              | String   | NOT NULL           | Título breve de la solicitud      |
| `descripcion`         | String   | NOT NULL           | Descripción detallada             |
| `clienteId`           | UUID     | FK, NOT NULL       | Referencia a Usuario              |
| `tipoServicio`        | Enum     | NOT NULL           | POR_HORAS, POR_TAREA, POR_PAQUETE |
| `presupuestoEstimado` | Float    | NULLABLE           | Presupuesto tentativo del cliente |
| `estado`              | Enum     | DEFAULT: PENDIENTE | Estado actual de la solicitud     |
| `createdAt`           | DateTime | AUTO               | Fecha de creación                 |
| `updatedAt`           | DateTime | AUTO               | Última actualización              |

**Estados válidos:**

- `PENDIENTE`
- `EN_COTIZACION`
- `COTIZADA`
- `ACEPTADA`
- `RECHAZADA`
- `CANCELADA`

**Relaciones:**

- N:1 con `Usuario` (clienteId)
- 1:N con `Cotizacion`
- 1:N con `OrdenServicio`

**Índices:**

- `clienteId`
- `estado`
- `tipoServicio`

---

### 3. Cotizacion

Presupuesto generado por el sistema para una solicitud.

| Campo                   | Tipo     | Restricciones | Descripción                    |
| ----------------------- | -------- | ------------- | ------------------------------ |
| `id`                    | UUID     | PK, NOT NULL  | Identificador único            |
| `solicitudId`           | UUID     | FK, NOT NULL  | Referencia a SolicitudServicio |
| `montoTotal`            | Float    | NOT NULL      | Monto total cotizado           |
| `duracionEstimadaHoras` | Float    | NULLABLE      | Duración estimada en horas     |
| `descripcionDetalle`    | String   | NULLABLE      | Detalles de la cotización      |
| `createdAt`             | DateTime | AUTO          | Fecha de generación            |
| `updatedAt`             | DateTime | AUTO          | Última actualización           |

**Relaciones:**

- N:1 con `SolicitudServicio`
- 1:1 con `OrdenServicio`

**Índices:**

- `solicitudId`

---

### 4. OrdenServicio (Entidad Principal)

Representa el contrato formal tras aceptar una cotización.

| Campo               | Tipo     | Restricciones        | Descripción                       |
| ------------------- | -------- | -------------------- | --------------------------------- |
| `id`                | UUID     | PK, NOT NULL         | Identificador único               |
| `codigoOrden`       | String   | UNIQUE, NOT NULL     | Código legible (ej: ORD-ABC123)   |
| `solicitudId`       | UUID     | FK, NOT NULL         | Referencia a SolicitudServicio    |
| `cotizacionId`      | UUID     | FK, UNIQUE, NOT NULL | Referencia a Cotizacion           |
| `clienteId`         | UUID     | FK, NOT NULL         | Cliente que contrató              |
| `proveedorId`       | UUID     | FK, NULLABLE         | Proveedor asignado                |
| `tipoServicio`      | Enum     | NOT NULL             | POR_HORAS, POR_TAREA, POR_PAQUETE |
| `montoTotal`        | Float    | NOT NULL             | Monto definitivo a pagar          |
| `estado`            | Enum     | DEFAULT: CREADA      | Estado actual de la orden         |
| `fechaInicio`       | DateTime | NULLABLE             | Fecha de inicio del trabajo       |
| `fechaFinalizacion` | DateTime | NULLABLE             | Fecha de finalización             |
| `motivoCancelacion` | String   | NULLABLE             | Razón si fue cancelada            |
| `createdAt`         | DateTime | AUTO                 | Fecha de creación                 |
| `updatedAt`         | DateTime | AUTO                 | Última actualización              |

**Estados válidos:**

- `CREADA`: Orden generada, sin asignar
- `ASIGNADA`: Proveedor asignado
- `EN_PROGRESO`: En ejecución
- `COMPLETADA`: Finalizada exitosamente
- `CANCELADA`: Cancelada
- `REPROGRAMADA`: Fecha reprogramada

**Relaciones:**

- N:1 con `SolicitudServicio`
- 1:1 con `Cotizacion`
- N:1 con `Usuario` (clienteId)
- N:1 con `Usuario` (proveedorId)
- 1:N con `HistorialEstado`

**Índices:**

- `codigoOrden` (UNIQUE)
- `clienteId`
- `proveedorId`
- `estado`
- `tipoServicio`
- `createdAt`

---

### 5. HistorialEstado (Auditoría)

Registro inmutable de todos los cambios de estado en órdenes.

| Campo            | Tipo     | Restricciones | Descripción                          |
| ---------------- | -------- | ------------- | ------------------------------------ |
| `id`             | UUID     | PK, NOT NULL  | Identificador único                  |
| `ordenId`        | UUID     | FK, NOT NULL  | Referencia a OrdenServicio           |
| `estadoAnterior` | Enum     | NULLABLE      | Estado previo (null en creación)     |
| `estadoNuevo`    | Enum     | NOT NULL      | Estado nuevo                         |
| `motivo`         | String   | NULLABLE      | Razón del cambio                     |
| `cambiadoPor`    | String   | NULLABLE      | Usuario o sistema que hizo el cambio |
| `createdAt`      | DateTime | AUTO          | Timestamp del cambio                 |

**Relaciones:**

- N:1 con `OrdenServicio`

**Índices:**

- `ordenId`
- `createdAt`

**Características:**

- Solo permite INSERT, no UPDATE ni DELETE (auditoría inmutable)
- Permite rastrear toda la trazabilidad de una orden

---

## Enums Definidos

### TipoServicio

```typescript
enum TipoServicio {
  POR_HORAS    // Cobro por hora trabajada
  POR_TAREA    // Cobro por tarea completa
  POR_PAQUETE  // Cobro por paquete de entregables
}
```

### RolUsuario

```typescript
enum RolUsuario {
  CLIENTE      // Solo contrata servicios
  PROVEEDOR    // Solo provee servicios
  AMBOS        // Puede ser cliente y proveedor
}
```

### EstadoSolicitud

```typescript
enum EstadoSolicitud {
  PENDIENTE      // Inicial
  EN_COTIZACION  // Generando presupuesto
  COTIZADA       // Presupuesto generado
  ACEPTADA       // Cliente aceptó, orden creada
  RECHAZADA      // Cliente rechazó
  CANCELADA      // Cancelada antes de aceptar
}
```

### EstadoOrden

```typescript
enum EstadoOrden {
  CREADA        // Orden generada
  ASIGNADA      // Proveedor asignado
  EN_PROGRESO   // En ejecución
  COMPLETADA    // Finalizada
  CANCELADA     // Cancelada
  REPROGRAMADA  // Fecha reprogramada
}
```

---

## Reglas de Negocio (Constraints)

1. **Integridad referencial:**
   - Al eliminar un Usuario → se eliminan en cascada sus SolicitudServicio
   - Al eliminar una SolicitudServicio → se eliminan en cascada Cotizaciones y HistorialEstado
   - Al eliminar una OrdenServicio → se elimina en cascada su HistorialEstado

2. **Validaciones:**
   - `email` debe ser único en Usuario
   - `codigoOrden` debe ser único en OrdenServicio
   - `cotizacionId` debe ser único en OrdenServicio (relación 1:1)
   - `montoTotal` debe ser > 0

3. **Estados:**
   - Una solicitud `ACEPTADA` no puede volver a `PENDIENTE`
   - Una orden `COMPLETADA` no puede cambiar a otro estado
   - Una orden `CANCELADA` solo puede provenir de `CREADA`, `ASIGNADA` o `EN_PROGRESO`

---

## Scripts de Migración

### Crear Base de Datos

```bash
cd apps/backend
npx prisma migrate dev --name init
```

### Generar Cliente Prisma

```bash
npx prisma generate
```

### Abrir Prisma Studio (UI)

```bash
npx prisma studio
```

---

## Consultas SQL Útiles

### Ver todas las órdenes con cliente y proveedor

```sql
SELECT
  o.codigoOrden,
  o.estado,
  o.montoTotal,
  c.nombre AS cliente,
  p.nombre AS proveedor
FROM ordenes_servicio o
LEFT JOIN usuarios c ON o.clienteId = c.id
LEFT JOIN usuarios p ON o.proveedorId = p.id
ORDER BY o.createdAt DESC;
```

### Historial completo de una orden

```sql
SELECT
  h.createdAt,
  h.estadoAnterior,
  h.estadoNuevo,
  h.motivo,
  h.cambiadoPor
FROM historial_estados h
WHERE h.ordenId = 'uuid-aqui'
ORDER BY h.createdAt ASC;
```

### Órdenes por estado (reporte)

```sql
SELECT
  estado,
  COUNT(*) AS cantidad,
  SUM(montoTotal) AS total_ingresos
FROM ordenes_servicio
GROUP BY estado;
```

---

## Ubicación del Schema

📁 `apps/backend/prisma/schema.prisma`

## Migraciones

📁 `apps/backend/prisma/migrations/`

---

## Notas de Implementación

- Se usa UUID v4 para todos los IDs (mejor para sistemas distribuidos)
- Timestamps automáticos con `@default(now())` y `@updatedAt`
- Índices agregados en campos frecuentemente consultados (estado, fechas, FKs)
- Delete en cascada para mantener integridad referencial
- El modelo cumple con 3NF (Tercera Forma Normal)
