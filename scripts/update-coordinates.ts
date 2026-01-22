
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('Missing env vars')
    process.exit(1)
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Mapping of known cities to coordinates (Manual fallback + common ones)
// This avoids// Mapping of known cities to coordinates (Manual fallback + common ones)
const CITY_COORDS: Record<string, { lat: number, lng: number }> = {
    'miercurea ciuc': { lat: 46.3603, lng: 25.8019 },
    'miercureaciuc': { lat: 46.3603, lng: 25.8019 },
    'csíkszereda': { lat: 46.3603, lng: 25.8019 },
    'gheorgheni': { lat: 46.7229, lng: 25.5975 },
    'gyergyószentmiklós': { lat: 46.7229, lng: 25.5975 },
    'odorheiu secuiesc': { lat: 46.3039, lng: 25.2960 },
    'székelyudvarhely': { lat: 46.3039, lng: 25.2960 },
    'toplita': { lat: 46.9213, lng: 25.3537 },
    'toplița': { lat: 46.9213, lng: 25.3537 },
    'bălan': { lat: 46.6500, lng: 25.8000 },
    'borsec': { lat: 46.9167, lng: 25.5667 },
    'cristuru secuiesc': { lat: 46.2833, lng: 25.0333 },
    'vlahita': { lat: 46.3500, lng: 25.5167 },
    'cluj-napoca': { lat: 46.7712, lng: 23.6236 },
    'cluj napoca': { lat: 46.7712, lng: 23.6236 },
    'cluj': { lat: 46.7712, lng: 23.6236 },
    'bucuresti': { lat: 44.4268, lng: 26.1025 },
    'bucurești': { lat: 44.4268, lng: 26.1025 },
    'brasov': { lat: 45.6427, lng: 25.5887 },
    'brașov': { lat: 45.6427, lng: 25.5887 },
    'brassó': { lat: 45.6427, lng: 25.5887 },
    'targu mures': { lat: 46.5456, lng: 24.5625 },
    'târgu mureș': { lat: 46.5456, lng: 24.5625 },
    'marosvásárhely': { lat: 46.5456, lng: 24.5625 },
    'sfantu gheorghe': { lat: 45.8700, lng: 25.7900 },
    'sfântu gheorghe': { lat: 45.8700, lng: 25.7900 },
    'sepsiszentgyörgy': { lat: 45.8700, lng: 25.7900 },
    'miercurea nirajului': { lat: 46.5333, lng: 24.7167 },
    'nyárádszereda': { lat: 46.5333, lng: 24.7167 }
};

async function getCoordsForCity(city: string): Promise<{ lat: number, lng: number } | null> {
    if (!city) return null;

    const normalizedCity = city.toLowerCase().trim()
        .replace(/ă/g, 'a').replace(/â/g, 'a') // Basic normalization
        .replace(/ș/g, 's').replace(/ț/g, 't')
        .replace(/\./g, '')

    // 1. Try EXACT match
    if (CITY_COORDS[city.toLowerCase().trim()]) {
        console.log(`[CACHE] Found ${city} ->`, CITY_COORDS[city.toLowerCase().trim()]);
        return CITY_COORDS[city.toLowerCase().trim()];
    }

    // 2. Try Normalized match
    for (const [key, val] of Object.entries(CITY_COORDS)) {
        if (normalizedCity.includes(key) || key.includes(normalizedCity)) {
            console.log(`[CACHE (fuzzy)] Found ${city} (matched ${key}) ->`, val);
            return val;
        }
    }

    try {
        console.log(`[API] Fetching ${city}...`)
        const res = await fetch(`https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(normalized)}&country=Romania&format=json&limit=1`, {
            headers: {
                'User-Agent': 'Servicii24-Updater/1.0'
            }
        })
        const data = await res.json()
        if (data && data[0]) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon)
            }
        }
    } catch (e) {
        console.error(`Error fetching ${city}:`, e)
    }
    return null
}

async function main() {
    console.log('Starting coordinates update...')

    // 1. Fetch all providers
    const { data: providers, error } = await supabase
        .from('providers')
        .select('id, name, city, latitude, longitude')

    if (error) {
        console.error('Error fetching providers:', error)
        return
    }

    console.log(`Found ${providers.length} providers.`)

    let updated = 0
    let skipped = 0
    let failed = 0

    const uniqueCities = new Set(providers.map(p => p.city).filter(Boolean))
    console.log(`Unique cities to process: ${uniqueCities.size}`)

    // 2. Iterate and update
    for (const provider of providers) {
        if (!provider.city) {
            skipped++
            continue
        }

        // Only update if coords are missing
        if (provider.latitude && provider.longitude) {
            skipped++
            continue
        }

        const coords = await getCoordsForCity(provider.city)
        if (coords) {
            const { error: updateError } = await supabase
                .from('providers')
                .update({
                    latitude: coords.lat,
                    longitude: coords.lng
                })
                .eq('id', provider.id)

            if (updateError) {
                console.error(`Failed update for ${provider.name}:`, updateError)
                failed++
            } else {
                console.log(`✅ Updated ${provider.name} (${provider.city})`)
                updated++
            }

            // Be nice to the free API
            await new Promise(r => setTimeout(r, 1000))
        } else {
            console.warn(`❌ Could not find coords for: ${provider.city}`)
            failed++
        }
    }

    console.log(`\nDONE! Updated: ${updated}, Skipped: ${skipped}, Failed: ${failed}`)
}

main()
