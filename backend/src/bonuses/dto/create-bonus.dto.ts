import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateBonusDto {
  @IsUUID()
  studentId: string;

  // Optional: when the caller is a TEACHER, this is ignored and derived
  // from the JWT server-side instead (never trusted from the client).
  // ADMIN/DIRECTOR must still supply it explicitly.
  @IsOptional()
  @IsUUID()
  awardedById?: string;

  @IsInt()
  points: number;

  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsDateString()
  date: string;

}
