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

-- [NEW] Coordinates for Radius Search
ALTER TABLE providers ADD COLUMN latitude DOUBLE PRECISION;
ALTER TABLE providers ADD COLUMN longitude DOUBLE PRECISION;

-- [NEW] RPC Function to find nearby providers (Haversine Formula)
-- Usage: supabase.rpc('get_nearby_providers', { user_lat: 46.0, user_lng: 25.0, radius_km: 50 })
CREATE OR REPLACE FUNCTION get_nearby_providers(
  user_lat DOUBLE PRECISION,
  user_lng DOUBLE PRECISION,
  radius_km DOUBLE PRECISION
)
RETURNS SETOF providers
LANGUAGE sql
AS $$
  SELECT *
  FROM providers
  WHERE
    (
      6371 * acos(
        least(1.0, greatest(-1.0, 
          cos(radians(user_lat)) * cos(radians(latitude)) *
          cos(radians(longitude) - radians(user_lng)) +
          sin(radians(user_lat)) * sin(radians(latitude))
        ))
      )
    ) <= radius_km;
$$;
