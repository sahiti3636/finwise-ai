# 🔄 Switching Google Cloud Account to p.sahiti2006@gmail.com

## Quick Method (Automated)

Run the automated script:
```bash
./switch_google_account.sh
```

This script will:
- ✅ Switch authentication to p.sahiti.2006@gmail.com
- 🏗️ Create a new Google Cloud project
- 🔧 Enable all required APIs
- 📝 Update deployment scripts with new project ID

## Manual Method

### Step 1: Install Google Cloud SDK (if not already installed)
```bash
# macOS with Homebrew
brew install google-cloud-sdk

# Or download from: https://cloud.google.com/sdk/docs/install
```

### Step 2: Switch to New Account
```bash
# Revoke current authentication
gcloud auth revoke --all

# Login with new account
gcloud auth login p.sahiti2006@gmail.com

# Set up application default credentials
gcloud auth application-default login
```

### Step 3: Create New Project
```bash
# Create new project (will generate unique ID)
gcloud projects create finwise-ai-$(date +%s) --name="FinWise AI Financial Advisor"

# List projects to get the ID
gcloud projects list

# Set the new project as active
gcloud config set project YOUR_NEW_PROJECT_ID
```

### Step 4: Enable Required APIs
```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable compute.googleapis.com
gcloud services enable storage.googleapis.com
gcloud services enable secretmanager.googleapis.com
```

### Step 5: Update Deployment Scripts
```bash
# Replace old project ID in deployment script
sed -i.bak 's/PROJECT_NAME="finwise-ai"/PROJECT_NAME="YOUR_NEW_PROJECT_ID"/' deploy_to_google_cloud.sh

# Replace old project ID in documentation
sed -i.bak 's/finwise-ai/YOUR_NEW_PROJECT_ID/g' GOOGLE_CLOUD_DEPLOYMENT.md
```

## Verification

Check your current configuration:
```bash
# View current project
gcloud config get-value project

# View authenticated accounts
gcloud auth list

# View all configuration
gcloud config list
```

## Ready to Deploy!

After switching accounts, you can deploy using:
```bash
# Full automated deployment
./deploy_to_google_cloud.sh

# Or interactive deployment menu
./deploy_now.sh
```

## Troubleshooting

### Common Issues:

1. **"Permission denied" errors**
   - Make sure you're logged in with the correct account
   - Run: `gcloud auth login p.sahiti.2006@gmail.com`

2. **"Project not found" errors**
   - Verify project ID: `gcloud projects list`
   - Set correct project: `gcloud config set project PROJECT_ID`

3. **"API not enabled" errors**
   - Enable required APIs (see Step 4 above)

4. **Billing not enabled**
   - Go to Google Cloud Console
   - Enable billing for your new project

## Support

If you encounter issues:
1. Check Google Cloud Console: https://console.cloud.google.com
2. Verify billing is enabled for your project
3. Ensure you have the necessary permissions on the account 