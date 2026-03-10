"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Iniciando seed de demo marketplace...');
    await prisma.historialEstado.deleteMany({});
    await prisma.ordenServicio.deleteMany({});
    await prisma.cotizacion.deleteMany({});
    await prisma.solicitudServicio.deleteMany({});
    await prisma.usuario.deleteMany({});
    const ana = await prisma.usuario.create({
        data: {
            nombre: 'Ana Torres',
            email: 'ana@demo.com',
            telefono: '3001111111',
            rol: 'AMBOS',
        },
    });
    const bruno = await prisma.usuario.create({
        data: {
            nombre: 'Bruno Rojas',
            email: 'bruno@demo.com',
            telefono: '3002222222',
            rol: 'AMBOS',
        },
    });
    const carla = await prisma.usuario.create({
        data: {
            nombre: 'Carla Mendez',
            email: 'carla@demo.com',
            telefono: '3003333333',
            rol: 'AMBOS',
        },
    });
    const diego = await prisma.usuario.create({
        data: {
            nombre: 'Diego Pardo',
            email: 'diego@demo.com',
            telefono: '3004444444',
            rol: 'AMBOS',
        },
    });
    console.log('Usuarios creados:');
    console.log(`- Ana: ${ana.id} (${ana.email})`);
    console.log(`- Bruno: ${bruno.id} (${bruno.email})`);
    console.log(`- Carla: ${carla.id} (${carla.email})`);
    console.log(`- Diego: ${diego.id} (${diego.email})`);
    const s1 = await prisma.solicitudServicio.create({
        data: {
            titulo: 'Landing page para emprendimiento',
            descripcion: 'Necesito una landing de 4 secciones con formulario de contacto.',
            clienteId: ana.id,
            tipoServicio: 'POR_TAREA',
            presupuestoEstimado: 800,
            estado: 'PENDIENTE',
        },
    });
    const s2 = await prisma.solicitudServicio.create({
        data: {
            titulo: 'Soporte de integracion API por horas',
            descripcion: 'Ayuda para integrar pagos y resolver errores de autenticacion.',
            clienteId: carla.id,
            tipoServicio: 'POR_HORAS',
            presupuestoEstimado: 600,
            estado: 'PENDIENTE',
        },
    });
    const s3 = await prisma.solicitudServicio.create({
        data: {
            titulo: 'Paquete de 6 piezas para redes sociales',
            descripcion: 'Diseno de piezas para campana de lanzamiento.',
            clienteId: bruno.id,
            tipoServicio: 'POR_PAQUETE',
            presupuestoEstimado: 1200,
            estado: 'ACEPTADA',
        },
    });
    const c3 = await prisma.cotizacion.create({
        data: {
            solicitudId: s3.id,
            montoTotal: 1150,
            duracionEstimadaHoras: 24,
            descripcionDetalle: 'Incluye 6 entregables + 1 ronda de ajustes.',
        },
    });
    const o3 = await prisma.ordenServicio.create({
        data: {
            codigoOrden: 'ORD-DEMO-001',
            solicitudId: s3.id,
            cotizacionId: c3.id,
            clienteId: bruno.id,
            proveedorId: diego.id,
            tipoServicio: 'POR_PAQUETE',
            montoTotal: 1150,
            estado: 'ASIGNADA',
            fechaInicio: new Date(Date.now() + 1000 * 60 * 60 * 24),
        },
    });
    await prisma.historialEstado.create({
        data: {
            ordenId: o3.id,
            estadoAnterior: 'CREADA',
            estadoNuevo: 'ASIGNADA',
            motivo: 'Solicitud aceptada por Diego',
            cambiadoPor: diego.id,
        },
    });
    const s4 = await prisma.solicitudServicio.create({
        data: {
            titulo: 'Automatizacion de reportes semanales',
            descripcion: 'Script para consolidar datos y exportar CSV.',
            clienteId: diego.id,
            tipoServicio: 'POR_HORAS',
            presupuestoEstimado: 500,
            estado: 'ACEPTADA',
        },
    });
    const c4 = await prisma.cotizacion.create({
        data: {
            solicitudId: s4.id,
            montoTotal: 520,
            duracionEstimadaHoras: 10,
            descripcionDetalle: '10 horas de implementacion y pruebas.',
        },
    });
    const o4 = await prisma.ordenServicio.create({
        data: {
            codigoOrden: 'ORD-DEMO-002',
            solicitudId: s4.id,
            cotizacionId: c4.id,
            clienteId: diego.id,
            proveedorId: ana.id,
            tipoServicio: 'POR_HORAS',
            montoTotal: 520,
            estado: 'COMPLETADA',
            fechaInicio: new Date(Date.now() - 1000 * 60 * 60 * 48),
            fechaFinalizacion: new Date(Date.now() - 1000 * 60 * 60 * 24),
        },
    });
    await prisma.historialEstado.createMany({
        data: [
            {
                ordenId: o4.id,
                estadoAnterior: 'CREADA',
                estadoNuevo: 'ASIGNADA',
                motivo: 'Solicitud aceptada por Ana',
                cambiadoPor: ana.id,
            },
            {
                ordenId: o4.id,
                estadoAnterior: 'ASIGNADA',
                estadoNuevo: 'EN_PROGRESO',
                motivo: 'Inicio de ejecucion',
                cambiadoPor: ana.id,
            },
            {
                ordenId: o4.id,
                estadoAnterior: 'EN_PROGRESO',
                estadoNuevo: 'COMPLETADA',
                motivo: 'Entrega aprobada por el cliente',
                cambiadoPor: diego.id,
            },
        ],
    });
    console.log('Seed completado');
    console.log('Resumen demo:');
    console.log('- Usuarios: 4 (todos AMBOS)');
    console.log('- Solicitudes abiertas: 2 (visibles para todos)');
    console.log('- Solicitudes tomadas: 2 (con ordenes entre partes)');
    console.log('Credenciales login por email: ana@demo.com, bruno@demo.com, carla@demo.com, diego@demo.com');
}
main()
    .catch((e) => {
    console.error('Error en seed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map