import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
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

  @IsNumber({}, { message: 'Jenis pekerjaan ID harus number' })
  @IsNotEmpty({ message: 'Jenis pekerjaan tidak boleh kosong' })
  job_type_id: number;

  @IsNumber({}, { message: 'Datel harus number' })
  datel_id: number;

  @IsNumber({}, { message: 'Mitra ID harus number' })
  @IsOptional()
  assigned_mitra: number;

  @IsDateString({}, { message: 'Format tanggal salah' })
  @IsNotEmpty({ message: 'Tanggal tidak boleh kosong' })
  open_at: string;
}

export class UpdateIncidentDto {
  @MaxLength(100, { message: 'Tiket in tidak boleh lebih dari 100 karakter' })
  @IsNotEmpty({ message: 'Tiket in tidak boleh kosong' })
  @IsOptional()
  incident: string;

  @IsNotEmpty({ message: 'Summary tidak boleh kosong' })
  @IsOptional()
  summary: string;

  @IsNumber({}, { message: 'Jenis pekerjaan ID harus number' })
  @IsNotEmpty({ message: 'Jenis pekerjaan tidak boleh kosong' })
  @IsOptional()
  job_type_id: number;

  @IsDateString({}, { message: 'Format tanggal salah' })
  @IsNotEmpty({ message: 'Tanggal tidak boleh kosong' })
  @IsOptional()
  open_at: string;

  @IsNumber({}, { message: 'Datel harus number' })
  @IsOptional()
  datel_id: number;

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

  @IsNumber({}, { message: 'qty harus number' })
  @IsNotEmpty({ message: 'qty tidak boleh kosong' })
  @IsOptional()
  qty: number;

  @IsNumber({}, { message: 'qty Actual harus number' })
  @IsNotEmpty({ message: 'qty Actual tidak boleh kosong' })
  @IsOptional()
  actual_qty: number;

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
