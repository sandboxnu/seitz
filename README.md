## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- pnpm 8.9.0+ (included via corepack in Docker)

## Setup

**Install dependencies (optional for local development):**

```bash
   pnpm install
```

## Development

Start all services in development mode with hot-reload:

```bash
pnpm dev
```

**Services and Ports:**

- Frontend: http://localhost:5173
- API: http://localhost:4000
- Redis: localhost:6379

**View logs:**

```bash
pnpm logs              # All services
pnpm logs:api          # API only
pnpm logs:frontend     # Frontend only
```

## Production

Test the production build locally:

```bash
pnpm prod:build
```

**Check health:**

```bash
pnpm health
```

## Useful Commands

```bash
pnpm down              # Stop all services
pnpm clean             # Remove containers, volumes, and cleanup
pnpm cli:redis             # Access Redis CLI
pnpm shell:api         # Shell into API container
pnpm shell:frontend    # Shell into frontend container
```

## Code Quality

```bash
pnpm lint              # Check for linting errors
pnpm format            # Format code and fix linting issues
```

## Project Structure

```
seitz/
├── packages/
│   ├── api/           # Express backend
│   ├── ui/            # Vue.js frontend
│   └── shared/        # Shared types/utilities
├── docker-compose.yml            # Production configuration
├── docker-compose.dev.yml        # Development configuration
└── package.json                  # Root package scripts
```

## Troubleshooting

**Containers won't start:**

```bash
pnpm clean
pnpm dev:build
```

**Port conflicts:**
Make sure ports 4000, 5173, and 6379 are not in use by other applications.

**Environment variables not loading:**
Ensure `.env` file exists in the root directory with all required variables.
