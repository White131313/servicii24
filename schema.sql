-- Run this in the Supabase SQL Editor

DROP TABLE IF EXISTS providers;

CREATE TABLE providers (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    category TEXT NOT NULL,
    description TEXT,
    availability_text TEXT,
    city TEXT,
    phone TEXT,
    whatsapp TEXT,
    language TEXT NOT NULL, -- 'ro' or 'hu'
    category_logo TEXT,
    price_estimate TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    service_area TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON providers FOR SELECT USING (true);

-- Index for faster search
CREATE INDEX idx_providers_language ON providers(language);
CREATE INDEX idx_providers_category ON providers(category);
CREATE INDEX idx_providers_city ON providers(city);
