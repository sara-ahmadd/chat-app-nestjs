import { IsEmail, IsOptional, IsString } from 'class-validator';
import { Gender } from './../../../common/types/genderEnum';

export class UpdateUserProfileDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  gender?: Gender.FEMALE | Gender.MALE;

  @IsOptional()
  @IsString()
  userName?: string;
}
