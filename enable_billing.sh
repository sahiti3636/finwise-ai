#!/bin/bash
# Script to enable billing for Google Cloud project

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}💳 Google Cloud Billing Setup${NC}"
echo "================================="

# Get current project
CURRENT_PROJECT=$(gcloud config get-value project)
echo -e "${GREEN}Current Project: $CURRENT_PROJECT${NC}"

# Check billing accounts
echo -e "${YELLOW}🔍 Checking available billing accounts...${NC}"
BILLING_ACCOUNTS=$(gcloud billing accounts list --format="value(ACCOUNT_ID)")

if [ -z "$BILLING_ACCOUNTS" ]; then
    echo -e "${RED}❌ No billing accounts found.${NC}"
    echo ""
    echo "To create a billing account:"
    echo "1. Go to: https://console.cloud.google.com/billing"
    echo "2. Click 'Create billing account'"
    echo "3. Follow the setup process"
    echo "4. Run this script again"
    exit 1
fi

echo -e "${GREEN}Available billing accounts:${NC}"
gcloud billing accounts list

# Check if project already has billing enabled
echo -e "${YELLOW}🔍 Checking current billing status...${NC}"
if gcloud billing projects describe $CURRENT_PROJECT &>/dev/null; then
    BILLING_ACCOUNT=$(gcloud billing projects describe $CURRENT_PROJECT --format="value(billingAccountName)")
    if [ ! -z "$BILLING_ACCOUNT" ]; then
        echo -e "${GREEN}✅ Billing already enabled for project${NC}"
        echo "Billing Account: $BILLING_ACCOUNT"
        exit 0
    fi
fi

echo -e "${YELLOW}⚠️  Billing not enabled for project${NC}"

# Ask user to select billing account
echo ""
echo "Please select a billing account to link to your project:"
echo ""

# Display billing accounts with numbers
BILLING_ARRAY=($BILLING_ACCOUNTS)
for i in "${!BILLING_ARRAY[@]}"; do
    BILLING_INFO=$(gcloud billing accounts describe ${BILLING_ARRAY[$i]} --format="value(displayName,open)")
    echo "$((i+1)). ${BILLING_ARRAY[$i]} - $BILLING_INFO"
done

echo ""
echo "Enter the number of the billing account to use:"
read -r selection

if [[ "$selection" =~ ^[0-9]+$ ]] && [ "$selection" -ge 1 ] && [ "$selection" -le "${#BILLING_ARRAY[@]}" ]; then
    SELECTED_BILLING=${BILLING_ARRAY[$((selection-1))]}
    
    echo -e "${YELLOW}🔗 Linking billing account $SELECTED_BILLING to project $CURRENT_PROJECT...${NC}"
    
    # Link billing account to project
    gcloud billing projects link $CURRENT_PROJECT --billing-account=$SELECTED_BILLING
    
    echo -e "${GREEN}✅ Billing enabled successfully!${NC}"
    echo "Project: $CURRENT_PROJECT"
    echo "Billing Account: $SELECTED_BILLING"
    
    # Now enable the required APIs
    echo -e "${YELLOW}🔧 Enabling required APIs...${NC}"
    
    gcloud services enable cloudbuild.googleapis.com
    gcloud services enable run.googleapis.com
    gcloud services enable sqladmin.googleapis.com
    gcloud services enable compute.googleapis.com
    gcloud services enable storage.googleapis.com
    gcloud services enable secretmanager.googleapis.com
    gcloud services enable artifactregistry.googleapis.com
    gcloud services enable containerregistry.googleapis.com
    
    echo -e "${GREEN}✅ All required APIs enabled!${NC}"
    echo ""
    echo -e "${BLUE}🚀 Ready to deploy! Run:${NC}"
    echo "   ./deploy_to_google_cloud.sh"
    
else
    echo -e "${RED}❌ Invalid selection. Please run the script again.${NC}"
    exit 1
fi 