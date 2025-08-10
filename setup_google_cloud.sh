#!/bin/bash
# Setup script for Google Cloud SDK

echo "🚀 Setting up Google Cloud SDK for FinWise deployment..."

# Add Google Cloud SDK to PATH for current session
export PATH=$PATH:~/Desktop/google-cloud-sdk/bin

# Check if gcloud is working
if command -v gcloud &> /dev/null; then
    echo "✅ Google Cloud SDK is now accessible"
    echo "Current version: $(gcloud --version | head -1)"
    echo ""
    
    # Show current configuration
    echo "🔧 Current Google Cloud Configuration:"
    gcloud config list
    echo ""
    
    # Check if required APIs are enabled
    echo "🔍 Checking required APIs..."
    gcloud services list --enabled --filter="name:(cloudbuild.googleapis.com OR run.googleapis.com OR sqladmin.googleapis.com OR secretmanager.googleapis.com)"
    echo ""
    
    echo "🎯 Ready for deployment!"
    echo "Run: ./deploy_to_google_cloud.sh"
    
else
    echo "❌ Failed to set up Google Cloud SDK"
    exit 1
fi 