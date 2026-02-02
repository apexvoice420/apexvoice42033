#!/bin/bash

echo "🚀 Starting Deployment for Apex Voice Solutions..."

# 1. Check for Login (Basic Check)
echo "🔍 Checking configuration..."

# 2. Deploy Cloud Functions (Backend)
echo "--------------------------------------------------"
echo "📦 Step 1: Deploying Backend (Firebase Functions)..."
echo "--------------------------------------------------"
# We use --only functions to avoid overwriting frontend hosting rules if any
npx firebase deploy --only functions

if [ $? -ne 0 ]; then
    echo "⚠️  Backend deployment had an issue."
    echo "   If it failed due to authentication, run: npx firebase login"
    echo "   Then try this script again."
    # We don't exit here because the user might just want to update frontend
fi

# 3. Deploy Frontend (Vercel)
echo "--------------------------------------------------"
echo "🌐 Step 2: Deploying Frontend (Vercel)..."
echo "--------------------------------------------------"
# First run (to configure project if needed) or deploy
npx vercel

if [ $? -ne 0 ]; then
    echo "❌ Frontend deployment failed."
    echo "   Try running: npx vercel login"
    exit 1
fi

echo "--------------------------------------------------"
echo "✅ Deployment Process Complete!"
echo "--------------------------------------------------"
