import { Module } from '@nestjs/common';
import { ContratacionModule } from './modules/contratacion/contratacion.module';

@Module({
  imports: [ContratacionModule],
})
export class AppModule {}
