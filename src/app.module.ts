import { join } from 'path';

import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { MulterModule } from '@nestjs/platform-express/multer';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './Modules/Auth/auth.module';
import { Datel, Witel } from './Modules/Datel/datel.entity';
import { DatelModule } from './Modules/Datel/datel.module';
import { Incident } from './Modules/Incident/incident.entity';
import { IncidentModule } from './Modules/Incident/incident.module';
import { IncidentDetail } from './Modules/Incident/incidentDetail.entity';
import { Item } from './Modules/Item/item.entity';
import { ItemModule } from './Modules/Item/item.module';
import { JobType } from './Modules/JobType/jobType.entity';
import { JobTypeModule } from './Modules/JobType/jobType.module';
import { ReportModule } from './Modules/Report/report.module';
import { Unit } from './Modules/Unit/unit.entity';
import { UnitModule } from './Modules/Unit/unit.module';
import { UploadModule } from './Modules/Upload/upload.module';
import { User } from './Modules/User/user.entity';
import { UserModule } from './Modules/User/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [
        User,
        Unit,
        JobType,
        Witel,
        Datel,
        Item,
        Incident,
        IncidentDetail,
      ],
      synchronize: true,
      logging: true,
    }),
    MulterModule.register({
      dest: '../public',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/api/upload',
    }),
    UserModule,
    DatelModule,
    AuthModule,
    UnitModule,
    ItemModule,
    JobTypeModule,
    IncidentModule,
    UploadModule,
    ReportModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_PIPE, useValue: new ValidationPipe({ whitelist: true }) },
  ],
})
export class AppModule {}
