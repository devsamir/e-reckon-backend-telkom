import { IsDateString, IsNumber, IsOptional } from 'class-validator';

export class GetDashboardData {
  @IsNumber({}, { message: 'Datel ID harus berupa angka' })
  @IsOptional()
  datel_id?: number;

  @IsDateString({}, { message: 'Format tanggal salah' })
  @IsOptional()
  start_date?: string;

  @IsDateString({}, { message: 'Format tanggal salah' })
  @IsOptional()
  end_date?: string;
}
