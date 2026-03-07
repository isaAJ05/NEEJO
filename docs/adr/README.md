# ADR 001: Selección de Arquitectura por Capas (Hexagonal Simplificada)

**Fecha:** 2026-03-06  
**Estado:** ✅ Aceptado  
**Contexto:** Módulo Contratación de Servicio (MVP Académico)

---

## Contexto

Necesitamos definir una arquitectura para el módulo de contratación que:

- Sea clara y comprensible para un equipo académico
- Facilite la aplicación explícita de patrones de diseño
- Permita separar lógica de negocio de infraestructura
- Mantenga el código desacoplado y testeable

---

## Decisión

Adoptamos una **arquitectura por capas inspirada en Hexagonal (Ports & Adapters)** con las siguientes capas:

```
presentation/      → Controladores (REST)
application/       → Casos de uso, Commands, DTOs
domain/            → Entidades, Factories, Services (lógica pura)
infrastructure/    → Prisma, Facades, persistencia
```

---

## Consecuencias

### Positivas ✅

- Lógica de negocio independiente de frameworks
- Facilita testing (mock de dependencias)
- Los patrones de diseño tienen ubicaciones claras
- Bajo acoplamiento entre capas

### Negativas ⚠️

- Mayor cantidad de archivos (más boilerplate)
- Curva de aprendizaje inicial
- Puede ser "over-engineering" para casos simples

---

## Alternativas Consideradas

1. **MVC tradicional:** Más simple pero mezcla lógica de negocio con controladores
2. **Clean Architecture completa:** Demasiado compleja para un MVP académico
3. **Monolito sin capas:** Rápido pero dificulta la aplicación de patrones

---

# ADR 002: Uso de Prisma como ORM

**Fecha:** 2026-03-06  
**Estado:** ✅ Aceptado

---

## Contexto

Necesitamos un ORM que:

- Soporte PostgreSQL
- Tenga tipado fuerte en TypeScript
- Sea fácil de aprender para el equipo
- Permita migraciones automáticas

---

## Decisión

Usamos **Prisma** como ORM principal.

---

## Consecuencias

### Positivas ✅

- Type-safety completo (errores en tiempo de desarrollo)
- Migraciones declarativas con `schema.prisma`
- Prisma Studio (UI para explorar datos)
- Auto-completado excelente en VSCode
- Documentación clara y activa

### Negativas ⚠️

- Curva de aprendizaje inicial con el schema
- Queries complejas pueden requerir SQL raw
- Menor control fino que SQL puro

---

## Alternativas Consideradas

1. **TypeORM:** Más verboso, decorators pueden ser confusos
2. **Sequelize:** Menos type-safe que Prisma
3. **SQL directo:** Mayor control pero propenso a errores

---

# ADR 003: Factory Method en Domain, Facade en Infrastructure

**Fecha:** 2026-03-06  
**Estado:** ✅ Aceptado

---

## Contexto

Debemos decidir dónde ubicar cada patrón de diseño para mantener coherencia arquitectónica.

---

## Decisión

| Patrón              | Ubicación                 | Justificación                           |
| ------------------- | ------------------------- | --------------------------------------- |
| **Factory Method**  | `domain/factories/`       | Es lógica pura de creación de entidades |
| **Facade**          | `infrastructure/facades/` | Orquesta servicios de infraestructura   |
| **Command**         | `application/commands/`   | Son casos de uso específicos            |
| **Template Method** | `domain/services/`        | Define algoritmos de negocio            |

---

## Consecuencias

### Positivas ✅

- Separación clara de responsabilidades
- Facilita entender dónde buscar cada patrón
- Domain permanece "puro" (sin dependencias de frameworks)

### Negativas ⚠️

- Requiere que el equipo entienda las capas primero

---

# ADR 004: React sin librerías de estado global

**Fecha:** 2026-03-06  
**Estado:** ✅ Aceptado

---

## Contexto

El frontend es simple (1 flujo UI completo). ¿Necesitamos Redux/Zustand/Context API?

---

## Decisión

**NO usamos librerías de estado global.** Usamos:

- `useState` + `useEffect` locales
- Props drilling (solo 2-3 niveles)
- Axios para llamadas API

---

## Consecuencias

### Positivas ✅

- Código más simple y directo
- Menos dependencias
- Más fácil para principiantes en React

### Negativas ⚠️

- Si el proyecto crece, puede requerir refactor
- Props drilling en componentes anidados

---

## Alternativas Consideradas

1. **Context API:** Útil pero añade complejidad innecesaria para este MVP
2. **Redux:** Overkill total para este caso
3. **Zustand:** Buena opción pero añade una dependencia más

---

# ADR 005: Validación con class-validator en DTOs

**Fecha:** 2026-03-06  
**Estado:** ✅ Aceptado

---

## Decisión

Usamos `class-validator` + `class-transformer` para validar requests.

**Ejemplo:**

```typescript
export class CreateSolicitudDto {
  @IsNotEmpty()
  @IsString()
  titulo: string;

  @IsEnum(TipoServicio)
  tipoServicio: TipoServicio;
}
```

---

## Consecuencias

### Positivas ✅

- Validación declarativa (más legible)
- Errores automáticos con mensajes claros
- Integración nativa con NestJS

### Negativas ⚠️

- Requiere crear clases DTO adicionales

---

# ADR 006: Auditoría con HistorialEstado (Inmutable)

**Fecha:** 2026-03-06  
**Estado:** ✅ Aceptado

---

## Decisión

Toda transición de estado en `OrdenServicio` se registra en `HistorialEstado` de forma **inmutable** (solo INSERT, nunca UPDATE/DELETE).

---

## Consecuencias

### Positivas ✅

- Trazabilidad completa de cambios
- Facilita debugging y análisis
- Cumple con principios de auditoría

### Negativas ⚠️

- Crece infinitamente (requiere archivado periódico en producción)
- Más escrituras en BD

---

# Resumen de Decisiones

| #   | Decisión                       | Estado      | Fecha      |
| --- | ------------------------------ | ----------- | ---------- |
| 001 | Arquitectura por capas         | ✅ Aceptado | 2026-03-06 |
| 002 | Prisma como ORM                | ✅ Aceptado | 2026-03-06 |
| 003 | Ubicación de patrones          | ✅ Aceptado | 2026-03-06 |
| 004 | Sin estado global              | ✅ Aceptado | 2026-03-06 |
| 005 | Validación con class-validator | ✅ Aceptado | 2026-03-06 |
| 006 | HistorialEstado inmutable      | ✅ Aceptado | 2026-03-06 |

---

## Formato de ADRs Futuros

```markdown
# ADR XXX: [Título]

**Fecha:** YYYY-MM-DD
**Estado:** Propuesto | Aceptado | Rechazado | Deprecado

## Contexto

[Descripción del problema]

## Decisión

[Descripción de la decisión tomada]

## Consecuencias

### Positivas ✅

### Negativas ⚠️

## Alternativas Consideradas
```

---

**Ubicación de este archivo:** `docs/adr/README.md`
