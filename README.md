# K-Metro Buddy

A small web app for looking up Seoul and Busan metro station information, planning routes, and submitting reports. It includes a separate admin page for managing submitted reports.

## Requirements

- Node.js 18 or newer

## Run locally

```bash
npm start
```

Open <http://localhost:5173>. The admin page is available at <http://localhost:5173/admin.html>.

Set a non-default admin PIN before publishing or deploying the app:

```bash
# PowerShell
$env:ADMIN_PIN = "choose-a-strong-pin"
npm start
```

You can change the port with the `PORT` environment variable.

## Project structure

```text
.
├── index.html       # Main station helper page
├── admin.html       # Report-management page
├── server.js        # Local HTTP server and reports API
├── package.json     # npm scripts and project metadata
├── data/            # Runtime report data (not committed)
└── work/qa/         # QA environment; its node_modules are ignored
```

## GitHub notes

- Commit the source files and `work/qa/package-lock.json`.
- Do not commit `node_modules`, generated report data, `.env` files, or `__MACOSX` folders; `.gitignore` excludes them.

## Deploy with Supabase

GitHub Pages hosts the static website. Supabase provides the reports database and administrator sign-in, so no password or server secret is stored in this repository.

1. Create a Supabase project and run [`supabase/schema.sql`](supabase/schema.sql) in its SQL Editor.
2. In Supabase Auth, create the administrator user with email and password.
3. Run the final commented `insert` statement from `supabase/schema.sql`, replacing `YOUR_ADMIN_EMAIL`, to grant that user administrator access.
4. Copy the project URL and **publishable** key into `supabase-config.js`.
5. Configure GitHub Pages to publish the `main` branch from the repository root.

Never put a Supabase `service_role` or secret key in `supabase-config.js`. The publishable key is designed for browser use; the SQL row-level security policies protect the reports table.
