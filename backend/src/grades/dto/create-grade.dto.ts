import { IsDateString, IsInt, IsOptional, IsUUID, Min } from 'class-validator';

export class CreateGradeDto {
  @IsUUID()
  studentId: string;

  @IsUUID()
  subjectId: string;

  // Optional: when the caller is a TEACHER, this is ignored and derived
  // from the JWT server-side instead (never trusted from the client).
  // ADMIN/DIRECTOR must still supply it explicitly.
  @IsOptional()
  @IsUUID()
  teacherId?: string;

  @IsInt()
  @Min(0)
  value: number;

  @IsDateString()
  date: string;

}
