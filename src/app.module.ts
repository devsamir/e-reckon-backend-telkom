import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './Modules/User/user.module';
import { AuthModule } from './Modules/Auth/auth.module';
import { PrismaModule } from './Prisma/prisma.module';
import { UnitModule } from './Modules/Unit/unit.module';
import { ItemModule } from './Modules/Item/item.module';
import { MitraModule } from './Modules/Mitra/mitra.module';

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
    MitraModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_PIPE, useValue: new ValidationPipe({ whitelist: true }) },
  ],
})
export class AppModule {}
