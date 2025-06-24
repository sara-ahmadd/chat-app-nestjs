import { IsEmail, IsString } from 'class-validator';

export class SearchForUserDto {
  @IsString()
  @IsEmail()
  email: string;
}
