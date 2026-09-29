import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from '../../common/enums/role.enum';

// TEACHER accounts must be created by ADMIN/DIRECTOR only (see
// POST /teachers), never via public self-registration — a self-registered
// TEACHER role would bypass ownership checks tied to a real Teacher profile.
export const ALLOWED_REGISTER_ROLES = [
  Role.STUDENT,
  Role.PARENT,
] as const;

export type AllowedRegisterRole = (typeof ALLOWED_REGISTER_ROLES)[number];

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsIn(ALLOWED_REGISTER_ROLES, {
    message: 'Faqat STUDENT yoki PARENT rollari bilan ro‘yxatdan o‘tish mumkin.',
  })
  role: AllowedRegisterRole;
}
