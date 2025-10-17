#!/bin/sh
set -e

echo "Waiting for PostgreSQL database..."

while ! pg_isready -h "db" -p "5432" -U "${DATABASE_USER}" > /dev/null 2>&1; do
  echo "Database is not ready yet. Waiting 2 seconds..."
  sleep 2
done

echo "Database ready!"
echo "Running database push..."
npx prisma db push --accept-data-loss --schema=./prisma/schema

echo "Starting the NestJS application..."
exec node dist/main