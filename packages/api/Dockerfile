FROM node:20-alpine AS development
WORKDIR /app
ENV HUSKY=0
RUN apk add --no-cache python3 make g++
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json* pnpm-lock.yaml* pnpm-workspace.yaml* ./
COPY packages/api/package.json ./packages/api/
COPY packages/shared/package.json ./packages/shared/
RUN pnpm install --frozen-lockfile
COPY packages/shared ./packages/shared
COPY packages/api ./packages/api
RUN pnpm --filter @seitz/shared build
EXPOSE 4000
CMD ["pnpm", "--filter", "@seitz/api", "dev"]
FROM node:20-alpine AS builder
WORKDIR /app
ENV HUSKY=0
RUN apk add --no-cache python3 make g++
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json* pnpm-lock.yaml* pnpm-workspace.yaml* ./
COPY packages/api/package.json ./packages/api/
COPY packages/shared/package.json ./packages/shared/
RUN pnpm install
COPY packages/shared ./packages/shared
COPY packages/api ./packages/api
RUN pnpm --filter @seitz/shared build
RUN pnpm --filter @seitz/api build
WORKDIR /app
RUN pnpm deploy --filter=api --prod /prod/api
FROM node:20-alpine AS production
WORKDIR /app
RUN apk add --no-cache dumb-init python3 make g++ && \
  addgroup -g 1001 -S nodejs && \
  adduser -S nodejs -u 1001
COPY --chown=nodejs:nodejs --from=builder /prod/api ./
COPY --chown=nodejs:nodejs --from=builder /app/packages/shared/dist ./node_modules/@seitz/shared/dist
COPY --chown=nodejs:nodejs --from=builder /app/packages/shared/package.json ./node_modules/@seitz/shared/package.json
USER nodejs
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD pgrep node || exit 1
EXPOSE 4000
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]