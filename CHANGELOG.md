# EDU Platform Mobile Stable — fix report

- Chat white-screen crash fixed: ChatPage `useEffect` no longer returns the Promise from `loadMessages`.
- Message autoscroll effect now uses a block body and returns no DOM value.
- Realtime SSE message parsing is guarded so malformed events do not crash the React tree.
- Realtime notification uses `userId ?? id`, matching `/auth/me`.
- Dashboard news highlight has explicit bottom spacing and more compact mobile typography/padding.
- Shared PageHeader is mobile-first: title/description and action stack vertically on narrow screens; action button becomes full width.
- The PageHeader fix applies across Admin/Teacher/Student/Parent/Director pages that use the shared component.

Verification note: source scan found no remaining compact `useEffect(() => expression)`/`useEffect(async...)` pattern in frontend source. Frontend production build could not be completed in this Linux workspace because Vite 8/Rolldown's native optional binding was unavailable after dependency install; dependencies are intentionally excluded from this ZIP so Windows can install its correct native package with `npm install`.
