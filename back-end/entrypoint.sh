#!/bin/sh
set -e

echo "----------------------------------------"
echo "Waiting for PostgreSQL database to be available..."
echo "----------------------------------------"

while ! pg_isready -h "db" -p "5432" -U "${DATABASE_USER}" > /dev/null 2>&1; do
  echo "Database is not ready yet. Waiting 2 seconds..."
  sleep 2
done

echo "----------------------------------------"
echo "Database is ready to accept connections!"
echo "----------------------------------------"

echo "Running database push..."
npx prisma db push --accept-data-loss --schema=./prisma/schema

echo "----------------------------------------"
echo "Database ready!"
echo "----------------------------------------"

echo "Starting the NestJS application..."
exec node dist/main