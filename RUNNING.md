# Running Project Navigator

Short version: **Docker Compose is the normal way to run this.** The app is a Django
API + a React SPA served by nginx on port 80, with the database stored as a SQLite
file inside the backend service.

## What runs where

| Piece | Tech | Dev URL |
| --- | --- | --- |
| nginx (entrypoint) | nginx | http://localhost:8080 |
| React SPA | Vite + Bun → static files | http://localhost:8080 |
| Django API / admin | Django + DRF | http://localhost:8080/api/ , http://localhost:8080/admin/ |
| Database | SQLite file on the `sqlite_data` volume (`/app/data/db.sqlite3`) | internal only |

Frontend routes: `/` (landing), `/dashboard` (explorer).
API routes: `/api/projects/`, `/api/auth/login/`, `/api/auth/callback/`, `/api/auth/user/`, `/api/auth/logout/`.

## Prerequisites

- Docker + Docker Compose
- Bun **1.4.4** (only for local frontend work) — `.bun-version` pins it
- Python 3.11 (only for local backend work; SQLite ships with Python)
- A 42 OAuth application: https://profile.intra.42.fr/oauth/applications

The backend is **Python/Django**; Bun only replaces npm/Node for the frontend.

## 1. First-time setup

```sh
cp .env.example .env
```

Edit `.env`:

```env
SECRET_KEY=change-me
DEBUG=True
DJANGO_ENV=development

API_42_UID=...
API_42_SECRET=...

APP_DOMAIN=localhost,127.0.0.1
HTTP_PORT=8080
HTTPS_PORT=8443
FRONTEND_URL=http://localhost:8080
BACKEND_URL=http://localhost:8080
```

There are no database credentials to configure. Compose sets `DB_DIR=/app/data`
and mounts the `sqlite_data` volume there; uncomment `DB_DIR` only if you want
the file somewhere else (e.g. `DB_DIR=./data` for a local, non-Docker run).

`HTTP_PORT` / `HTTPS_PORT` are host ports. The defaults are 8080/8443 so the
stack works with rootless Docker, which cannot bind privileged ports. Production
sets them back to 80/443. On a rootless host that uses `cloudflared`, you can keep
8080/8443 because the tunnel reaches `nginx:80` over the internal Docker network;
only change the sysctl if you genuinely need host ports below 1024:
`net.ipv4.ip_unprivileged_port_start=80`.

In the 42 OAuth application, set the redirect URI to:

```
http://localhost:8080/api/auth/callback/
```

## 2. Start everything (Docker)

```sh
docker compose up --build
```

Then open http://localhost:8080.

Useful:

```sh
docker compose logs -f            # all logs
docker compose logs -f backend    # Django
docker compose ps                 # what is up
docker compose down               # stop
docker compose down -v            # stop + wipe the database
```

The backend entrypoint runs migrations, collects static files, then starts Gunicorn
(or `runserver` when `DJANGO_ENV=development`).

### Seed project data

The database starts empty. Fetch projects from the 42 API:

```sh
docker compose exec backend python manage.py fetch_projects --cursus-id 21
# small test run:
docker compose exec backend python manage.py fetch_projects --cursus-id 21 --limit 10
```

### Backups

The database is one file, so a backup is one file:

```sh
docker compose exec backend python manage.py backup_db
docker compose cp backend:/app/data/backups/. ./backups/
```

`backup_db` uses SQLite's `VACUUM INTO`, which writes a consistent, compacted
snapshot without stopping the server (WAL contents included). Pass
`--output /app/data/my-copy.sqlite3` to choose the name. Keep copies off the host
that runs the stack.

To restore, stop the backend, replace the file, and start it again:

```sh
docker compose stop backend
docker compose cp ./backups/db-20260101-120000.sqlite3 backend:/app/data/db.sqlite3
docker compose start backend
```

### Admin

```sh
docker compose exec backend python manage.py createsuperuser
```

or set `DJANGO_SUPERUSER_*` in `.env` and let the entrypoint create it.
Admin lives at http://localhost:8080/admin/.

## 3. Local development (hot reload)

### Frontend

```sh
cd frontend
bun install
bun run dev        # http://localhost:3000
```

Vite proxies `/api` to `http://localhost:8000` by default. Point it elsewhere with:

```sh
VITE_API_PROXY=http://localhost:8000 bun run dev
```

Checks:

```sh
bun run build      # tsc -b && vite build
bun run lint
```

### Backend

SQLite is a file, so a local Django run needs no database service:

```sh
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

export DB_DIR=./data
export SECRET_KEY=dev-only-secret
export DEBUG=True
export DJANGO_ENV=development
export FRONTEND_URL=http://localhost:3000
export BACKEND_URL=http://localhost:8000

python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

`DB_DIR=./data` creates a separate database at `backend/data/db.sqlite3`. To work
against the data the container already has, publish Django from Compose instead:

```sh
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d backend
```

That exposes the container's Django on http://localhost:8000.

For local mode the 42 OAuth redirect URI must be
`http://localhost:8000/api/auth/callback/`, and `FRONTEND_URL` must be
`http://localhost:3000` so the callback lands back on the Vite server.

## 4. Production

```sh
docker compose --profile production up -d --build
```

Set `DEBUG=False`, `DJANGO_ENV=production`, `HTTP_PORT=80`, `HTTPS_PORT=443`, real
domains in `APP_DOMAIN` / `FRONTEND_URL` / `BACKEND_URL`, and the production redirect URI
(`https://<domain>/api/auth/callback/`). `cloudflared` is behind the `production`
profile and needs the tunnel credentials files referenced by `docker-compose.yml`.

## Troubleshooting

| Symptom | Likely cause |
| --- | --- |
| Blank page at http://localhost:8080 | frontend container not built; check `docker compose logs frontend` |
| `Failed to fetch projects` | backend down, or Vite proxy target wrong |
| Login loops / 401 after login | redirect URI mismatch, or cookies rejected on a non-localhost HTTP origin |
| `502` on `/api/` | backend still starting or crashed; `docker compose logs backend` |
| Port 8080 busy | change `HTTP_PORT` in `.env` |
| Empty explorer after setup | run `fetch_projects` (see above) |
| `unable to open database file` | `DB_DIR` points at a path the `django` user cannot write |
| `database is locked` | a long write is holding the file; check `docker compose logs backend` and keep workers low |

## Migration note

This project is planned to move under `~/Projects/42/AlumniPortugal`. That repo is a
static Next.js site with a hard "no backend, no auth, no runtime database" rule, so
Project Navigator cannot be merged into that app as-is. The viable options are a
monorepo/child folder (separate service, unchanged stack) or a deliberate rewrite of
this app to consume a static export — decide before moving files.
