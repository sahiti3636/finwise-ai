#!/bin/bash
# Script to switch Google Cloud account to p.sahiti.2006@gmail.com

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 Switching Google Cloud Account${NC}"
echo "====================================="
echo "Target Account: p.sahiti2006@gmail.com"
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ Google Cloud SDK not found. Please install it first:${NC}"
    echo "   https://cloud.google.com/sdk/docs/install"
    echo ""
    echo "Or use Homebrew on macOS:"
    echo "   brew install google-cloud-sdk"
    exit 1
fi

echo -e "${YELLOW}🔍 Current Google Cloud Configuration:${NC}"
gcloud config list
echo ""

# Check current authenticated accounts
echo -e "${YELLOW}🔐 Currently Authenticated Accounts:${NC}"
gcloud auth list
echo ""

# Function to switch to new account
switch_account() {
    echo -e "${YELLOW}🔄 Switching to p.sahiti.2006@gmail.com...${NC}"
    
    # Revoke current authentication if exists
    if gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
        echo "Revoking current authentication..."
        gcloud auth revoke --all
    fi
    
    # Login with new account
    echo "Please login with p.sahiti2006@gmail.com in your browser..."
    gcloud auth login p.sahiti2006@gmail.com
    
    # Set up application default credentials
    echo "Setting up application default credentials..."
    gcloud auth application-default login
    
    echo -e "${GREEN}✅ Successfully switched to p.sahiti2006@gmail.com${NC}"
}

# Function to create new project
create_new_project() {
    echo -e "${YELLOW}🏗️  Creating new Google Cloud project...${NC}"
    
    # Generate unique project ID
    TIMESTAMP=$(date +%s)
    NEW_PROJECT_ID="finwise-ai-${TIMESTAMP}"
    
    echo "Creating new project: $NEW_PROJECT_ID"
    gcloud projects create $NEW_PROJECT_ID --name="FinWise AI Financial Advisor"
    
    # Set the new project
    gcloud config set project $NEW_PROJECT_ID
    
    echo -e "${GREEN}✅ New project created: $NEW_PROJECT_ID${NC}"
    echo "Project ID: $NEW_PROJECT_ID"
    
    # Enable required APIs
    echo "Enabling required APIs..."
    gcloud services enable cloudbuild.googleapis.com
    gcloud services enable run.googleapis.com
    gcloud services enable sqladmin.googleapis.com
    gcloud services enable compute.googleapis.com
    gcloud services enable storage.googleapis.com
    gcloud services enable secretmanager.googleapis.com
    
    echo -e "${GREEN}✅ APIs enabled successfully${NC}"
}

# Function to update deployment scripts
update_deployment_scripts() {
    echo -e "${YELLOW}📝 Updating deployment scripts with new project ID...${NC}"
    
    # Get current project ID
    CURRENT_PROJECT=$(gcloud config get-value project)
    
    if [ ! -z "$CURRENT_PROJECT" ]; then
        # Update deploy_to_google_cloud.sh
        if [ -f "deploy_to_google_cloud.sh" ]; then
            sed -i.bak "s/PROJECT_NAME=\"finwise-ai\"/PROJECT_NAME=\"$CURRENT_PROJECT\"/" deploy_to_google_cloud.sh
            echo -e "${GREEN}✅ Updated deploy_to_google_cloud.sh${NC}"
        fi
        
        # Update GOOGLE_CLOUD_DEPLOYMENT.md
        if [ -f "GOOGLE_CLOUD_DEPLOYMENT.md" ]; then
            sed -i.bak "s/finwise-ai/$CURRENT_PROJECT/g" GOOGLE_CLOUD_DEPLOYMENT.md
            echo -e "${GREEN}✅ Updated GOOGLE_CLOUD_DEPLOYMENT.md${NC}"
        fi
        
        echo -e "${GREEN}✅ All deployment scripts updated with new project ID${NC}"
    fi
}

# Function to show next steps
show_next_steps() {
    echo -e "${BLUE}🎯 Next Steps${NC}"
    echo "=============="
    echo -e "${GREEN}✅ Account switched to: p.sahiti2006@gmail.com${NC}"
    echo -e "${GREEN}✅ New project created: $(gcloud config get-value project)${NC}"
    echo ""
    echo "🚀 Ready to deploy! Run one of these commands:"
    echo "   ./deploy_to_google_cloud.sh          # Full automated deployment"
    echo "   ./deploy_now.sh                      # Interactive deployment menu"
    echo ""
    echo "🔧 Or manually:"
    echo "   gcloud config set project $(gcloud config get-value project)"
    echo "   gcloud services enable cloudbuild.googleapis.com"
    echo "   gcloud services enable run.googleapis.com"
    echo ""
    echo -e "${BLUE}💡 Tip: The new project ID has been automatically updated in all deployment scripts${NC}"
}

# Main execution
main() {
    echo -e "${YELLOW}⚠️  This will switch your Google Cloud authentication to p.sahiti2006@gmail.com${NC}"
    echo "Do you want to continue? (y/n)"
    read -r response
    
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        switch_account
        create_new_project
        update_deployment_scripts
        show_next_steps
    else
        echo "Operation cancelled."
        exit 0
    fi
}

# Run main function
main "$@" 