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
ENVIRONMENT="dev"
AUTO_APPROVE=false
PLAN_ONLY=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -e|--environment)
            ENVIRONMENT="$2"
            shift 2
            ;;
        -a|--auto-approve)
            AUTO_APPROVE=true
            shift
            ;;
        -p|--plan-only)
            PLAN_ONLY=true
            shift
            ;;
        -h|--help)
            echo "Usage: $0 [OPTIONS]"
            echo "Options:"
            echo "  -e, --environment    Environment to deploy to (dev|staging|production)"
            echo "  -a, --auto-approve   Auto approve terraform apply"
            echo "  -p, --plan-only      Only run terraform plan"
            echo "  -h, --help           Show this help message"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(dev|staging|production)$ ]]; then
    print_error "Invalid environment: $ENVIRONMENT. Must be one of: dev, staging, production"
    exit 1
fi

print_info "🚀 Deploying to $ENVIRONMENT environment..."

# Check if terraform is installed
if ! command -v terraform &> /dev/null; then
    print_error "Terraform is not installed. Please install Terraform first."
    exit 1
fi

# Check if AWS CLI is installed and configured
if ! command -v aws &> /dev/null; then
    print_error "AWS CLI is not installed. Please install AWS CLI first."
    exit 1
fi

# Verify AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
    print_error "AWS credentials not configured or invalid. Please configure AWS CLI."
    exit 1
fi

# Build the project first
print_status "Building project..."
./scripts/build.sh

# Navigate to the environment directory
TERRAFORM_DIR="infra/environments/$ENVIRONMENT"
if [ ! -d "$TERRAFORM_DIR" ]; then
    print_error "Environment directory not found: $TERRAFORM_DIR"
    exit 1
fi

cd "$TERRAFORM_DIR"

# Check if terraform.tfvars exists
if [ ! -f "terraform.tfvars" ]; then
    print_warning "terraform.tfvars not found. Please create it based on terraform.tfvars.example"
    if [ -f "terraform.tfvars.example" ]; then
        print_info "Example file found. You can copy it:"
        print_info "cp terraform.tfvars.example terraform.tfvars"
    fi
    exit 1
fi

# Initialize Terraform
print_status "Initializing Terraform..."
terraform init

# Validate Terraform configuration
print_status "Validating Terraform configuration..."
terraform validate

# Plan the deployment
print_status "Planning deployment..."
terraform plan -out=tfplan

if [ "$PLAN_ONLY" = true ]; then
    print_info "Plan-only mode enabled. Deployment plan saved to tfplan"
    exit 0
fi

# Apply the deployment
if [ "$AUTO_APPROVE" = true ]; then
    print_status "Applying deployment with auto-approve..."
    terraform apply -auto-approve tfplan
else
    print_status "Applying deployment..."
    terraform apply tfplan
fi

# Clean up plan file
rm -f tfplan

# Show outputs
print_status "Deployment outputs:"
terraform output

print_status "Deployment to $ENVIRONMENT completed successfully! 🎉"