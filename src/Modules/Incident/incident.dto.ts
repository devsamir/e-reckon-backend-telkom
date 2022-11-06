import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

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
