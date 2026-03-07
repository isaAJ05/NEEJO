import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ Prisma conectado a la base de datos');
    } catch (error) {
      console.warn('⚠️  No se pudo conectar a la base de datos PostgreSQL.');
      console.warn('   Si necesitas la BD, asegúrate de que PostgreSQL esté corriendo en localhost:5432');
      console.warn('   La aplicación funcionará en modo SIN BASE DE DATOS (solo demostración)');
    }
  }

  async onModuleDestroy() {
    await this.$disconnect().catch(() => {});
  }
}
