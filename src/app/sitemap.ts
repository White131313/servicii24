import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'
import { normalize, COUNTY_MAPPINGS_RO, COUNTY_MAPPINGS_HU, CATEGORY_SLUG_MAP } from '@/lib/utils'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://servicii24.eu'

    // Fetch all unique cities from the database
    const { data: providers } = await supabase
        .from('providers')
        .select('city')

    const categorySlugs = new Set(Object.keys(CATEGORY_SLUG_MAP))
    const citySlugs = new Set<string>()
    const roCountySlugs = Object.keys(COUNTY_MAPPINGS_RO)
    const huCountySlugs = Object.keys(COUNTY_MAPPINGS_HU)
    const combinedSlugs = new Set<string>()

    providers?.forEach(p => {
        const citySlug = normalize(p.city)
        if (citySlug) citySlugs.add(citySlug)

        // Add combinations for all category variants
        Object.keys(CATEGORY_SLUG_MAP).forEach(catSlug => {
            if (citySlug) combinedSlugs.add(`${catSlug}-${citySlug}`)
        })
    })

    // Add county-category combinations
    Object.keys(CATEGORY_SLUG_MAP).forEach(catSlug => {
        roCountySlugs.forEach(county => combinedSlugs.add(`${catSlug}-${county}`))
        huCountySlugs.forEach(county => combinedSlugs.add(`${catSlug}-${county}`))
    })

    const allSlugs = new Set([
        ...Array.from(categorySlugs),
        ...Array.from(citySlugs),
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
        if (categorySlugs.has(slug)) priority = 0.8
        if (citySlugs.has(slug) || roCountySlugs.includes(slug) || huCountySlugs.includes(slug)) priority = 0.7

        entries.push({
            url: `${baseUrl}/${slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: priority,
        })
    })

    return entries
}
