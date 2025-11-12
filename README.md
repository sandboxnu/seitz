## Prerequisites

- Docker & Docker Compose
- pnpm 8.9.0+

## Setup

1. **Install dependencies:**

```bash
   pnpm install
```

2. **Create environment file:**

```bash
   cp .env.example .env
   # Edit .env with your configuration (MONGO_URL, JWT_SECRET, etc.)
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

Services:

- Frontend: http://localhost:5173
- API: http://localhost:4000
- Redis: localhost:6379

## Production

```bash
# Build images
pnpm docker:build

# Start services
pnpm docker:up

# Check health
pnpm docker:health
```

Services:

- Frontend: http://localhost:8080
- API: http://localhost:4000

## Useful Commands

```bash
pnpm docker:down          # Stop all services
pnpm docker:restart       # Restart services
pnpm docker:clean         # Remove containers & volumes
pnpm docker:redis         # Access Redis CLI
pnpm docker:shell:api     # Shell into API container
```
