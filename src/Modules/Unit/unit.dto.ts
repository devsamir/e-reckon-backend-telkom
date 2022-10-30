import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { ExcludeUserDto } from '../User/user.dto';

export class CreateUpdateUnitDto {
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
