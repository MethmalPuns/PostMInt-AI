-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_quotas table
CREATE TABLE IF NOT EXISTS user_quotas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    remaining_posts INTEGER DEFAULT 5,
    remaining_submits INTEGER DEFAULT 1,
    purchased_posts INTEGER DEFAULT 0,
    purchased_submits INTEGER DEFAULT 0,
    cached_posts JSONB DEFAULT '[]'::jsonb,
    api_calls_today INTEGER DEFAULT 0,
    last_api_call_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id)
);

-- Create purchases table
CREATE TABLE IF NOT EXISTS purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    variant_id TEXT NOT NULL,
    order_id TEXT NOT NULL UNIQUE,
    addon_type TEXT NOT NULL CHECK (addon_type IN ('more_posts', 'new_input')),
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    text TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create function to automatically create user quota on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_quotas (user_id)
    VALUES (new.id);
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create function to increment user quota (for purchases)
CREATE OR REPLACE FUNCTION increment_user_quota(
    user_id UUID,
    column_name TEXT,
    value INTEGER
)
RETURNS INTEGER AS $$
DECLARE
    new_value INTEGER;
BEGIN
    IF column_name = 'purchased_posts' THEN
        UPDATE user_quotas 
        SET purchased_posts = purchased_posts + value,
            updated_at = NOW()
        WHERE user_quotas.user_id = $1
        RETURNING purchased_posts INTO new_value;
    ELSIF column_name = 'purchased_submits' THEN
        UPDATE user_quotas 
        SET purchased_submits = purchased_submits + value,
            updated_at = NOW()
        WHERE user_quotas.user_id = $1
        RETURNING purchased_submits INTO new_value;
    ELSE
        RAISE EXCEPTION 'Invalid column name: %', column_name;
    END IF;
    
    RETURN new_value;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to reset monthly quotas
CREATE OR REPLACE FUNCTION reset_monthly_quotas()
RETURNS void AS $$
BEGIN
    UPDATE user_quotas 
    SET remaining_posts = 5,
        remaining_submits = 1,
        updated_at = NOW()
    WHERE TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_user_quotas_updated_at BEFORE UPDATE ON user_quotas
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE user_quotas ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- User quotas policies
CREATE POLICY "Users can view own quota" ON user_quotas
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own quota" ON user_quotas
    FOR UPDATE USING (auth.uid() = user_id);

-- Purchases policies
CREATE POLICY "Users can view own purchases" ON purchases
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service can insert purchases" ON purchases
    FOR INSERT WITH CHECK (true);

-- Testimonials policies
CREATE POLICY "Users can view approved testimonials" ON testimonials
    FOR SELECT USING (status = 'approved');

CREATE POLICY "Users can insert own testimonials" ON testimonials
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own testimonials" ON testimonials
    FOR SELECT USING (auth.uid() = user_id);