# NEEJO 💼

Plataforma para la contratación de servicios dentro de un
Marketplace de trabajos cortos, permite **publicar** una solicitud, **aceptarla**, **ejecutarla**, **finalizarla**, y también **cancelarla o reprogramarla**.
-> https://www.youtube.com/watch?v=Px94UDtl2g0

## Descripción general

NEEJO modela un flujo típico de contratación/ejecución de servicios, controlando estados y acciones permitidas en cada etapa.

### Funcionalidades principales

- Publicar solicitud
- Aceptar solicitud
- Ejecutar servicio
- Finalizar servicio
- Cancelar servicio
- Reprogramar servicio

## Arquitectura y patrones de diseño implementados

Este proyecto aplica **4 patrones** de diseño:

### 1) Creacional — Factory Method
Se usa para **crear órdenes** según el tipo de servicio:

- `Horas`
- `Tarea`
- `Paquete`

**Idea:** una fábrica decide qué clase concreta instanciar sin acoplar al cliente a implementaciones específicas.

### 2) Estructural — Facade
Se usa una fachada para el proceso de **contratar un servicio**, encapsulando pasos internos:

`validar → cotizar → generar orden`

**Idea:** ofrecer una API simple (un “front”) para un subsistema con varias operaciones.

### 3) Comportamiento — Command
Acciones como:

- `cancelar`
- `reprogramar`
- `confirmar`

se implementan como **comandos**, permitiendo:

- encapsular solicitudes como objetos
- registrar/encolar acciones
- extender acciones sin modificar el invocador

### 4) Template Method
Se define el “paso a paso” **fijo** del proceso de contratación, permitiendo variaciones por tipo de servicio en puntos específicos.

**Ejemplo conceptual:**
- Pasos fijos: validar → cotizar → crear orden → confirmar
- Pasos variables: reglas de cotización / validación específicas según `Horas` / `Tarea` / `Paquete`

## Instalación de dependencias

### Node.js (npm)
Requisitos:
- Node.js LTS
- npm

Instalación:
```bash
npm install
```

Ejecución:
```bash
npm run dev
```
## Uso (flujo básico)

1. **Publicar** una solicitud.
2. Un proveedor/servicio la **acepta**.
3. Se pasa a **ejecución**.
4. Se **finaliza** al completar.
5. Alternativamente, se puede **cancelar** o **reprogramar** usando comandos.
---
Por: Natalia Carpintero, Isabella Arrieta, Paula Núñez y Luis Robles
