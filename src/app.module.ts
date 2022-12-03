import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';

import { AuthModule } from './Modules/Auth/auth.module';
import { IncidentModule } from './Modules/Incident/incident.module';
import { ItemModule } from './Modules/Item/item.module';
import { UnitModule } from './Modules/Unit/unit.module';
import { UserModule } from './Modules/User/user.module';
import { PrismaModule } from './Prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
      isGlobal: true,
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    UnitModule,
    ItemModule,
    IncidentModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_PIPE, useValue: new ValidationPipe({ whitelist: true }) },
  ],
})
export class AppModule {}
