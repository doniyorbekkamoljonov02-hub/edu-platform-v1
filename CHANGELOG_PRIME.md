# PRIME redesign summary

- New mobile-first visual system: navy + teal + neutral surfaces; previous purple/gray identity removed from the shared shell/login.
- Mobile bottom navigation is the primary navigation; secondary pages open from a bottom sheet.
- Desktop keeps a compact dark sidebar.
- Login rebuilt from scratch for phone and desktop.
- Teacher model uses Schedule as the source of truth for multiple classes; demo teacher is assigned to 5-A, 6-A, 7-A.
- Teacher students UI can filter across all taught classes.
- Student chat supports text, image upload, own-message deletion, SSE real-time delivery, incoming top toast, incoming/outgoing sound.
- Netlify SPA redirect config included.
- Backend supports cloud `DATABASE_URL`, production SSL, configurable CORS, 0.0.0.0 binding, and upload directory creation.
- Render Blueprint added for backend + PostgreSQL.
- Demo seed command and all five role test accounts added.

## Still environment-dependent
Cloud deploy success also depends on the chosen host, its environment variables, database provisioning and persistent file storage. `/uploads` is local server storage; use object storage for durable production chat images.
