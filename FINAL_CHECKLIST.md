# EDU PLATFORM ONE — final integration checklist

Implemented in this bundle:

- Admin: student account creation (`POST /students/with-account`) with group validation, duplicate-email message, account + student profile creation.
- Chat: available to STUDENT, TEACHER, PARENT, ADMIN and DIRECTOR; placed in the primary mobile bottom navigation for every role.
- Chat UI: own messages right/dark, other messages left/white; image lightbox with X close; image upload; delete own message.
- Chat receipts: one check = stored/unread, two checks = recipient opened the conversation. Read state is persisted in `messages.isRead` and propagated over SSE.
- Global message toast + sound: works for all five roles when they are outside their chat page.
- Teacher: attendance, grades and bonuses use the teacher's schedule-derived multi-class student list. Results page uses real grades/attendance/bonus data.
- Student: Grades is a primary mobile destination; Schedule was rebuilt into a phone-friendly daily/weekly layout.
- Parent: Chat is a primary mobile destination; existing child/grades/attendance/ranking/bonus/schedule pages share the responsive shell.
- Director: Chat is a primary mobile destination; shared Table now renders as cards on phones to avoid broken wide tables.
- Shared tables: desktop table + mobile cards.

Run locally:

1. Backend: `npm install`, `npm run build`, `npm run start:dev`.
2. Frontend: `npm install`, `npm run build`, `npm run dev`.

Note: dependency installation could not be completed in the artifact environment because package installation timed out. Run the two build commands locally before deployment.
