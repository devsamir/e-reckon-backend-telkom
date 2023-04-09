import { Module } from '@nestjs/common';

import { UserModule } from '../User/user.module';

import { UploadController } from './upload.controller';

@Module({
  imports: [UserModule],
  controllers: [UploadController],
  providers: [],
  exports: [],
})
export class UploadModule {}
