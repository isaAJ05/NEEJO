import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/persistence/prisma/prisma.service';

/**
 * CONTROLADOR: Autenticación
 * Login simple para desarrollo (sin JWT)
 */

@Controller('auth')
export class AuthController {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * ENDPOINT: Login simple
   * POST /api/v1/auth/login
   * Body: { "email": "juan@example.com" }
   * 
   * Devuelve los datos del usuario para guardar en localStorage
   */
  @Post('login')
  async login(@Body() body: { email: string }) {
    if (!body.email) {
      throw new BadRequestException('El email es requerido');
    }

    const usuario = await this.prisma.usuario.findUnique({
      where: { email: body.email },
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
      },
    });

    if (!usuario) {
      throw new BadRequestException(
        `Usuario con email "${body.email}" no encontrado. Usuarios disponibles: juan@example.com, maria@example.com, carlos@provider.com`,
      );
    }

    return {
      mensaje: 'Login exitoso',
      usuario,
      // Token simple (en producción usar JWT)
      token: Buffer.from(JSON.stringify(usuario)).toString('base64'),
    };
  }

  /**
   * ENDPOINT: Obtener usuario actual (desde token/localStorage)
   * GET /api/v1/auth/me
   * Headers: { "Authorization": "Bearer <token>" }
   */
  @Post('logout')
  async logout() {
    return {
      mensaje: 'Logout exitoso. Borra el token de localStorage',
    };
  }
}
