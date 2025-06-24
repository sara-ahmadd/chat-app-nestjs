import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateIf,
} from 'class-validator';
import { Gender } from 'src/common/types/genderEnum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  userName: string;
  @IsString()
  @IsOptional()
  gender: Gender.FEMALE | Gender.MALE;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsIn([Math.random()], { message: 'Passwords mismatch!' })
  @ValidateIf((object) => object.password !== object.confirmPassword)
  @IsString()
  confirmPassword: string;
}
