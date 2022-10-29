import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Username atau password salah' })
  username: string;

  @IsNotEmpty({ message: 'Username atau password salah' })
  password: string;
}
