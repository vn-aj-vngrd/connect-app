FROM node:18-alpine

WORKDIR /app

COPY package.json ./

RUN yarn install

COPY . .

RUN yarn build

COPY .next ./.next

CMD ["yarn", "dev"]