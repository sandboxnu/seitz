FROM node:20-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY shared ./shared
COPY api/package.json ./ 
RUN --mount=type=cache,target=/root/.pnpm-store \
  pnpm install

COPY api ./api

EXPOSE 3000 

CMD ["node", "src/app.js"]