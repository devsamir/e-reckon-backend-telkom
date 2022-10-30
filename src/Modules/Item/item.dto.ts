import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, MaxLength, IsOptional } from 'class-validator';
import { ExcludeUserDto } from '../User/user.dto';

export class CreateItemDto {
  @MaxLength(100, { message: 'Item code tidak boleh lebih dari 100 karakter' })
  @IsNotEmpty({ message: 'Item code tidak boleh kosong' })
  item_code: string;

  @MaxLength(100, {
    message: 'Material designator tidak boleh lebih dari 100 karakter',
  })
  @IsNotEmpty({ message: 'Material designator tidak boleh kosong' })
  material_designator: string;

  @MaxLength(100, {
    message: 'Service designator tidak boleh lebih dari 100 karakter',
  })
  @IsNotEmpty({ message: 'Service designator tidak boleh kosong' })
  service_designator: string;

  @IsNumber({}, { message: 'Unit ID harus number' })
  @IsNotEmpty({ message: 'Unit tidak boleh kosong' })
  unit_id: number;

  @IsNumber({}, { message: 'Harga material telkom harus number' })
  @IsNotEmpty({ message: 'Harga material telkom tidak boleh kosong' })
  material_price_telkom: number;

  @IsNumber({}, { message: 'Harga service telkom harus number' })
  @IsNotEmpty({ message: 'Harga service telkom tidak boleh kosong' })
  service_price_telkom: number;

  @IsNumber({}, { message: 'Harga material mitra harus number' })
  @IsNotEmpty({ message: 'Harga material mitra tidak boleh kosong' })
  material_price_mitra: number;

  @IsNumber({}, { message: 'Harga service mitra harus number' })
  @IsNotEmpty({ message: 'Harga service mitra tidak boleh kosong' })
  service_price_mitra: number;
}

export class UpdateItemDto {
  @MaxLength(100, { message: 'Item code tidak boleh lebih dari 100 karakter' })
  @IsNotEmpty({ message: 'Item code tidak boleh kosong' })
  @IsOptional()
  item_code: string;

  @MaxLength(100, {
    message: 'Material designator tidak boleh lebih dari 100 karakter',
  })
  @IsNotEmpty({ message: 'Material designator tidak boleh kosong' })
  @IsOptional()
  material_designator: string;

  @MaxLength(100, {
    message: 'Service designator tidak boleh lebih dari 100 karakter',
  })
  @IsNotEmpty({ message: 'Service designator tidak boleh kosong' })
  @IsOptional()
  service_designator: string;

  @IsNumber({}, { message: 'Unit ID harus number' })
  @IsNotEmpty({ message: 'Unit tidak boleh kosong' })
  @IsOptional()
  unit_id: number;

  @IsNumber({}, { message: 'Harga material telkom harus number' })
  @IsNotEmpty({ message: 'Harga material telkom tidak boleh kosong' })
  @IsOptional()
  material_price_telkom: number;

  @IsNumber({}, { message: 'Harga service telkom harus number' })
  @IsNotEmpty({ message: 'Harga service telkom tidak boleh kosong' })
  @IsOptional()
  service_price_telkom: number;

  @IsNumber({}, { message: 'Harga material mitra harus number' })
  @IsNotEmpty({ message: 'Harga material mitra tidak boleh kosong' })
  @IsOptional()
  material_price_mitra: number;

  @IsNumber({}, { message: 'Harga service mitra harus number' })
  @IsNotEmpty({ message: 'Harga service mitra tidak boleh kosong' })
  @IsOptional()
  service_price_mitra: number;
}
export class ExcludeItemDto {
  @Type(() => ExcludeUserDto)
  createdBy: ExcludeUserDto;

  @Type(() => ExcludeUserDto)
  updatedBy: ExcludeUserDto;

  @Type(() => ExcludeUserDto)
  deletedBy: ExcludeUserDto;
}

export class ExcludeGetAllItemDto {
  @Type(() => ExcludeItemDto)
  data: ExcludeItemDto;
}
