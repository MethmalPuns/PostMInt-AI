# PostMint AI - Quick Start Guide

Get your PostMint AI MVP up and running in 15 minutes!

## Prerequisites

- Node.js 16+ installed
- A Supabase account
- An OpenRouter account (for DeepSeek API)
- A LemonSqueezy account

## 🚀 Step-by-Step Setup

### 1. Clone & Setup
```bash
# If you haven't already, download the project files
# Navigate to project directory
cd postmint-ai

# Install Supabase CLI globally
npm install -g supabase
```

### 2. Supabase Setup (5 minutes)

1. **Create a new Supabase project** at [https://app.supabase.com](https://app.supabase.com)

2. **Get your project credentials:**
   - Go to Settings → API
   - Copy your Project URL and anon public key

3. **Run the database migration:**
   - Go to SQL Editor in Supabase dashboard
   - Copy and run the entire content from `supabase/migrations/20240101000000_initial_schema.sql`

4. **Set up Edge Function environment variables:**
   - Go to Settings → Edge Functions
   - Add these secrets:
     ```
     APP_SUPABASE_URL: your_project_url
     APP_SUPABASE_KEY: your_service_role_key (from API settings)
     OPENROUTER_API_KEY: (get from step 3)
     LEMON_SQUEEZY_SECRET: (get from step 4)
     ```

### 3. OpenRouter Setup (2 minutes)

1. **Sign up at [OpenRouter](https://openrouter.ai/)**
2. **Add credits** to your account ($5-10 recommended for testing)
3. **Get your API key** from the Keys section
4. **Add it to Supabase** Edge Functions environment variables

### 4. LemonSqueezy Setup (5 minutes)

1. **Create LemonSqueezy account** at [https://lemonsqueezy.com](https://lemonsqueezy.com)

2. **Create two products:**
   - **Product 1**: "10 Additional Posts" - $5
   - **Product 2**: "New Input + 5 Posts" - $5

3. **Set up webhook:**
   - Go to Settings → Webhooks
   - Add webhook URL: `https://your-supabase-project.functions.supabase.co/handle-purchase`
   - Select "Order Created" event
   - Copy the webhook secret

4. **Get checkout URLs** for both products

### 5. Configure Frontend (2 minutes)

1. **Open `app.html`** in your editor

2. **Update Supabase configuration** (around line 653):
   ```javascript
   const supabaseUrl = 'https://your-project.supabase.co';
   const supabaseAnonKey = 'your_anon_key_here';
   ```

3. **Update LemonSqueezy URLs** (around line 1273):
   ```javascript
   const addon1Url = 'https://your-store.lemonsqueezy.com/checkout/buy/product-1?custom%5Buser_id%5D=';
   const addon2Url = 'https://your-store.lemonsqueezy.com/checkout/buy/product-2?custom%5Buser_id%5D=';
   ```

### 6. Deploy (1 minute)

```bash
# Deploy Supabase functions
./deploy.sh

# Test locally
npm run serve
# Open http://localhost:8000
```

### 7. Production Deploy

Deploy `app.html` to any static hosting:

**Vercel:**
```bash
npm i -g vercel
vercel
```

**Netlify:**
- Drag and drop the `app.html` file to Netlify

**GitHub Pages:**
- Push to GitHub and enable Pages

## ✅ Testing Your Setup

1. **Sign up** with a test email
2. **Generate posts** with a business description
3. **Try purchasing** an addon (use test mode in LemonSqueezy)
4. **Submit a testimonial**

## 🔧 Common Issues

### "Supabase client error"
- Check if you've updated the URL and key in `app.html`
- Verify your Supabase project is active

### "API call failed"
- Check OpenRouter credits and API key
- Verify the key is set in Supabase Edge Functions

### "Purchase not processing"
- Check webhook URL in LemonSqueezy
- Verify webhook secret in Supabase environment
- Check LemonSqueezy webhook logs

### "Database errors"
- Ensure you've run the migration SQL
- Check if RLS policies are active

## 📊 Monitoring

- **Supabase**: Monitor database usage and function logs
- **OpenRouter**: Track API usage and costs
- **LemonSqueezy**: Monitor sales and webhook deliveries

## 🎯 Next Steps

1. **Customize the design** to match your brand
2. **Add your own testimonials**
3. **Set up domain** and SSL
4. **Configure email templates** in Supabase Auth
5. **Set up monitoring** and analytics
6. **Schedule monthly quota reset** (cron job)

## 💡 Pro Tips

- Start with $10 in OpenRouter credits for testing
- Use LemonSqueezy test mode during development
- Monitor your API usage closely in the first week
- Set up email notifications for failed webhooks

## 🆘 Need Help?

- Check Supabase function logs for backend errors
- Use browser dev tools to debug frontend issues
- Verify webhook deliveries in LemonSqueezy dashboard
- Test API calls manually in OpenRouter playground

---

🎉 **Congratulations!** Your PostMint AI MVP is now live and ready to generate amazing marketing posts!