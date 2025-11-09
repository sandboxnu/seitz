FROM node:20-alpine AS development

WORKDIR /app

ENV HUSKY=0

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json* pnpm-lock.yaml* pnpm-workspace.yaml* ./
COPY packages/ui/package.json ./packages/ui/
COPY packages/shared/package.json ./packages/shared/

RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
  pnpm install --frozen-lockfile --ignore-scripts

COPY packages/shared ./packages/shared
COPY packages/ui ./packages/ui

EXPOSE 5173

CMD ["pnpm", "--filter", "ui", "dev", "--host", "0.0.0.0"]

FROM node:20-alpine AS builder

WORKDIR /app

ENV HUSKY=0

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json* pnpm-lock.yaml* pnpm-workspace.yaml* ./
COPY packages/ui/package.json ./packages/ui/
COPY packages/shared/package.json ./packages/shared/

RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
  pnpm install --frozen-lockfile --ignore-scripts

COPY packages/shared ./packages/shared
COPY packages/ui ./packages/ui

ARG API_URL=http://localhost:4000
ENV VITE_API_URL=$API_URL

WORKDIR /app/packages/shared
RUN pnpm build

WORKDIR /app/packages/ui

# Build without type checking (skip vue-tsc)
RUN pnpm vite build

FROM nginxinc/nginx-unprivileged:1.27-alpine AS production

USER root
RUN apk upgrade --no-cache && \
  apk add --no-cache curl

USER nginx

COPY packages/ui/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder --chown=nginx:nginx /app/packages/ui/dist /usr/share/nginx/html

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080 || exit 1

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]