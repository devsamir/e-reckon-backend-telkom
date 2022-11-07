import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

import { ExcludeUserDto } from '../User/user.dto';

export class CreateIncidentDto {
  @MaxLength(100, { message: 'Tiket in tidak boleh lebih dari 100 karakter' })
  @IsNotEmpty({ message: 'Tiket in tidak boleh kosong' })
  incident: string;

  @IsNotEmpty({ message: 'Summary tidak boleh kosong' })
  summary: string;

  @MaxLength(30, {
    message: 'Jenis pekerjaan tidak boleh lebih dari 100 karakter',
  })
  @IsNotEmpty({ message: 'Jenis pekerjaan tidak boleh kosong' })
  job_type: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1, {
    message: 'Tiket setidaknya harus memiliki satu material',
  })
  @Type(() => CreateIncidentDetails)
  incident_details: CreateIncidentDetails[];
}

export class UpdateIncidentDto {
  @MaxLength(100, { message: 'Tiket in tidak boleh lebih dari 100 karakter' })
  @IsNotEmpty({ message: 'Tiket in tidak boleh kosong' })
  @IsOptional()
  incident: string;

  @IsNotEmpty({ message: 'Summary tidak boleh kosong' })
  @IsOptional()
  summary: string;

  @MaxLength(30, {
    message: 'Jenis pekerjaan tidak boleh lebih dari 100 karakter',
  })
  @IsNotEmpty({ message: 'Jenis pekerjaan tidak boleh kosong' })
  @IsOptional()
  job_type: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1, {
    message: 'Tiket setidaknya harus memiliki satu material',
  })
  @Type(() => UpdateIncidentDetails)
  @IsOptional()
  incident_details: UpdateIncidentDetails[];
}

enum ApproveWh {
  not_yet = 'not_yet',
  approved = 'approved',
  decline = 'decline',
}

enum OrmCode {
  create = 'create',
  update = 'update',
  delete = 'delete',
}
export class CreateIncidentDetails {
  @IsNumber({}, { message: 'material harus number' })
  @IsNotEmpty({ message: 'material tidak boleh kosong' })
  item_id: number;

  @IsString({ message: 'Uraian pekerjaan harus berupa string' })
  @IsOptional()
  job_detail: string;

  @IsNumber({}, { message: 'Jumlah material harus number' })
  @IsNotEmpty({ message: 'Jumlah material tidak boleh kosong' })
  qty: number;

  @IsEnum(ApproveWh, { message: 'Approve WH tidak sesuai' })
  @IsOptional()
  approve_wh: ApproveWh;
}

export class UpdateIncidentDetails {
  @IsNumber({}, { message: 'id harus number' })
  @IsOptional()
  id: number;

  @IsNumber({}, { message: 'material harus number' })
  @IsNotEmpty({ message: 'material tidak boleh kosong' })
  @IsOptional()
  item_id: number;

  @IsString({ message: 'Uraian pekerjaan harus berupa string' })
  @IsOptional()
  job_detail: string;

  @IsNumber({}, { message: 'Jumlah material harus number' })
  @IsNotEmpty({ message: 'Jumlah material tidak boleh kosong' })
  @IsOptional()
  qty: number;

  @IsEnum(ApproveWh, { message: 'Approve WH tidak sesuai' })
  @IsOptional()
  approve_wh: ApproveWh;

  @IsEnum(OrmCode, { message: 'ORM Code tidak boleh kosong' })
  orm_code: OrmCode;
}

export class ExcludeIncidentDto {
  @Type(() => ExcludeUserDto)
  createdBy: ExcludeUserDto;

  @Type(() => ExcludeUserDto)
  updatedBy: ExcludeUserDto;

  @Type(() => ExcludeUserDto)
  deletedBy: ExcludeUserDto;
}

export class ExcludeGetAllIncidentDto {
  @Type(() => ExcludeIncidentDto)
  data: ExcludeIncidentDto;
}
