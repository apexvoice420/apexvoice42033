#!/bin/bash

echo "🚀 Starting Hybrid Deployment: Railway (Backend) + Vercel (Frontend)"

# 1. Backend (Railway)
echo "--------------------------------------------------"
echo "📦 Step 1: Deploying Backend to Railway..."
echo "--------------------------------------------------"
echo "NOTE: Ensure your Railway Service Root Directory is set to /server"
# Railway CLI usage placeholder - usually done via git push
# railway up --service apex-voice-backend
echo "👉 Please check your Railway dashboard for deployment status via Git Push."

# 2. Frontend (Vercel)
echo "--------------------------------------------------"
echo "🌐 Step 2: Deploying Frontend to Vercel..."
echo "--------------------------------------------------"
npx vercel --prod

echo "--------------------------------------------------"
echo "✅ Deployment Triggered!"
echo "--------------------------------------------------"
