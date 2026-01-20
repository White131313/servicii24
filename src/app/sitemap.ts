import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'
import { slugify, COUNTY_MAPPINGS_RO, COUNTY_MAPPINGS_HU, isHungarianCategory } from '@/lib/utils'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://servicii24.eu'

    // Fetch all unique categories and cities from the database
    const { data: providers } = await supabase
        .from('providers')
        .select('category, city')

    const categorySlugs = new Set<string>()
    const citySlugs = new Set<string>()
    const roCountySlugs = Object.keys(COUNTY_MAPPINGS_RO)
    const huCountySlugs = Object.keys(COUNTY_MAPPINGS_HU)
    const combinedSlugs = new Set<string>()

    providers?.forEach(p => {
        const catSlug = slugify(p.category)
        const citySlug = slugify(p.city)
        if (catSlug) categorySlugs.add(catSlug)
        if (citySlug) citySlugs.add(citySlug)

        // Add combination for city (cities are often used in both, but we focus on counties for language separation)
        if (catSlug && citySlug) combinedSlugs.add(`${catSlug}-${citySlug}`)

        // Add combinations for counties based on category language
        const isHU = isHungarianCategory(p.category)
        const relevantCounties = isHU ? huCountySlugs : roCountySlugs

        relevantCounties.forEach(county => {
            if (catSlug) combinedSlugs.add(`${catSlug}-${county}`)
        })
    })

    // Legacy URLs from user's sitemap to ensure continuity
    const legacySlugs = [
        'acoperisuri', 'acoperisuri-brasov', 'acoperisuri-cluj', 'acoperisuri-covasna', 'acoperisuri-harghita', 'acoperisuri-mures',
        'allatorvos-hargita', 'allatorvos-maros', 'allatorvosok', 'allatorvosok-brasso', 'alte-servicii',
        'asistenta-rutiera', 'asistenta-rutiera-brasov', 'asistenta-rutiera-cluj', 'asistenta-rutiera-covasna', 'asistenta-rutiera-harghita', 'asistenta-rutiera-mures',
        'autokolcsonzes-brasso', 'autokolcsonzes-hargita', 'autokolcsonzes-marosvasarhely', 'autokolcsonzes-sepsiszentgyorgy',
        'automentes', 'automentes-brasso', 'automentes-hargita', 'automentes-kovaszna', 'automentes-maros',
        'brasov', 'brasso', 'cluj', 'harghita', 'hargita', 'mures', 'maros', 'covasna', 'kovaszna', 'sfantu-gheorghe', 'sepsiszentgyorgy',
        'electricieni', 'electricieni-brasov', 'electricieni-cluj', 'electricieni-harghita', 'electricieni-mures', 'electricieni-sfantu-gheorghe',
        'instalatori', 'instalatori-brasov', 'instalatori-cluj', 'instalatori-harghita', 'instalatori-targu-mures',
        'lacatusi', 'lacatusi-brasov', 'lacatusi-cluj', 'lacatusi-harghita', 'lacatusi-mures',
        'soferi-brasov', 'soferi-cluj', 'soferi-covasna', 'soferi-harghita', 'soferi-mures',
        'veterinari', 'veterinari-brasov', 'veterinari-cluj', 'veterinari-harghita', 'veterinari-mures',
        'vizvezetek-szerelok', 'vizvezetek-szerelok-brasso', 'vizvezetek-szerelok-hargita', 'vizvezetek-szerelok-maros'
    ]

    const allSlugs = new Set([
        ...legacySlugs,
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
