ARG NODE_VERSION=23, 11.0-alpine
ARG NGINX_VERSION=alpine3.22

FROM node:20-alpine AS builder

RUN corepack enable

WORKDIR /app 

COPY ui/package.json ui/pnpm-lock.yaml ./
RUN --mount=type=cache,target=/root/.pnpm-store \
  pnpm install --frozen-lockfile

COPY shared ./shared
COPY ui ./ui 

RUN npm run build

FROM nginxinc/nginx-unprivileged:latest AS runner

USER nginx

COPY ui/nginx.conf /etc/nginx/nginx.conf

COPY --chown=nginx:nginx --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080

ENTRYPOINT [ "nginx", "-c", "/etc/nginx/nginx.conf" ]
CMD ["nginx", "-g", "demon off;"]