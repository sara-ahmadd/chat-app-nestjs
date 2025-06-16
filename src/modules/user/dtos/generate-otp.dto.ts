import { IsEmail, IsNotEmpty } from 'class-validator';

export class GenerateOtpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
