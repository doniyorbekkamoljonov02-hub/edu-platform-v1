# EDU PLATFORM — production readiness notes

This archive received a security/architecture hardening pass intended to keep the project safe to continue developing as a real education-center product.

## Fixed in this pass
- Public registration is limited to STUDENT and PARENT on both frontend and backend. ADMIN, DIRECTOR and TEACHER accounts must be provisioned by privileged staff.
- Added authenticated `GET /students/me`; student UI no longer downloads every student record to discover itself.
- Added authenticated `GET /parents/me` and `GET /parents/me/child`; parent UI no longer downloads all parents/students/users to discover its child.
- Restricted generic `/students` and `/parents` list/detail endpoints to ADMIN/DIRECTOR.
- Teacher student list now uses server-side scoped `GET /teachers/me/students` instead of downloading schedules, groups and every student to join in the browser.
- Teacher scope checks already present for grades, attendance and bonuses were preserved.
- Added frontend access-token refresh/retry flow using the refresh token.
- Backend TypeScript build passes after these changes.

## Before selling/deploying commercially
- Add database migrations and disable TypeORM `synchronize` in production.
- Add automated unit/e2e tests for every role and ownership boundary.
- Complete STUDENT/PARENT scoping in grades, attendance, bonuses, ranking, schedule and notifications before exposing production data.
- Add rate limiting, request logging/audit log, account lockout policy, secure password reset email provider, and production CORS allowlist.
- Prefer HttpOnly/Secure/SameSite cookies or another reviewed token-storage strategy for production auth; current localStorage tokens are acceptable for development but increase XSS impact.
- Add tenant/organization boundaries before serving more than one education center. Every business record should ultimately belong to an organization/center and every query must enforce that tenant boundary.
- Add backups, monitoring, error reporting, privacy/retention rules, and restore drills.
- Review personal-data fields and permissions with the center before real student data is imported.
