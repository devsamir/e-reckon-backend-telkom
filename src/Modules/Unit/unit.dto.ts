import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateUpdateUnitDto {
  @MaxLength(30, { message: 'Unit name tidak boleh lebih dari 30 karakter' })
  @IsNotEmpty({ message: 'Unit name tidak boleh kosong' })
  unit_name: string;
}
