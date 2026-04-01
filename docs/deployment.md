# Frontend Deployment

## Overview

The frontend deploys automatically via **GitHub Actions** on every push to `main`. The pipeline builds a standalone Next.js bundle, syncs it to the DigitalOcean droplet over SSH (via Tailscale), and restarts PM2.

## Pipeline (`.github/workflows/deploy.yml`)

```
Push to main
  → Checkout + npm ci
  → Connect to Tailscale (for secure SSH to droplet)
  → Build standalone bundle (npm run build)
  → rsync .next/standalone/, .next/static/, public/ to droplet
  → Restart (or start) PM2 process
```

### Build

The build runs on GitHub Actions with these environment variables injected:
- `API_URL` — points to the CMS via Tailscale IP (`http://<TAILSCALE_IP>:3000`)
- `PAYLOAD_WEBHOOK_SECRET` — baked into the compiled bundle

The `output: 'standalone'` setting in `next.config.ts` produces a self-contained Node.js server in `.next/standalone/`.

### Sync

Three rsync commands deploy the build artifacts:
1. `.next/standalone/` → `/var/www/intelligent-project-frontend/` (server + node_modules)
2. `.next/static/` → `/var/www/intelligent-project-frontend/.next/static/` (client-side assets)
3. `public/` → `/var/www/intelligent-project-frontend/public/` (static files)

All syncs use `--delete` to remove stale files.

### Runtime

PM2 runs the app with these inline environment variables:
- `API_URL=http://localhost:3000` — CMS is on the same droplet
- `PAYLOAD_WEBHOOK_SECRET` — for webhook validation
- `PORT=3001` — Next.js listens here; nginx proxies port 80 to it

The PM2 process is named `intelligent-project-frontend` and runs `/var/www/intelligent-project-frontend/server.js`.

## GitHub Actions Secrets

| Secret | Purpose |
|--------|---------|
| `TAILSCALE_OAUTH_CLIENT_ID` | Tailscale OAuth client for CI |
| `TAILSCALE_OAUTH_SECRET` | Tailscale OAuth secret |
| `TAILSCALE_IP` | Droplet's Tailscale IP |
| `PAYLOAD_WEBHOOK_SECRET` | Webhook HMAC secret |
| `DROPLET_SSH_KEY` | Private SSH key for deploy user |
| `DROPLET_HOST_KEY` | Droplet's SSH host key (known_hosts) |
| `DROPLET_SSH_PORT` | SSH port (2222) |
| `DROPLET_USER` | SSH user (`deploy`) |
| `DROPLET_HOST` | Droplet public IP |

## Manual Deployment

If you need to deploy manually:

```bash
# Build locally (set env vars first)
API_URL=http://<DROPLET_TAILSCALE_IP>:3000 npm run build

# Sync to droplet
rsync -az --delete -e "ssh -p 2222" .next/standalone/ deploy@<DROPLET_IP>:/var/www/intelligent-project-frontend/
rsync -az --delete -e "ssh -p 2222" .next/static/ deploy@<DROPLET_IP>:/var/www/intelligent-project-frontend/.next/static/
rsync -az --delete -e "ssh -p 2222" public/ deploy@<DROPLET_IP>:/var/www/intelligent-project-frontend/public/

# Restart on droplet
ssh -p 2222 deploy@<DROPLET_IP> "API_URL=http://localhost:3000 PORT=3001 pm2 restart intelligent-project-frontend"
```

## Production Ports

| Port | Service | Access |
|------|---------|--------|
| 80 | nginx → Next.js | Public (frontend) |
| 3001 | Next.js (PM2) | Internal only (nginx proxies to it) |
| 3000 | PayloadCMS | Public (API + admin) |
