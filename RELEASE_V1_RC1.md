# EDU AURORA — v1.0.0 RC1

Release candidate focused on mobile UX, chat reliability and deploy readiness.

## Added / improved
- Unread chat badges on conversation rows, desktop sidebar and mobile navigation.
- Badges update from realtime chat events and disappear after messages are read.
- Separate outgoing and incoming chat sounds.
- Existing realtime toast notification retained with a distinct incoming two-note sound.
- Student grades page received a cleaner mobile card treatment.
- Director Reports is now a usable dashboard with school totals, grade average, attendance rate, bonus total, report creation and report history.
- Login has a responsive layered background and glass-style mobile login card.
- Netlify SPA redirect configuration remains included.

## Deployment reminders
- Frontend: set VITE_API_BASE_URL to the deployed backend URL ending in /api.
- Backend: set CORS_ORIGINS to the exact Netlify production origin, e.g. https://your-site.netlify.app.
- Backend production database should use DATABASE_URL.
- Chat image uploads currently use backend local disk. On hosts with ephemeral filesystems, use persistent storage/object storage before treating image history as production durable.
