#!/bin/bash

set -e

echo "🔨 Building Lambda monorepo..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Clean previous builds
print_status "Cleaning previous builds..."
rm -rf .aws-sam/
find . -name "dist" -type d -exec rm -rf {} +
find . -name "*.zip" -type f -delete

# Install dependencies
print_status "Installing dependencies..."
if command -v pnpm &> /dev/null; then
    pnpm install
else
    print_warning "pnpm not found, falling back to npm"
    npm install
fi

# Build shared packages first
print_status "Building shared packages..."
cd packages
for package in */; do
    if [ -d "$package" ]; then
        print_status "Building package: $package"
        cd "$package"
        if [ -f "package.json" ]; then
            npm run build
        fi
        cd ..
    fi
done
cd ..

# Build services
print_status "Building services..."
cd services
for service in */; do
    if [ -d "$service" ]; then
        print_status "Building service: $service"
        cd "$service"
        if [ -f "package.json" ]; then
            npm run build
            
            # Create deployment package
            print_status "Creating deployment package for $service"
            mkdir -p dist
            zip -r "dist/${service%/}.zip" dist/index.js
        fi
        cd ..
    fi
done
cd ..

# Run tests
print_status "Running tests..."
if command -v pnpm &> /dev/null; then
    pnpm test
else
    npm test
fi

# Type checking
print_status "Running type checks..."
if command -v pnpm &> /dev/null; then
    pnpm typecheck
else
    npm run typecheck
fi

# Linting
print_status "Running linter..."
if command -v pnpm &> /dev/null; then
    pnpm lint
else
    npm run lint
fi

print_status "Build completed successfully! 🎉"