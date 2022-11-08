import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetAllQueryDto {
  @IsNumber({}, { message: 'Limit harus berupa angka' })
  @IsOptional()
  limit?: number;

  @IsNumber({}, { message: 'Offset harus berupa angka' })
  @IsOptional()
  offset?: number;

  @IsOptional()
  domain?: any;
  @IsString({ message: 'Sort harus berupa string' })
  @IsOptional()
  sort?: string;

  @IsArray({ message: 'Fields harus berupa array of string' })
  @IsOptional()
  fields?: string[];

  @IsArray({ message: 'Include harus berupa array of string' })
  @IsOptional()
  include?: string[];
}
