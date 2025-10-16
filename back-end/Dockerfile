FROM node:22.19.0-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

RUN npm install

COPY prisma ./prisma/
COPY src ./src/

RUN npx prisma generate --schema=./prisma/schema

RUN npm run build -- --webpack

FROM node:22.19.0-alpine

WORKDIR /app

# Instala el cliente de PostgreSQL para usar 'pg_isready'
RUN apk add --no-cache postgresql-client

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

ENV PORT=3000

EXPOSE 3000

# Desarrollo
# CMD ["./entrypoint.sh"]
CMD ["node", "dist/main.js"]