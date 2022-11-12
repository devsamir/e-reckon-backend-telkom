import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

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

  @IsNumber({}, { message: 'Mitra ID harus number' })
  @IsOptional()
  assigned_mitra: number;

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

export class ConfirmFirstTier {
  @IsNumber({}, { message: 'Id harus number' })
  @IsNotEmpty({ message: 'Id harus diisi' })
  id: number;
}
