# EDU PLATFORM v1.1

## UX + Realtime Stable
- Mobile Safari input zoom fixed globally without disabling accessibility zoom.
- Chat messages use optimistic rendering for immediate sender feedback.
- Existing SSE realtime delivery retained; inbox database queries batched to remove N+1 query overhead.
- Read receipts, unread badges, image preview and role-wide chat retained.
- Director reports can export a UTF-8 CSV summary.
- PWA-ready web manifest and mobile metadata added.
- Package and product version bumped to 1.1.0.

## Deployment note
Render free instances can still have a cold-start delay after inactivity. That hosting delay is separate from in-app chat rendering.
