import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ORM_CONFIG } from '../orm.config';

@Module({
  imports: [TypeOrmModule.forRoot(ORM_CONFIG.options)],
  controllers: [],
  providers: [],
})
export class AppModule {}
