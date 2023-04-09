import { unlink } from 'fs/promises';
import path from 'path';

import {
  Body,
  Controller,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { diskStorage } from 'multer';

import { AdminGuard } from '../../Guards/admin.guard';
import { UserService } from '../User/user.service';

import { editFileName, imageFileFilter } from './upload.util';

@Controller('upload')
@UseGuards(AdminGuard)
export class UploadController {
  constructor(private userService: UserService) {}

  @HttpCode(200)
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { files: 5 },
      storage: diskStorage({
        filename: editFileName,
        destination: 'public',
      }),
      fileFilter: imageFileFilter,
    }),
  )
  @Post('/user-profile/:id')
  async uploadImage(
    @UploadedFile() file,
    @Body() @Param('id', ParseIntPipe) id: number,
  ) {
    const oldUser = await this.userService.get(id);
    const user = await this.userService.update(id, {
      avatar: `/upload/${file.filename}`,
    });
    if (user.affected > 0 && oldUser.avatar) {
      await unlink(`public/${oldUser.avatar.split('/')[2]}`);
    }

    return user;
  }
}
