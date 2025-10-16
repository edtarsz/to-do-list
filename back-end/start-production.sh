#!/bin/sh
set -e

echo "Running database migrations..."
npx prisma migrate deploy

echo "Starting the NestJS application..."
exec node dist/main.js