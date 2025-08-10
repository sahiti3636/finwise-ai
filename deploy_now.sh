#!/bin/bash

# FinWise Master Deployment Script
# This script provides options for deploying to different cloud platforms

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Function to check prerequisites
check_prerequisites() {
    echo "🔍 Checking deployment prerequisites..."
    
    # Check if we're in the right directory
    if [[ ! -f "manage_production.sh" ]]; then
        print_error "Please run this script from the FinWise project root directory"
        exit 1
    fi
    
    # Check if local production is running
    if ! ./manage_production.sh status &> /dev/null; then
        print_warning "Local production environment is not running. Starting it now..."
        ./manage_production.sh start
    fi
    
    print_status "Prerequisites check completed"
}

# Function to show deployment options
show_deployment_options() {
    echo ""
    echo "🚀 FinWise Deployment Options"
    echo "=============================="
    echo ""
    echo "Choose your deployment platform:"
    echo ""
    echo "1. 🌟 Heroku (Recommended for beginners)"
    echo "   - Easy setup, free tier available"
    echo "   - Automatic scaling and deployment"
    echo "   - Cost: Free tier + $7/month for basic"
    echo ""
    echo "2. 🌊 DigitalOcean App Platform"
    echo "   - Good performance, reasonable pricing"
    echo "   - Simple deployment process"
    echo "   - Cost: $5/month for basic instance"
    echo ""
    echo "3. ☁️  AWS Elastic Beanstalk"
    echo "   - Enterprise-grade, highly scalable"
    echo "   - Extensive services and features"
    echo "   - Cost: Pay-per-use, typically $20-100+/month"
    echo ""
    echo "4. 📚 View Deployment Guide"
    echo "   - Comprehensive deployment documentation"
    echo "   - Manual deployment steps"
    echo "   - Troubleshooting guide"
    echo ""
    echo "5. 🚪 Exit"
    echo ""
}

# Function to deploy to Heroku
deploy_heroku() {
    print_info "Deploying to Heroku..."
    
    if [[ ! -f "deploy_to_heroku.sh" ]]; then
        print_error "Heroku deployment script not found"
        return 1
    fi
    
    chmod +x deploy_to_heroku.sh
    ./deploy_to_heroku.sh
    
    if [[ $? -eq 0 ]]; then
        print_status "Heroku deployment completed successfully!"
    else
        print_error "Heroku deployment failed"
        return 1
    fi
}

# Function to deploy to DigitalOcean
deploy_digitalocean() {
    print_info "Preparing for DigitalOcean deployment..."
    
    if [[ ! -f "deploy_to_digitalocean.sh" ]]; then
        print_error "DigitalOcean deployment script not found"
        return 1
    fi
    
    chmod +x deploy_to_digitalocean.sh
    ./deploy_to_digitalocean.sh
    
    if [[ $? -eq 0 ]]; then
        print_status "DigitalOcean deployment files created!"
        print_info "Follow the instructions in DIGITALOCEAN_DEPLOYMENT.md to complete deployment"
    else
        print_error "DigitalOcean deployment preparation failed"
        return 1
    fi
}

# Function to deploy to AWS
deploy_aws() {
    print_info "Preparing for AWS deployment..."
    
    if [[ ! -f "deploy_to_aws.sh" ]]; then
        print_error "AWS deployment script not found"
        return 1
    fi
    
    chmod +x deploy_to_aws.sh
    ./deploy_to_aws.sh
    
    if [[ $? -eq 0 ]]; then
        print_status "AWS deployment files created!"
        print_info "Follow the instructions in AWS_DEPLOYMENT.md to complete deployment"
    else
        print_error "AWS deployment preparation failed"
        return 1
    fi
}

# Function to show deployment guide
show_deployment_guide() {
    if [[ -f "DEPLOYMENT_GUIDE.md" ]]; then
        echo ""
        print_info "Opening deployment guide..."
        if command -v code &> /dev/null; then
            code DEPLOYMENT_GUIDE.md
        elif command -v nano &> /dev/null; then
            nano DEPLOYMENT_GUIDE.md
        else
            cat DEPLOYMENT_GUIDE.md
        fi
    else
        print_error "Deployment guide not found"
    fi
}

# Function to handle user choice
handle_choice() {
    local choice=$1
    
    case $choice in
        1)
            print_info "You selected Heroku deployment"
            deploy_heroku
            ;;
        2)
            print_info "You selected DigitalOcean deployment"
            deploy_digitalocean
            ;;
        3)
            print_info "You selected AWS deployment"
            deploy_aws
            ;;
        4)
            show_deployment_guide
            ;;
        5)
            print_info "Exiting deployment script"
            exit 0
            ;;
        *)
            print_error "Invalid choice. Please select 1-5"
            return 1
            ;;
    esac
}

# Main function
main() {
    echo "🚀 Welcome to FinWise Deployment!"
    echo "=================================="
    
    # Check prerequisites
    check_prerequisites
    
    # Main loop
    while true; do
        show_deployment_options
        
        read -p "Enter your choice (1-5): " choice
        
        if handle_choice $choice; then
            echo ""
            read -p "Press Enter to continue or 'q' to quit: " continue_choice
            if [[ $continue_choice == "q" ]]; then
                break
            fi
        fi
        
        echo ""
    done
    
    echo ""
    print_status "Thank you for using FinWise Deployment!"
    echo "🌍 Your app will be accessible worldwide once deployed!"
}

# Run main function
main "$@" 