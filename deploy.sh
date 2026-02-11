#!/bin/bash

# Pokemon Resale Dashboard - Docker Deployment Script
# This script helps deploy the application using Docker

set -e  # Exit on error

echo "🚀 Pokemon Resale Dashboard - Docker Deployment"
echo "================================================"

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo "❌ Error: .env.production file not found!"
    echo "📝 Creating .env.production from .env.example..."
    
    if [ -f "apps/web/.env.example" ]; then
        cp apps/web/.env.example .env.production
        echo "✅ Created .env.production. Please edit it with your production values."
        exit 1
    else
        echo "❌ .env.example not found. Please create .env.production manually."
        exit 1
    fi
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Parse command line arguments
COMMAND=${1:-"up"}

case $COMMAND in
    "build")
        echo "🏗️  Building Docker image..."
        docker-compose build --no-cache
        echo "✅ Build complete!"
        ;;
    
    "up")
        echo "🚀 Starting services..."
        docker-compose up -d
        echo "✅ Services started!"
        echo "📊 View logs: docker-compose logs -f"
        echo "🌐 Access app: http://localhost:3000"
        ;;
    
    "down")
        echo "🛑 Stopping services..."
        docker-compose down
        echo "✅ Services stopped!"
        ;;
    
    "restart")
        echo "♻️  Restarting services..."
        docker-compose restart
        echo "✅ Services restarted!"
        ;;
    
    "logs")
        echo "📋 Showing logs..."
        docker-compose logs -f
        ;;
    
    "rebuild")
        echo "🔄 Rebuilding and restarting..."
        docker-compose down
        docker-compose build --no-cache
        docker-compose up -d
        echo "✅ Rebuild complete!"
        echo "🌐 Access app: http://localhost:3000"
        ;;
    
    "clean")
        echo "🧹 Cleaning up Docker resources..."
        docker-compose down -v --rmi all
        echo "✅ Cleanup complete!"
        ;;
    
    "status")
        echo "📊 Service status:"
        docker-compose ps
        ;;
    
    *)
        echo "Usage: $0 {build|up|down|restart|logs|rebuild|clean|status}"
        echo ""
        echo "Commands:"
        echo "  build    - Build Docker images"
        echo "  up       - Start services (default)"
        echo "  down     - Stop services"
        echo "  restart  - Restart services"
        echo "  logs     - View service logs"
        echo "  rebuild  - Rebuild images and restart"
        echo "  clean    - Remove all containers, volumes, and images"
        echo "  status   - Show service status"
        exit 1
        ;;
esac
