import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty({ message: 'Username tidak boleh kosong' })
  username: string;

  @IsNotEmpty({ message: 'Password tidak boleh kosong' })
  password: string;

  @IsOptional()
  fullname?: string;

  @IsNumber({}, { message: 'Level harus berupa angka' })
  @IsNotEmpty({ message: 'Level user tidak boleh kosong' })
  level: number;
}

export class UpdateUserDto {
  @IsOptional()
  @IsNotEmpty({ message: 'Username tidak boleh kosong' })
  username?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Password tidak boleh kosong' })
  password?: string;

  @IsOptional()
  fullname?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Level harus berupa angka' })
  @IsNotEmpty({ message: 'Level user tidak boleh kosong' })
  level?: number;
}
