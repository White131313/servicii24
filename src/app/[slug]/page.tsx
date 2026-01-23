import { DynamicPageWrapper } from "@/components/DynamicPageWrapper"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { normalize, COUNTY_MAPPINGS, CATEGORY_SLUG_MAP } from "@/lib/utils"

export async function generateStaticParams() {
    const { data: providers } = await supabase
        .from('providers')
        .select('category, city')

    if (!providers) return []

    const categorySlugs = new Set<string>(Object.keys(CATEGORY_SLUG_MAP))
    const citySlugs = new Set<string>()
    const countySlugs = new Set<string>(Object.keys(COUNTY_MAPPINGS))
    const combinedSlugs = new Set<string>()

    providers.forEach(p => {
        const citySlug = normalize(p.city)
        if (citySlug) citySlugs.add(citySlug)

        // Add combinations for all category slug variants
        Object.keys(CATEGORY_SLUG_MAP).forEach(catSlug => {
            if (citySlug) combinedSlugs.add(`${catSlug}-${citySlug}`)
            countySlugs.forEach(county => {
                combinedSlugs.add(`${catSlug}-${county}`)
            })
        })
    })

    const allSlugs = [
        ...Array.from(categorySlugs),
        ...Array.from(citySlugs),
        ...Array.from(countySlugs),
        ...Array.from(combinedSlugs)
    ]

    return allSlugs.map((slug) => ({
        slug: slug,
    }))
}

async function getRouteData(slug: string) {
    const { data: providers } = await supabase
        .from('providers')
        .select('category, city')

    if (!providers) return null

    const cities = Array.from(new Set(providers.map(p => p.city)))
    const counties = Object.keys(COUNTY_MAPPINGS)

    // 1. Check if it's a category slug
    if (CATEGORY_SLUG_MAP[slug]) {
        const cat = CATEGORY_SLUG_MAP[slug];
        const isHU = isHungarianCategory(cat);
        return { category: cat, lang: isHU ? 'hu' : 'ro' }
    }

    // 2. Check if it's a city or county
    const matchedCity = cities.find(c => normalize(c) === slug)
    if (matchedCity) {
        // Find if city has more HU providers or RO providers (simple heuristic)
        // Or check COUNTY_MAPPINGS_HU
        const isHU = Object.keys(COUNTY_MAPPINGS_HU).includes(slug) ||
            ['brasso', 'csikszereda', 'sepsiszentgyorgy', 'kolozsvar', 'marosvasarhely'].includes(slug);
        return { city: matchedCity, lang: isHU ? 'hu' : 'ro' }
    }
    const matchedCounty = counties.find(c => c === slug)
    if (matchedCounty) {
        const isHU = Object.keys(COUNTY_MAPPINGS_HU).includes(slug);
        return { city: matchedCounty, isCounty: true, lang: isHU ? 'hu' : 'ro' }
    }

    // 3. Check if it's a category-location combination
    const sortedCatSlugs = Object.keys(CATEGORY_SLUG_MAP).sort((a, b) => b.length - a.length)

    for (const catSlug of sortedCatSlugs) {
        if (slug.startsWith(catSlug + '-')) {
            const potentialLocSlug = slug.slice(catSlug.length + 1)
            const actualCategory = CATEGORY_SLUG_MAP[catSlug]
            const isHU = isHungarianCategory(actualCategory);

            // Try city match
            const matchedCityForCat = cities.find(c => normalize(c) === potentialLocSlug)
            if (matchedCityForCat) {
                return { category: actualCategory, city: matchedCityForCat, lang: isHU ? 'hu' : 'ro' }
            }

            // Try county match
            const matchedCountyForCat = counties.find(c => c === potentialLocSlug)
            if (matchedCountyForCat) {
                return { category: actualCategory, city: matchedCountyForCat, isCounty: true, lang: isHU ? 'hu' : 'ro' }
            }
        }
    }

    return null
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params

    if (slug.includes('.') || slug === 'sitemap' || slug === 'robots' || slug === 'dashboard') {
        return {}
    }

    const data = await getRouteData(slug)
    if (!data) return { title: 'Servicii Profesionale | Servicii24' }

    const isHU = data.lang === 'hu';
    const isCounty = data.isCounty;
    const locName = data.city || ''
    const capitalizedLoc = locName.charAt(0).toUpperCase() + locName.slice(1)

    let locDisplay = capitalizedLoc;
    if (isCounty) {
        locDisplay = isHU ? `${capitalizedLoc} megye` : `Județul ${capitalizedLoc}`;
    }

    if (data.category && data.city) {
        return {
            title: isHU
                ? `${data.category} ${locDisplay} területén - Sürgősségi Non-Stop | Servicii24`
                : `${data.category} în ${locDisplay} - Urgențe Non-Stop | Servicii24`,
            description: isHU
                ? `Találjon gyorsan ${data.category} szakembert ${locDisplay} területén. Sürgősségi beavatkozások, ellenőrzött profik és közvetlen kapcsolat 24/7 a Servicii24.eu oldalon.`
                : `Găsește rapid un specialist în ${data.category} din ${locDisplay}. Intervenții de urgență, profesioniști autorizați și contact direct 24/7 pe Servicii24.eu.`,
            alternates: {
                canonical: `https://servicii24.eu/${slug}`,
            }
        }
    } else if (data.category) {
        return {
            title: isHU
                ? `${data.category} - Gyors Beavatkozás & Sürgősségek | Servicii24`
                : `${data.category} - Intervenție Rapidă & Urgențe | Servicii24`,
            description: isHU
                ? `${data.category} szakembert keres? Találjon ellenőrzött mestereket sürgősségi esetekre és professzionális szolgáltatásokra. Közvetlen kapcsolat a Servicii24.eu-n.`
                : `Ai nevoie de un ${data.category}? Găsește specialiști verificați pentru urgențe și servicii profesionale. Contact direct și disponibilitate imediată pe Servicii24.eu.`,
            alternates: {
                canonical: `https://servicii24.eu/${slug}`,
            }
        }
    } else if (data.city) {
        return {
            title: isHU
                ? `Professzionális szolgáltatások ${locDisplay} területén - 24/7 Sürgősségek | Servicii24`
                : `Servicii Profesionale în ${locDisplay} - Urgențe 24/7 | Servicii24`,
            description: isHU
                ? `Fedezze fel az összes szakembert ${locDisplay} területén. Sürgősségi javítások és minőségi szolgáltatások a Servicii24.eu oldalon.`
                : `Descoperă toți meșterii și profesioniștii din ${locDisplay}. Urgențe, reparații și servicii de calitate, verificate, disponibile imediat pe Servicii24.eu.`,
            alternates: {
                canonical: `https://servicii24.eu/${slug}`,
            }
        }
    }

    return {}
}

export default async function SlugPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params

    if (slug.includes('.') || slug === 'sitemap' || slug === 'robots' || slug === 'dashboard') {
        return notFound()
    }

    const data = await getRouteData(slug)
    if (!data) return notFound()

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": data.category && data.city ? `${data.category} - ${data.city}` : data.category || data.city,
        "description": data.category && data.city
            ? `Listă cu cei mai buni specialiști în ${data.category} din ${data.city}.`
            : `Servicii profesionale de ${data.category || data.city}.`,
        "url": `https://servicii24.eu/${slug}`
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <DynamicPageWrapper
                initialCategory={data.category}
                initialCity={data.city}
                initialLang={data.lang as any}
            />
        </>
    )
}
