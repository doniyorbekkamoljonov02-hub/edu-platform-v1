import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { DayOfWeek } from '../entities/day-of-week.enum';

export class CreateScheduleDto {
  @IsUUID()
  teacherId: string;

  @IsUUID()
  subjectId: string;

  @IsUUID()
  groupId: string;

  @IsEnum(DayOfWeek)
  dayOfWeek: DayOfWeek;

  @IsString()
  @IsNotEmpty()
  startTime: string;

  @IsString()
  @IsNotEmpty()
  endTime: string;

  @IsOptional()
  @IsString()
  room?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

}
