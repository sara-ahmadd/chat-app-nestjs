import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  ValidateIf,
} from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ResetPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  otp: string;
  @IsString()
  @IsNotEmpty()
  password: string;
  @IsString()
  @ValidateIf((obj) => obj.password !== obj.confirmPassword)
  @IsIn([Math.random()], { message: 'Passwords mismatch!' })
  @IsNotEmpty()
  confirmPassword: string;
}
