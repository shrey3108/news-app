#!/bin/bash

# Automatic Deployment Script for Real-Time News App

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to log messages
log() {
    echo -e "${GREEN}[DEPLOYMENT] $1${NC}"
}

# Function to log errors
error() {
    echo -e "${RED}[ERROR] $1${NC}"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    error "Docker Compose is not installed. Please install Docker Compose."
    exit 1
fi

# Navigate to project directory
cd "$(dirname "$0")"

# Pull latest changes (optional, comment out if not using git)
log "Pulling latest changes..."
git pull origin main

# Prune old Docker resources to free up space
log "Cleaning up old Docker resources..."
docker system prune -f

# Build and start containers
log "Starting deployment..."
docker-compose down
docker-compose up --build -d

# Check deployment status
if [ $? -eq 0 ]; then
    log "🚀 Deployment Successful!"
    log "Access Points:"
    log "- Frontend: http://localhost:3000"
    log "- Backend: http://localhost:5000"
    log "- Swagger Docs: http://localhost:5000/api-docs"
else
    error "Deployment Failed. Check logs for details."
    docker-compose logs
fi

# Optional: Show running containers
docker ps
