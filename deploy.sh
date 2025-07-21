#!/bin/bash

set -e
set -o pipefail

# === Config ===
APP_DIR="/home/Tazaar/NDEReportingPortal-Web"
DOCKER_IMAGE_NAME="reportingportalweb"
DOCKER_COMPOSE_FILE="$APP_DIR/docker-compose.yml"

echo "➡️ Starting build and deploy..."

cd "$APP_DIR"

# Install Docker Compose if not available
if ! command -v docker-compose &>/dev/null; then
    echo "⚙️ Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.17.0/docker-compose-linux-x86_64" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Stop existing containers
echo "🛑 Stopping containers..."
sudo docker-compose -f "$DOCKER_COMPOSE_FILE" down

# Remove old image
echo "🧼 Removing old Docker image(s)..."
OLD_IMAGES=$(sudo docker images -q "$DOCKER_IMAGE_NAME")
if [ -n "$OLD_IMAGES" ]; then
    sudo docker rmi $OLD_IMAGES || true
fi

# Build new image
echo "🐳 Building Docker image..."
sudo docker-compose -f "$DOCKER_COMPOSE_FILE" build --no-cache

# Start containers
echo "🚀 Starting containers..."
sudo docker-compose -f "$DOCKER_COMPOSE_FILE" up -d

echo "✅ Deployment complete!"
