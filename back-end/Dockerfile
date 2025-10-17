# Stage 1: Build
FROM node:22.19.0-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

RUN npm install

COPY prisma.config.ts ./
COPY prisma ./prisma/
COPY src ./src/

RUN npx prisma generate

RUN npm run build

# Stage 2: Production
FROM node:22.19.0-alpine

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

ENV NODE_ENV=production

EXPOSE 10000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]