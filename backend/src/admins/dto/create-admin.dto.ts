import { IsUUID } from 'class-validator';

export class CreateAdminDto {
  @IsUUID()
  userId: string;

}
