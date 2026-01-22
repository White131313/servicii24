
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
// This avoids hitting API limits and ensures accuracy for key cities
const CITY_COORDS: Record<string, { lat: number, lng: number }> = {
    'miercurea ciuc': { lat: 46.3603, lng: 25.8019 },
    'gheorgheni': { lat: 46.7229, lng: 25.5975 },
    'odorheiu secuiesc': { lat: 46.3039, lng: 25.2960 },
    'toplita': { lat: 46.9248, lng: 25.3533 },
    'cristuru secuiesc': { lat: 46.2905, lng: 25.0347 },
    'vlahita': { lat: 46.3486, lng: 25.5297 },
    'balan': { lat: 46.6500, lng: 25.8167 },
    'borsec': { lat: 46.9740, lng: 25.5714 },
    'cluj-napoca': { lat: 46.7712, lng: 23.6236 },
    'bucuresti': { lat: 44.4268, lng: 26.1025 },
    'brasov': { lat: 45.6427, lng: 25.5887 },
    'sibiu': { lat: 45.7983, lng: 24.1256 },
    'targu mures': { lat: 46.5456, lng: 24.5625 },
    'sfantu gheorghe': { lat: 45.8717, lng: 25.7876 }
}

async function getCoordsForCity(city: string): Promise<{ lat: number, lng: number } | null> {
    const normalized = city.toLowerCase().trim()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents

    // Check hardcoded list first
    if (CITY_COORDS[normalized]) {
        console.log(`[CACHE] Found ${city} ->`, CITY_COORDS[normalized])
        return CITY_COORDS[normalized]
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
