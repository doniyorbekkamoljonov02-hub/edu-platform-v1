import { IsDateString, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateReportDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsUUID()
  generatedById: string;

  @IsDateString()
  periodStart: string;

  @IsDateString()
  periodEnd: string;

}
