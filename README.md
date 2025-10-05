# Docker Desktop Download

[Docker Desktop Download](https://www.docker.com/products/docker-desktop/)

## To Run the Program

### Install Node Modules

```bash
pnpm install
```

### Boot up Docker Infrastructure (Only if Redis is currently not running locally)

```bash
pnpm run dev:infra
```

### Run the Program

```bash
pnpm run dev
```

### Cleanup Infrastructure

```bash
pnpm run dev:infra:stop
```
