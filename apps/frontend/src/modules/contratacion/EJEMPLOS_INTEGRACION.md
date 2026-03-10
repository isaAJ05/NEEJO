# Demo Frontend - Contratacion de Servicio

## Objetivo
Esta demo permite que un usuario unico (rol `AMBOS`) pueda:
- Publicar solicitudes.
- Tomar solicitudes de otros usuarios.
- Ejecutar, finalizar, cancelar y reprogramar ordenes.
- Ver servicios publicos y servicios privados solo entre partes.

## Usuarios de demo (seed)
- `ana@demo.com`
- `bruno@demo.com`
- `carla@demo.com`
- `diego@demo.com`

Todos pueden contratar y ofrecer servicios.

## Reglas de visibilidad implementadas
- Solicitudes sin tomar (`PENDIENTE` y sin orden) se muestran a todos en `Solicitudes`.
- Cuando alguien toma una solicitud, deja de aparecer en el marketplace publico.
- Las ordenes tomadas solo se ven en `Ordenes` para:
  - quien publico/contrato (`clienteId`),
  - quien tomo/ofrece el servicio (`proveedorId`).

## Flujo recomendado de demo
1. Iniciar sesion con `ana@demo.com`.
2. Ir a `Solicitudes` y crear una solicitud nueva desde `+ Nueva Solicitud`.
3. Cerrar sesion y entrar con `bruno@demo.com`.
4. Ir a `Solicitudes` y usar `Tomar servicio` sobre una solicitud publica.
5. Ir a `Ordenes` para iniciar (`Iniciar`) y luego finalizar (`Finalizar`) la orden.
6. Volver a `ana@demo.com` y verificar que ve esa misma orden en sus contrataciones.

## Comandos de arranque
Desde la raiz del repositorio:

```bash
npm install
npm run db:generate
npm run db:seed
npm run dev
```

Si usas Docker para PostgreSQL, verifica que `DATABASE_URL` en `apps/backend/.env` tenga el puerto correcto.

## Endpoints usados por el front
- `POST /api/v1/auth/login`
- `GET /api/v1/solicitudes/disponibles?usuarioId=...`
- `GET /api/v1/solicitudes/mias/:usuarioId`
- `POST /api/v1/solicitudes/:id/aceptar`
- `GET /api/v1/ordenes?usuarioId=...`
- `PATCH /api/v1/ordenes/:id/iniciar`
- `PATCH /api/v1/ordenes/:id/confirmar`
- `PATCH /api/v1/ordenes/:id/cancelar`
- `PATCH /api/v1/ordenes/:id/reprogramar`
