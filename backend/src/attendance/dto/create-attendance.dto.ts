import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { AttendanceStatus } from '../entities/attendance-status.enum';

export class CreateAttendanceDto {
  @IsUUID()
  studentId: string;

  @IsUUID()
  groupId: string;

  @IsUUID()
  subjectId: string;

  // Optional: when the caller is a TEACHER, this is ignored and derived
  // from the JWT server-side instead (never trusted from the client).
  // ADMIN/DIRECTOR must still supply it explicitly.
  @IsOptional()
  @IsUUID()
  teacherId?: string;

  @IsDateString()
  date: string;

  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

}
