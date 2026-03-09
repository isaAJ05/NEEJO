import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de datos de prueba...');

  // Limpiar datos existentes (opcional)
  await prisma.historialEstado.deleteMany({});
  await prisma.ordenServicio.deleteMany({});
  await prisma.cotizacion.deleteMany({});
  await prisma.solicitudServicio.deleteMany({});
  await prisma.usuario.deleteMany({});

  // Crear usuarios de prueba
  const usuarioCliente1 = await prisma.usuario.create({
    data: {
      nombre: 'Juan García',
      email: 'juan@example.com',
      telefono: '3001234567',
      rol: 'CLIENTE',
    },
  });

  const usuarioCliente2 = await prisma.usuario.create({
    data: {
      nombre: 'María López',
      email: 'maria@example.com',
      telefono: '3009876543',
      rol: 'CLIENTE',
    },
  });

  const usuarioProveedor = await prisma.usuario.create({
    data: {
      nombre: 'Carlos Proveedor',
      email: 'carlos@provider.com',
      telefono: '3005555555',
      rol: 'PROVEEDOR',
    },
  });

  console.log('✅ Usuarios creados:');
  console.log(`  - Cliente 1: ${usuarioCliente1.id}`);
  console.log(`  - Cliente 2: ${usuarioCliente2.id}`);
  console.log(`  - Proveedor: ${usuarioProveedor.id}`);

  // Crear solicitudes de prueba
  const solicitud1 = await prisma.solicitudServicio.create({
    data: {
      titulo: 'Desarrollo de sitio web',
      descripcion: 'Necesito un sitio responsivo para mi negocio',
      clienteId: usuarioCliente1.id,
      tipoServicio: 'POR_TAREA',
      presupuestoEstimado: 5000,
    },
  });

  const solicitud2 = await prisma.solicitudServicio.create({
    data: {
      titulo: 'Asesoría técnica',
      descripcion: 'Necesito revisar mi arquitectura de software',
      clienteId: usuarioCliente2.id,
      tipoServicio: 'POR_HORAS',
      presupuestoEstimado: 2000,
    },
  });

  console.log('✅ Solicitudes creadas:');
  console.log(`  - Solicitud 1: ${solicitud1.id}`);
  console.log(`  - Solicitud 2: ${solicitud2.id}`);

  // Crear cotizaciones
  const cotizacion1 = await prisma.cotizacion.create({
    data: {
      solicitudId: solicitud1.id,
      montoTotal: 4500,
      duracionEstimadaHoras: 40,
      descripcionDetalle: 'Sitio con 5 páginas, responsive, formulario de contacto',
    },
  });

  const cotizacion2 = await prisma.cotizacion.create({
    data: {
      solicitudId: solicitud2.id,
      montoTotal: 1800,
      duracionEstimadaHoras: 20,
      descripcionDetalle: 'Revisión de código y sesiones de consultoría',
    },
  });

  console.log('✅ Cotizaciones creadas:');
  console.log(`  - Cotización 1: ${cotizacion1.id}`);
  console.log(`  - Cotización 2: ${cotizacion2.id}`);

  // Crear órdenes de servicio
  const orden1 = await prisma.ordenServicio.create({
    data: {
      codigoOrden: `ORD-${Date.now()}-1`,
      solicitudId: solicitud1.id,
      cotizacionId: cotizacion1.id,
      clienteId: usuarioCliente1.id,
      proveedorId: usuarioProveedor.id,
      tipoServicio: 'POR_TAREA',
      montoTotal: 4500,
      estado: 'ASIGNADA',
      fechaInicio: new Date(Date.now() + 86400000), // Mañana
    },
  });

  const orden2 = await prisma.ordenServicio.create({
    data: {
      codigoOrden: `ORD-${Date.now()}-2`,
      solicitudId: solicitud2.id,
      cotizacionId: cotizacion2.id,
      clienteId: usuarioCliente2.id,
      proveedorId: usuarioProveedor.id,
      tipoServicio: 'POR_HORAS',
      montoTotal: 1800,
      estado: 'EN_PROGRESO',
      fechaInicio: new Date(),
    },
  });

  console.log('✅ Órdenes de servicio creadas:');
  console.log(`  - Orden 1: ${orden1.id}`);
  console.log(`  - Orden 2: ${orden2.id}`);

  // Crear historial de estado
  await prisma.historialEstado.create({
    data: {
      ordenId: orden1.id,
      estadoAnterior: 'CREADA',
      estadoNuevo: 'ASIGNADA',
      motivo: 'Orden asignada al proveedor',
      cambiadoPor: 'SISTEMA',
    },
  });

  await prisma.historialEstado.create({
    data: {
      ordenId: orden2.id,
      estadoAnterior: 'CREADA',
      estadoNuevo: 'EN_PROGRESO',
      motivo: 'Proveedor comenzó la ejecución',
      cambiadoPor: usuarioProveedor.id,
    },
  });

  console.log('✅ Historial de estados creado');

  console.log('\n🎉 Seed completado exitosamente!');
  console.log('\n📊 Datos de prueba disponibles:');
  console.log(`   - Usuarios: 3 (2 clientes, 1 proveedor)`);
  console.log(`   - Solicitudes: 2`);
  console.log(`   - Cotizaciones: 2`);
  console.log(`   - Órdenes: 2`);
  console.log('\nPrueba los endpoints en Postman o tu navegador.');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });