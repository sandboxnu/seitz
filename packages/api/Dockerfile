FROM node:20-alpine

RUN corepack enable

WORKDIR /app

COPY shared ./shared
COPY api/package.json api/pnpm-lock.yaml ./ 
RUN --mount=type=cache,target=/root/.pnpm-store \
  pnpm install --frozen-lockfile

COPY api ./api

EXPOSE 3000 

CMD ["node", "src/app.js"]