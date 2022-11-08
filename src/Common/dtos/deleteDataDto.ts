import { IsNumber } from 'class-validator';

export class DeleteDataDto {
  @IsNumber({}, { each: true, message: 'ids harus berupa array berisi angka' })
  ids: number[];
}
