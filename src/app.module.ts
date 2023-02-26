import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ORM_CONFIG } from '../orm.config';
import { CoreApiModule } from './core-api/core-api.module';

@Module({
  imports: [TypeOrmModule.forRoot(ORM_CONFIG.options), CoreApiModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
