import { Type } from 'class-transformer';
import { IsNotEmpty, MaxLength, IsOptional } from 'class-validator';
import { ExcludeUserDto } from '../User/user.dto';

export class CreateMitraDto {
  @MaxLength(15, { message: 'Nama pendek tidak boleh lebih dari 15 karakter' })
  @IsNotEmpty({ message: 'Nama pendek tidak boleh kosong' })
  shortname: string;

  @MaxLength(100, {
    message: 'Nama Panjang tidak boleh lebih dari 100 karakter',
  })
  @IsNotEmpty({ message: 'Nama Panjang tidak boleh kosong' })
  fullname: string;
}

export class UpdateMitraDto {
  @MaxLength(15, { message: 'Nama pendek tidak boleh lebih dari 15 karakter' })
  @IsNotEmpty({ message: 'Nama pendek tidak boleh kosong' })
  @IsOptional()
  shortname: string;

  @MaxLength(100, {
    message: 'Nama Panjang tidak boleh lebih dari 100 karakter',
  })
  @IsNotEmpty({ message: 'Nama Panjang tidak boleh kosong' })
  @IsOptional()
  fullname: string;
}
export class ExcludeMitraDto {
  @Type(() => ExcludeUserDto)
  createdBy: ExcludeUserDto;

  @Type(() => ExcludeUserDto)
  updatedBy: ExcludeUserDto;

  @Type(() => ExcludeUserDto)
  deletedBy: ExcludeUserDto;
}

export class ExcludeGetAllMitraDto {
  @Type(() => ExcludeMitraDto)
  data: ExcludeMitraDto;
}
