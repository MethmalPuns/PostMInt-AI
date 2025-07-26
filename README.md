# PostMint AI - MVP

An AI-powered marketing post generator for X platform (formerly Twitter). Generate engaging, on-brand posts for your business in seconds.

## Features

- 🤖 **AI-Powered Generation**: Uses DeepSeek API via OpenRouter to generate 35 posts at once
- 👤 **User Authentication**: Email/password authentication with Supabase
- 💰 **Freemium Model**: 5 free posts + 1 free input per month for registered users
- 🛒 **Add-on Purchases**: LemonSqueezy integration for purchasing additional posts/inputs
- 📊 **Quota Management**: Smart caching and quota tracking
- 💬 **User Testimonials**: Built-in testimonial collection system
- 🔒 **API Rate Limiting**: 100 API calls per day limit
- 📱 **Responsive Design**: Modern, mobile-friendly interface

## Pricing Structure

- **Free Tier**: 5 posts + 1 input/month (requires signup)
- **Add-on 1**: $5 for 10 additional posts
- **Add-on 2**: $5 for 1 additional input + 5 posts
- **Limitations**: Max 3 add-ons per input, 100 API calls/day

## Tech Stack

- **Frontend**: Vanilla HTML/CSS/JavaScript with Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Authentication**: Supabase Auth
- **Payments**: LemonSqueezy
- **AI**: DeepSeek via OpenRouter
- **Hosting**: Can be deployed anywhere (Vercel, Netlify, etc.)

## Setup Instructions

### 1. Environment Variables

Create a `.env` file or set the following environment variables in your hosting platform:

```env
# Supabase
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenRouter (for DeepSeek API)
OPENROUTER_API_KEY=your_openrouter_api_key

# LemonSqueezy
LEMON_SQUEEZY_SECRET=your_lemon_squeezy_webhook_secret
```

### 2. Supabase Setup

1. Create a new Supabase project
2. Run the migration file in the SQL editor:
   ```sql
   -- Copy content from supabase/migrations/20240101000000_initial_schema.sql
   ```
3. Set up environment variables in Supabase Edge Functions:
   - `APP_SUPABASE_URL`
   - `APP_SUPABASE_KEY`
   - `OPENROUTER_API_KEY`
   - `LEMON_SQUEEZY_SECRET`

### 3. OpenRouter Setup

1. Sign up at [OpenRouter](https://openrouter.ai/)
2. Get API key and add credits
3. The app uses `deepseek-ai/deepseek-llm-67b-chat` model

### 4. LemonSqueezy Setup

1. Create LemonSqueezy account and products:
   - **Product 1**: "10 Additional Posts" - $5
   - **Product 2**: "New Input + 5 Posts" - $5
2. Set up webhooks pointing to your Supabase function:
   ```
   https://your-project.supabase.co/functions/v1/handle-purchase
   ```
3. Update the LemonSqueezy product IDs in `app.html`

### 5. Frontend Configuration

Update the following in `app.html`:

```javascript
// Supabase configuration
const supabase = supabase.createClient(
    'YOUR_SUPABASE_URL',
    'YOUR_SUPABASE_ANON_KEY'
);

// LemonSqueezy product URLs
const addon1Url = 'https://your-store.lemonsqueezy.com/checkout/your-product-1';
const addon2Url = 'https://your-store.lemonsqueezy.com/checkout/your-product-2';
```

### 6. Deploy

1. Deploy the Supabase Edge Functions:
   ```bash
   supabase functions deploy generate-posts
   supabase functions deploy handle-purchase
   ```

2. Deploy the frontend to your preferred platform (Vercel, Netlify, etc.)

## File Structure

```
├── app.html                          # Main application file
├── favicon.ico                       # Favicon
├── README.md                         # This file
├── supabase/
│   ├── config.toml                   # Supabase configuration
│   ├── migrations/
│   │   └── 20240101000000_initial_schema.sql
│   └── functions/
│       ├── generate-posts/
│       │   └── index.ts              # Post generation API
│       └── handle-purchase/
│           └── index.ts              # LemonSqueezy webhook handler
```

## API Endpoints

### POST `/functions/v1/generate-posts`
Generates 35 marketing posts using AI.

**Headers:**
- `Authorization: Bearer <user_jwt_token>`

**Body:**
```json
{
    "description": "Business description (max 600 chars)",
    "tone": "professional|casual|friendly|authoritative",
    "audience": "business_owners|developers|marketers|general"
}
```

### POST `/functions/v1/handle-purchase`
Webhook endpoint for LemonSqueezy purchase processing.

## Database Schema

### user_quotas
- `user_id`: UUID (FK to auth.users)
- `remaining_posts`: Integer (default: 5)
- `remaining_submits`: Integer (default: 1)
- `purchased_posts`: Integer (default: 0)
- `purchased_submits`: Integer (default: 0)
- `cached_posts`: JSONB array
- `api_calls_today`: Integer
- `last_api_call_date`: Date

### purchases
- `user_id`: UUID (FK to auth.users)
- `product_id`: Text
- `order_id`: Text (unique)
- `addon_type`: Text ('more_posts' | 'new_input')
- `amount`: Decimal
- `status`: Text

### testimonials
- `user_id`: UUID (FK to auth.users)
- `name`: Text
- `role`: Text
- `text`: Text
- `status`: Text ('pending' | 'approved' | 'rejected')

## Features Implementation

### Quota Management
- Free users get 5 posts + 1 input per month
- Quotas reset monthly via `reset_monthly_quotas()` function
- Add-ons are tracked separately and don't reset

### Post Caching
- API generates 35 posts at once, stores in `cached_posts`
- Users can buy up to 3 add-ons per input (30 posts max)
- Efficient post delivery from cache

### API Rate Limiting
- 100 calls per day limit enforced
- Prevents new input purchases when limit reached
- Resets daily

### Payment Processing
- LemonSqueezy webhooks automatically update user quotas
- Secure signature verification
- Purchase history tracking

## Maintenance

### Monthly Quota Reset
Set up a cron job to call the `reset_monthly_quotas()` function monthly:

```sql
SELECT reset_monthly_quotas();
```

### Monitoring
- Monitor API usage in OpenRouter dashboard
- Track purchases in LemonSqueezy dashboard
- Monitor database usage in Supabase

## Security Features

- Row Level Security (RLS) enabled
- JWT-based authentication
- Webhook signature verification
- Input validation and sanitization
- Rate limiting protection

## Support

For issues or questions:
1. Check the Supabase logs for backend errors
2. Monitor OpenRouter usage and limits
3. Verify LemonSqueezy webhook deliveries
4. Check browser console for frontend errors