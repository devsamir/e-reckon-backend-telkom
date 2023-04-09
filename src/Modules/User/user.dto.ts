import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

import { Role } from './user.entity';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Username tidak boleh kosong' })
  username: string;

  @IsNotEmpty({ message: 'Password tidak boleh kosong' })
  password: string;

  @IsOptional()
  fullname?: string;

  @IsEnum(Role, { message: 'Role user tidak sesuai' })
  @IsNotEmpty({ message: 'Role user tidak boleh kosong' })
  role: Role;

  @IsOptional()
  avatar?: string;
}

export class UpdateUserDto {
  @IsNotEmpty({ message: 'Username tidak boleh kosong' })
  @IsOptional()
  username?: string;

  @IsNotEmpty({ message: 'Password tidak boleh kosong' })
  @IsOptional()
  password?: string;

  @IsOptional()
  fullname?: string;

  @IsEnum(Role, { message: 'Role user tidak sesuai' })
  @IsNotEmpty({ message: 'Role user tidak boleh kosong' })
  @IsOptional()
  role?: Role;

  @IsOptional()
  avatar?: string;
}

export class UpdateProfileDto {
  @IsOptional()
  fullname?: string;

  @IsOptional()
  password_old?: string;

  @IsOptional()
  password_new?: string;
}
