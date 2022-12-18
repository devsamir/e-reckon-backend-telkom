import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateUpdateJobTypeDto {
  @MaxLength(30, {
    message: 'Nama jenis pekerjaan tidak boleh lebih dari 30 karakter',
  })
  @IsNotEmpty({ message: 'Nama jenis pekerjaan tidak boleh kosong' })
  name: string;
}
