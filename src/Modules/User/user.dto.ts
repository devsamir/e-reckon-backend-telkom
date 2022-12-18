import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

enum Role {
  admin = 'admin',
  mitra = 'mitra',
  commerce = 'commerce',
  wh = 'wh',
  telkom = 'telkom',
}

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
  role: Role;
}
