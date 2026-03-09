import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private dbDisponible = false;

  async onModuleInit() {
    try {
      if (!process.env.DATABASE_URL) {
        console.warn('⚠️  DATABASE_URL no está configurada.');
        console.warn('   Crea un archivo .env en la raiz del proyecto con DATABASE_URL.');
        this.dbDisponible = false;
        return;
      }

      await this.$connect();
      this.dbDisponible = true;
      console.log('✅ Prisma conectado a la base de datos');
    } catch (error) {
      this.dbDisponible = false;
      console.warn('⚠️  No se pudo conectar a la base de datos PostgreSQL.');
      console.warn('   Si necesitas la BD, asegúrate de que PostgreSQL esté corriendo en localhost:5432');
      console.warn('   La aplicación funcionará en modo SIN BASE DE DATOS (solo demostración)');
    }
  }

  ensureDbDisponible(): void {
    if (!this.dbDisponible) {
      throw new ServiceUnavailableException(
        'Base de datos no disponible. Revisa DATABASE_URL y que PostgreSQL esté activo.',
      );
    }
  }

  isDbDisponible(): boolean {
    return this.dbDisponible;
  }

  async onModuleDestroy() {
    await this.$disconnect().catch(() => {});
  }
}