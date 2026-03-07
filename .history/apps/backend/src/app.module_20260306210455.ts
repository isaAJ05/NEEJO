import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ContratacionModule } from './modules/contratacion/contratacion.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ContratacionModule,
  ],
})
export class AppModule {}
