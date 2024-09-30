#!/bin/bash

# Initialize MySQL data directory
if [ ! -d "/var/lib/mysql/mysql" ]; then
    mysqld --initialize-insecure
fi

# Start MySQL
service mysql start

# Wait for MySQL to be ready
max_attempts=30
attempt=0
while ! mysqladmin ping -h localhost --silent && [ $attempt -lt $max_attempts ]; do
    attempt=$((attempt+1))
    echo "Waiting for MySQL to be ready... Attempt: $attempt"
    sleep 2
done

if [ $attempt -eq $max_attempts ]; then
    echo "MySQL failed to start after $max_attempts attempts. Exiting."
    exit 1
fi

# Create database if it doesn't exist
mysql -e "CREATE DATABASE IF NOT EXISTS mern_auth;"

# Build the client
cd /app/client
echo "Building React client..."
npm run build

# Build the server
cd /app/server
echo "Building Express server..."
npm run build

# Install serve to host the built React app
npm install -g serve

# Start the production server
echo "Starting Express server..."
node dist/index.js &

# Serve the built React app
echo "Serving React app..."
serve -s /app/client/build -l 3000 &

# Keep the container running
tail -f /dev/null