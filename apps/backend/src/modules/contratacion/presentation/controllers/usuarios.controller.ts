import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/persistence/prisma/prisma.service';

/**
 * CONTROLADOR: Usuarios
 * Proporciona endpoints para listar usuarios disponibles
 */

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * ENDPOINT: Listar todos los usuarios
   * GET /api/v1/usuarios
   */
  @Get()
  async listarUsuarios() {
    const usuarios = await this.prisma.usuario.findMany({
      select: {
        id: true,
        nombre: true,
        email: true,
        telefono: true,
        rol: true,
        createdAt: true,
      },
      orderBy: { nombre: 'asc' },
    });

    return {
      total: usuarios.length,
      usuarios,
    };
  }

  /**
   * ENDPOINT: Listar solo clientes
   * GET /api/v1/usuarios/clientes
   */
  @Get('clientes')
  async listarClientes() {
    const clientes = await this.prisma.usuario.findMany({
      where: {
        rol: { in: ['CLIENTE', 'AMBOS'] },
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        telefono: true,
        rol: true,
      },
      orderBy: { nombre: 'asc' },
    });

    return {
      total: clientes.length,
      clientes,
    };
  }

  /**
   * ENDPOINT: Listar solo proveedores
   * GET /api/v1/usuarios/proveedores
   */
  @Get('proveedores')
  async listarProveedores() {
    const proveedores = await this.prisma.usuario.findMany({
      where: {
        rol: { in: ['PROVEEDOR', 'AMBOS'] },
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        telefono: true,
        rol: true,
      },
      orderBy: { nombre: 'asc' },
    });

    return {
      total: proveedores.length,
      proveedores,
    };
  }
}
