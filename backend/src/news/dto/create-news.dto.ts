import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
export class CreateNewsDto {
  @IsString() @IsNotEmpty() title: string;
  @IsString() @IsNotEmpty() content: string;
  @IsOptional() @IsUUID() targetGroupId?: string;
  @IsOptional() @IsBoolean() isPublished?: boolean;
}
