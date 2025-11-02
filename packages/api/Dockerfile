FROM node:20-alpine AS development

WORKDIR /app

ENV HUSKY=0

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json* pnpm-lock.yaml* pnpm-workspace.yaml* ./
COPY packages/api/package.json ./packages/api/
COPY packages/shared/package.json ./packages/shared/

RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
  pnpm install --frozen-lockfile

COPY packages/shared ./packages/shared
COPY packages/api ./packages/api

EXPOSE 4000

CMD ["pnpm", "--filter", "api", "dev"]

FROM node:20-alpine AS builder

WORKDIR /app

ENV HUSKY=0

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json* pnpm-lock.yaml* pnpm-workspace.yaml* ./
COPY packages/api/package.json ./packages/api/
COPY packages/shared/package.json ./packages/shared/

RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
  pnpm install --frozen-lockfile --prod

COPY packages/shared ./packages/shared
COPY packages/api ./packages/api

FROM node:20-alpine AS production

WORKDIR /app

ENV HUSKY=0

RUN apk add --no-cache dumb-init && addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

COPY --chown=nodejs:nodejs --from=builder /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs --from=builder /app/packages/shared ./shared
COPY --chown=nodejs:nodejs --from=builder /app/packages/api ./

USER nodejs

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); });"

EXPOSE 4000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "src/app.js"]