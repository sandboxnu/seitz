FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json ./ 
RUN pnpm ci

COPY ../shared /usr/src/app/

COPY . .

EXPOSE 4000

CMD ["node", "app.js"]