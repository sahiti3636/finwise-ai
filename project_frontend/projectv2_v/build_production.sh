#!/bin/bash

# 🚀 FinWise Frontend - Production Build Script

echo "🏗️  Building FinWise Frontend for Production..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the frontend directory."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist

# Build for production
echo "🔨 Building production bundle..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Production files are in the 'dist' directory"
    echo ""
    echo "🚀 To deploy:"
    echo "   1. Copy the 'dist' folder to your web server"
    echo "   2. Configure your web server to serve from 'dist'"
    echo "   3. Set up proper routing for SPA (all routes should serve index.html)"
    echo ""
    echo "🌐 For Nginx, add this location block:"
    echo "   location / {"
    echo "       try_files \$uri \$uri/ /index.html;"
    echo "   }"
else
    echo "❌ Build failed!"
    exit 1
fi 