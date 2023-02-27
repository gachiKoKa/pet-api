FROM node:18-alpine

WORKDIR /user/src/app

COPY . .

RUN npm pkg delete scripts.prepare
RUN npm ci --omit=dev

CMD ["sh", "-c", "npm run migration:run && npm run start:prod"]