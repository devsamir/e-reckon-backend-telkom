import { Type } from 'class-transformer';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { ExcludeUserDto } from '../User/user.dto';

export class CreateUpdateUnitDto {
  @MaxLength(30, { message: 'Unit name tidak boleh lebih dari 30 karakter' })
  @IsNotEmpty({ message: 'Unit name tidak boleh kosong' })
  unit_name: string;
}

export class ExcludeUnitDto {
  @Type(() => ExcludeUserDto)
  createdBy: ExcludeUserDto;

  @Type(() => ExcludeUserDto)
  updatedBy: ExcludeUserDto;

  @Type(() => ExcludeUserDto)
  deletedBy: ExcludeUserDto;
}

export class ExcludeGetAllUnitDto {
  @Type(() => ExcludeUnitDto)
  data: ExcludeUnitDto;
}
