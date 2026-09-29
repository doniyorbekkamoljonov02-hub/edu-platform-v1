import { IsOptional, IsUUID } from 'class-validator';

export class CreateParentDto {
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsUUID()
  studentId?: string;

}
