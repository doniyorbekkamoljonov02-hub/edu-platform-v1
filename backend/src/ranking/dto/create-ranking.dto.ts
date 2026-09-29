import { IsInt, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateRankingDto {
  @IsUUID()
  studentId: string;

  @IsUUID()
  groupId: string;

  @IsInt()
  totalPoints: number;

  @IsString()
  @IsNotEmpty()
  period: string;

}
