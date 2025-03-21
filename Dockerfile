FROM node:18-alpine

RUN apk add --no-cache openssl

WORKDIR /usr/app

COPY package*.json ./
COPY prisma ./prisma/
RUN yarn install

RUN npx prisma generate

COPY . .

ARG DATABASE_URL

ENV DATABASE_URL=$DATABASE_URL

RUN echo "DATABASE_URL=${DATABASE_URL}" > .env

RUN yarn build

EXPOSE 3001

CMD ["yarn", "start"]