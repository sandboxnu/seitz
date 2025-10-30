# Docker Desktop Download

[Docker Desktop Download](https://www.docker.com/products/docker-desktop/)

## To Run the Program

### Install Node Modules

```bash
pnpm install
```

### Boot the Infrastructure (Redis Server)

```bash
pnpm run dev:infra
```

### Run the Program

```bash
pnpm run dev
```

### Cleanup Docker Infrastructure

```bash
pnpm run dev:infra:stop
```

### To see if you have a Docker container currently running

```bash
docker ps
```
