import { Optional } from '@nestjs/common';
import { ArrayNotEmpty, IsArray, IsEmail, IsString } from 'class-validator';

export class AddParticipantsToGroupDto {
  @IsString()
  convId: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsEmail({}, { each: true })
  users: string[];
}
