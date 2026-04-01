# Frontend Local Development

## Prerequisites

- Node.js 20 (via nvm recommended)
- The backend (PayloadCMS) running locally or accessible remotely

## Setup

```bash
# Clone the repo
git clone <repo-url>
cd intelligent-project-frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

## Environment Variables

Edit `.env.local`:

```env
# Point to your PayloadCMS instance
API_URL=http://localhost:3000

# Optional — only needed for testing webhook revalidation locally
PAYLOAD_WEBHOOK_SECRET=<your-secret>
```

The `API_URL` is required. The app will throw on startup if it's missing.

## Running

```bash
# Start dev server with Turbopack (hot reload)
npm run dev
```

The app runs on `http://localhost:3000` by default in dev mode. If the backend is also on port 3000, start the frontend on a different port:

```bash
PORT=3001 npm run dev
```

## Other Commands

| Command | Description |
|---------|-------------|
| `npm run build` | Production build (standalone output) |
| `npm run start` | Start production server |
| `npm run lint` | ESLint via Next.js |

## Notes

- No test framework is configured
- The dev server uses Turbopack for fast rebuilds
- SVGs are imported as React components (via `@svgr/webpack`)
- SCSS Modules are used for styling — changes hot-reload in dev
