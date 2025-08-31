import { IsOptional, IsString } from 'class-validator';

export class UpdateMsgDto {
  @IsString()
  @IsOptional()
  contentText?: string;
}
