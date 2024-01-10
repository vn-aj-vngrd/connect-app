FROM node:18-alpine as builder
WORKDIR /connect-app

COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine as runner
WORKDIR /connect-app
COPY --from=builder /connect-app/package.json .
COPY --from=builder /connect-app/package-lock.json .
COPY --from=builder /connect-app/next.config.js ./
COPY --from=builder /connect-app/public ./public
COPY --from=builder /connect-app/.next/standalone ./
COPY --from=builder /connect-app/.next/static ./.next/static
EXPOSE 3000
ENTRYPOINT ["npm", "start"]