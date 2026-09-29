# Chat + Dashboard News update

- Chat sender detection now uses the authenticated `userId` returned by `/auth/me` (with `id` fallback).
- Own messages render on the right with dark background; incoming messages render on the left with white background.
- Own messages retain single-check / double-check read state.
- Latest visible news now appears as a prominent animated teal/cyan dashboard banner.
- Dashboard news highlight added to Admin, Teacher, Student, Parent, and Director dashboards.
- Parent now also has a read-only News page and navigation entry.
