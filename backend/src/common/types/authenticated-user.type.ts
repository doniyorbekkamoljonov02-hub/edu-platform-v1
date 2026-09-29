import { Role } from '../enums/role.enum';

/**
 * Shape of `request.user`, as attached by JwtStrategy.validate().
 * Used across services that need to enforce per-role data ownership
 * (e.g. a TEACHER only accessing their own students/grades/attendance/bonuses).
 *
 * IMPORTANT: `role` (and any other field) on this object comes from a
 * verified JWT, never from request body/query — it is safe to trust for
 * authorization decisions. Client-supplied body fields like `teacherId`
 * or `awardedById` are NOT safe to trust and must never be used in place
 * of this.
 */
export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: Role;
}
