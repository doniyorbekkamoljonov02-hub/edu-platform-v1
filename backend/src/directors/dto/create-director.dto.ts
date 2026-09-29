import { IsUUID } from 'class-validator';

export class CreateDirectorDto {
  @IsUUID()
  userId: string;

}
