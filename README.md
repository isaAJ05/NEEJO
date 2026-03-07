# Módulo: Contratación de Servicio (MVP Académico)

**Grupo 5** — Marketplace de trabajos cortos

## 📋 Descripción del Proyecto

Sistema modular para gestionar el ciclo completo de contratación de servicios:  
**Publicar solicitud → Aceptar → Ejecutar → Finalizar → Cancelar/Reprogramar**

Este es un **MVP académico funcional** que incluye API REST, base de datos PostgreSQL y UI simple en React, aplicando 4 patrones de diseño obligatorios.

---

## 🏗️ Arquitectura y Stack Tecnológico

### Stack Obligatorio
- **Lenguaje**: TypeScript
- **Backend**: NestJS (REST API)
- **Frontend**: React
- **Base de Datos**: PostgreSQL
- **ORM**: Prisma
- **Control de versiones**: GitHub (ramas, PRs, issues)

### Estructura del Monorepo
```
NIDIU/
├── apps/
│   ├── backend/          # API REST en NestJS
│   └── frontend/         # UI en React
├── packages/
│   └── shared-types/     # Tipos TypeScript compartidos
├── docs/                 # Documentación (ADR, API, BD, Patrones)
├── scripts/              # Scripts de automatización
```

---

## 🎯 Alcance Mínimo del Módulo

### Entidades (5 tablas)
1. **Usuario** — Cliente o proveedor de servicio
2. **SolicitudServicio** — Publicación de necesidad de trabajo
3. **Cotizacion** — Presupuesto generado por el sistema
4. **OrdenServicio** — Contrato creado al aceptar
5. **HistorialEstado** — Registro de cambios de estado (auditoría)

### Endpoints (6 mínimos)
**CRUD básico (4):**
1. `POST /solicitudes` — Crear solicitud
2. `GET /solicitudes` — Listar solicitudes
3. `GET /ordenes/:id` — Consultar orden
4. `PATCH /ordenes/:id/cancelar` — Cancelar orden

**Consultas avanzadas (2):**
5. `GET /ordenes?estado=en_progreso` — Filtrar por estado
6. `GET /ordenes?desde=2026-01-01&hasta=2026-03-31` — Filtrar por rango de fechas

### Flujo UI Completo
1. **Listar** solicitudes y órdenes activas
2. **Crear/Actualizar** solicitud de servicio
3. **Acción clave**: Aceptar, cancelar o reprogramar orden

---

## 🧩 Patrones de Diseño Aplicados

### 1. Factory Method (Creacional)
**Ubicación**: `apps/backend/src/modules/contratacion/domain/factories/`  
**Propósito**: Crear instancias de `OrdenServicio` según tipo de contratación:
- `OrdenPorHoras`
- `OrdenPorTarea`
- `OrdenPorPaquete`

### 2. Facade (Estructural)
**Ubicación**: `apps/backend/src/modules/contratacion/infrastructure/facades/`  
**Propósito**: Simplificar la contratación con un solo punto de entrada que orquesta:
- Validar disponibilidad y datos
- Generar cotización
- Crear orden de servicio

### 3. Command (Comportamiento)
**Ubicación**: `apps/backend/src/modules/contratacion/application/commands/`  
**Propósito**: Encapsular acciones como objetos reutilizables:
- `CancelarOrdenCommand`
- `ReprogramarOrdenCommand`
- `ConfirmarEjecucionCommand`

### 4. Template Method (Comportamiento)
**Ubicación**: `apps/backend/src/modules/contratacion/domain/services/`  
**Propósito**: Definir flujo fijo de contratación con pasos variables según tipo de servicio.

---

## 🚀 Guía de Ejecución

### Pre-requisitos
- Node.js ≥ 18
- PostgreSQL ≥ 14
- npm o yarn

### 1. Instalación de dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
Crear `apps/backend/.env`:
```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/contratacion_db"
PORT=3000
```

### 3. Ejecutar migraciones de base de datos
```bash
cd apps/backend
npx prisma migrate dev
npx prisma generate
```

### 4. Iniciar Backend (modo desarrollo)
```bash
cd apps/backend
npm run start:dev
```
API disponible en: `http://localhost:3000`

### 5. Iniciar Frontend (modo desarrollo)
```bash
cd apps/frontend
npm run dev
```
UI disponible en: `http://localhost:5173`

---

## 📚 Documentación Adicional

- **[ADR (Decisiones de Arquitectura)](docs/adr/)** — Justificación de patrones y tecnologías
- **[API Endpoints](docs/api/)** — Especificación de rutas y contratos
- **[Modelo de Datos](docs/db/)** — Diagrama ER y documentación de entidades
- **[Patrones de Diseño](docs/patterns/)** — Diagramas UML y explicación de cada patrón

---

## 🧪 Testing

### Pruebas E2E (Backend)
```bash
cd apps/backend
npm run test:e2e
```

### Pruebas de componentes (Frontend)
```bash
cd apps/frontend
npm run test
```

---

## 👥 Equipo — Grupo 5

| Rol                | Responsabilidad                        |
|--------------------|----------------------------------------|
| Backend Lead       | Implementación de patrones y API       |
| Frontend Lead      | UI y consumo de endpoints              |
| DB/DevOps          | Prisma, migraciones y despliegue       |
| QA/Documentación   | Pruebas, validaciones y docs           |

---

## 📝 Flujo de Trabajo Git

### Ramas
- `main` — Código estable y funcional
- `develop` — Integración continua
- `feature/*` — Nuevas funcionalidades
- `fix/*` — Correcciones de bugs

### Pull Requests
1. Crear rama desde `develop`
2. Desarrollar funcionalidad con commits descriptivos
3. Abrir PR hacia `develop` usando plantilla `.github/PULL_REQUEST_TEMPLATE/`
4. Revisión de código por al menos 1 compañero
5. Merge una vez aprobado y sin conflictos

---

## 📦 Entregables Finales

- [ ] Código fuente funcional (API + UI)
- [ ] Base de datos con migraciones aplicadas
- [ ] README con instrucciones de ejecución
- [ ] Documentación de patrones (diagramas UML)
- [ ] 6 endpoints funcionales
- [ ] 1 flujo UI completo operativo
- [ ] Issues y PRs en GitHub
- [ ] Presentación final con demo en vivo

---

## 📄 Licencia

Proyecto académico — Universidad [Nombre] — 2026
