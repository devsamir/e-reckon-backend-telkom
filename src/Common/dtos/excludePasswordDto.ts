import { Exclude, Type } from 'class-transformer';

export class ExcludePassword {
  @Exclude()
  password: string;
}

export class ExcludePasswordDto {
  @Exclude()
  password: string;

  @Type(() => ExcludePassword)
  createdBy: ExcludePassword;

  @Type(() => ExcludePassword)
  updatedBy: ExcludePassword;

  @Type(() => ExcludePassword)
  deletedBy: ExcludePassword;
}

export class ExcludePasswordGetAllDto {
  @Type(() => ExcludePasswordDto)
  data: ExcludePasswordDto;
}
