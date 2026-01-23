import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'
import { normalize, COUNTY_MAPPINGS_RO, COUNTY_MAPPINGS_HU, CATEGORY_SLUG_MAP, CATEGORY_SLUG_MAP_RO, CATEGORY_SLUG_MAP_HU } from '@/lib/utils'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://servicii24.eu'

    // Fetch all unique cities from the database
    const { data: providers } = await supabase
        .from('providers')
        .select('city, language')

    const roCategorySlugs = new Set(Object.keys(CATEGORY_SLUG_MAP_RO))
    const huCategorySlugs = new Set(Object.keys(CATEGORY_SLUG_MAP_HU))

    const roCitySlugs = new Set<string>()
    const huCitySlugs = new Set<string>()

    const roCountySlugs = Object.keys(COUNTY_MAPPINGS_RO)
    const huCountySlugs = Object.keys(COUNTY_MAPPINGS_HU)

    const combinedSlugs = new Set<string>()

    providers?.forEach(p => {
        const citySlug = normalize(p.city)
        if (!citySlug) return;

        if (p.language === 'hu') {
            huCitySlugs.add(citySlug)
            // Only pair with HU categories
            Object.keys(CATEGORY_SLUG_MAP_HU).forEach(catSlug => {
                combinedSlugs.add(`${catSlug}-${citySlug}`)
            })
        } else {
            roCitySlugs.add(citySlug)
            // Only pair with RO categories
            Object.keys(CATEGORY_SLUG_MAP_RO).forEach(catSlug => {
                combinedSlugs.add(`${catSlug}-${citySlug}`)
            })
        }
    })

    // Add county-category combinations (isolated by language)
    Object.keys(CATEGORY_SLUG_MAP_RO).forEach(catSlug => {
        roCountySlugs.forEach(county => combinedSlugs.add(`${catSlug}-${county}`))
    })
    Object.keys(CATEGORY_SLUG_MAP_HU).forEach(catSlug => {
        huCountySlugs.forEach(county => combinedSlugs.add(`${catSlug}-${county}`))
    })

    const allSlugs = new Set([
        ...Array.from(roCategorySlugs),
        ...Array.from(huCategorySlugs),
        ...Array.from(roCitySlugs),
        ...Array.from(huCitySlugs),
        ...roCountySlugs,
        ...huCountySlugs,
        ...Array.from(combinedSlugs)
    ])

    const entries: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
    ]

    allSlugs.forEach(slug => {
        if (!slug) return;

        let priority = 0.6
        if (roCategorySlugs.has(slug) || huCategorySlugs.has(slug)) priority = 0.8
        if (roCitySlugs.has(slug) || huCitySlugs.has(slug) || roCountySlugs.includes(slug) || huCountySlugs.includes(slug)) priority = 0.7

        entries.push({
            url: `${baseUrl}/${slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: priority,
        })
    })

    return entries
}
