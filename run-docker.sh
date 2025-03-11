#!/bin/bash
set -e

# Check if .env file exists
if [ ! -f .env ]; then
  echo "Error: .env file not found!"
  exit 1
fi

echo "Starting Docker Compose using .env file..."
docker-compose down
docker-compose build webapp
docker-compose up
