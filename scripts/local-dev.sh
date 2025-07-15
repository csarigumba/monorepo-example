#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Default values
MODE="api"
SERVICE=""
PORT=3000

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -m|--mode)
            MODE="$2"
            shift 2
            ;;
        -s|--service)
            SERVICE="$2"
            shift 2
            ;;
        -p|--port)
            PORT="$2"
            shift 2
            ;;
        -h|--help)
            echo "Usage: $0 [OPTIONS]"
            echo "Options:"
            echo "  -m, --mode      Mode to run (api|invoke|build)"
            echo "  -s, --service   Service name for invoke mode"
            echo "  -p, --port      Port for API mode (default: 3000)"
            echo "  -h, --help      Show this help message"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Check if SAM CLI is installed
if ! command -v sam &> /dev/null; then
    print_error "SAM CLI is not installed. Please install SAM CLI first."
    print_info "Install with: pip install aws-sam-cli"
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    print_error "Docker is not running. Please start Docker first."
    exit 1
fi

# Build the project first
print_status "Building project for local development..."
./scripts/build.sh

case $MODE in
    "api")
        print_status "Starting local API Gateway on port $PORT..."
        sam local start-api --port $PORT --host 0.0.0.0
        ;;
    "invoke")
        if [ -z "$SERVICE" ]; then
            print_error "Service name required for invoke mode. Use -s flag."
            exit 1
        fi
        print_status "Invoking service: $SERVICE"
        sam local invoke $SERVICE
        ;;
    "build")
        print_status "Building SAM application..."
        sam build
        print_status "SAM build completed successfully!"
        ;;
    *)
        print_error "Invalid mode: $MODE. Must be one of: api, invoke, build"
        exit 1
        ;;
esac