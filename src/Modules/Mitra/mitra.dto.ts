import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

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
