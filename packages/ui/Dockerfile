ARG NODE_VERSION=23, 11.0-alpine
ARG NGINX_VERSION=alpine3.22

FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app 

COPY ui/package.json ./
RUN --mount=type=cache,target=/root/.pnpm-store \
  pnpm install 

COPY shared ./shared
COPY ui ./ui 

RUN pnpm build

FROM nginxinc/nginx-unprivileged:latest AS runner

USER nginx

COPY ui/nginx.conf /etc/nginx/nginx.conf

COPY --chown=nginx:nginx --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080

ENTRYPOINT [ "nginx", "-c", "/etc/nginx/nginx.conf" ]
CMD ["nginx", "-g", "demon off;"]