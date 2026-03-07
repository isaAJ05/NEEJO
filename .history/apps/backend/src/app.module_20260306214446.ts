import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ContratacionModule } from './modules/contratacion/contratacion.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ContratacionModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
