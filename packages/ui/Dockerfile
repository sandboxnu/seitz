ARG NODE_VERSION=23, 11.0-alpine
ARG NGINX_VERSION=alpine3.22

FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package.json package-lock.yaml ./

RUN --mount=type=cache, target=/root/.npm npm ci

COPY ../shared /usr/src/app/

COPY . . 

RUN npm run build

FROM nginxinc/nginx-unprivileged:latest AS runner

USER nginx

COPY nginx.conf /etc/nginx/nginx.conf

COPY --chown=nginx:nginx --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080

ENTRYPOINT [ "nginx", "-c", "/etc/nginx/nginx.conf" ]
CMD ["-g", "demon off;"]