#!/bin/bash

echo "🚀 PostMint AI Deployment Script"
echo "================================"

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first:"
    echo "npm install -g supabase"
    exit 1
fi

echo "✅ Supabase CLI found"

# Check if we're in a Supabase project
if [ ! -f "supabase/config.toml" ]; then
    echo "❌ Not in a Supabase project directory"
    echo "Please run 'supabase init' first or navigate to your project directory"
    exit 1
fi

echo "✅ Supabase project detected"

# Deploy Edge Functions
echo "📦 Deploying Edge Functions..."

echo "  → Deploying generate-posts function..."
supabase functions deploy generate-posts

if [ $? -eq 0 ]; then
    echo "  ✅ generate-posts deployed successfully"
else
    echo "  ❌ Failed to deploy generate-posts"
    exit 1
fi

echo "  → Deploying handle-purchase function..."
supabase functions deploy handle-purchase

if [ $? -eq 0 ]; then
    echo "  ✅ handle-purchase deployed successfully"
else
    echo "  ❌ Failed to deploy handle-purchase"
    exit 1
fi

echo ""
echo "🎉 Deployment Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Set up your environment variables in the Supabase dashboard:"
echo "   - APP_SUPABASE_URL"
echo "   - APP_SUPABASE_KEY"
echo "   - OPENROUTER_API_KEY"
echo "   - LEMON_SQUEEZY_SECRET"
echo ""
echo "2. Update the frontend configuration in app.html:"
echo "   - Replace YOUR_SUPABASE_URL with your actual URL"
echo "   - Replace YOUR_SUPABASE_ANON_KEY with your actual key"
echo "   - Update LemonSqueezy product URLs"
echo ""
echo "3. Run the database migration in Supabase SQL editor:"
echo "   - Copy content from supabase/migrations/20240101000000_initial_schema.sql"
echo ""
echo "4. Deploy your frontend to your preferred hosting platform"
echo ""
echo "🔗 Useful Links:"
echo "   - Supabase Dashboard: https://app.supabase.com"
echo "   - OpenRouter: https://openrouter.ai"
echo "   - LemonSqueezy: https://lemonsqueezy.com"