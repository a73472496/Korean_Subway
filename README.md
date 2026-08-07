# Seoul Metro Station Helper

A small web app for looking up Seoul Metro station information and submitting reports. It includes a separate admin page for managing submitted reports.

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
