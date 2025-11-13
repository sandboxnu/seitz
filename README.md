## Prerequisites

- Docker & Docker Compose
- pnpm 8.9.0+

## Setup

1. **Install dependencies:**

```bash
   pnpm install
```

# Docker Desktop Download

[Docker Desktop Download](https://www.docker.com/products/docker-desktop/)

## Development

```bash
# Start all services in development mode
pnpm docker:dev

# View logs
pnpm docker:logs
```

Services and Ports:

- Frontend: http://localhost:5173
- API: http://localhost:4000
- Redis: localhost:6379

## Production

```bash
# Build Images and Start services
pnpm docker:prod

# OR build images and start services separately
pnpm docker:build

docker compose up -d

# Check health
pnpm docker:health
```

## Useful Commands

```bash
pnpm docker:down          # Stop all services
pnpm docker:restart       # Restart services
pnpm docker:clean         # Remove containers & volumes
pnpm docker:redis         # Access Redis CLI
pnpm docker:shell:api     # Shell into API container
```
