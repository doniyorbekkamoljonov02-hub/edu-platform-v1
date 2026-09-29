import { IsDateString, IsOptional, IsUUID } from 'class-validator';

export class CreateStudentDto {
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsUUID()
  groupId?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsDateString()
  enrollmentDate?: string;

}
