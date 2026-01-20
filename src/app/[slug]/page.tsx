import { DynamicPageWrapper } from "@/components/DynamicPageWrapper"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { slugify, COUNTY_MAPPINGS } from "@/lib/utils"

export async function generateStaticParams() {
    const { data: providers } = await supabase
        .from('providers')
        .select('category, city')

    if (!providers) return []

    const categorySlugs = new Set<string>()
    const citySlugs = new Set<string>()
    const countySlugs = new Set<string>(Object.keys(COUNTY_MAPPINGS))
    const combinedSlugs = new Set<string>()

    providers.forEach(p => {
        const catSlug = slugify(p.category)
        const citySlug = slugify(p.city)
        if (catSlug) categorySlugs.add(catSlug)
        if (citySlug) citySlugs.add(citySlug)

        // Add combination for city
        if (catSlug && citySlug) combinedSlugs.add(`${catSlug}-${citySlug}`)

        // Add combinations for counties
        countySlugs.forEach(county => {
            if (catSlug) combinedSlugs.add(`${catSlug}-${county}`)
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

    const categories = Array.from(new Set(providers.map(p => p.category)))
    const cities = Array.from(new Set(providers.map(p => p.city)))
    const counties = Object.keys(COUNTY_MAPPINGS)

    // 1. Check if it's a category
    const matchedCategory = categories.find(c => slugify(c) === slug)
    if (matchedCategory) {
        return { category: matchedCategory }
    }

    // 2. Check if it's a city or county
    const matchedCity = cities.find(c => slugify(c) === slug)
    if (matchedCity) {
        return { city: matchedCity }
    }
    const matchedCounty = counties.find(c => c === slug)
    if (matchedCounty) {
        return { city: matchedCounty, isCounty: true }
    }

    // 3. Check if it's a category-city or category-county combination
    const sortedCategories = [...categories].sort((a, b) => slugify(b).length - slugify(a).length)

    for (const cat of sortedCategories) {
        const catSlug = slugify(cat)
        if (slug.startsWith(catSlug + '-')) {
            const potentialLocSlug = slug.slice(catSlug.length + 1)

            // Try city match
            const matchedCityForCat = cities.find(c => slugify(c) === potentialLocSlug)
            if (matchedCityForCat) {
                return { category: cat, city: matchedCityForCat }
            }

            // Try county match
            const matchedCountyForCat = counties.find(c => c === potentialLocSlug)
            if (matchedCountyForCat) {
                return { category: cat, city: matchedCountyForCat, isCounty: true }
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
    if (!data) return { title: 'Nu a fost găsit | Servicii24' }

    const isCounty = data.isCounty;
    const locName = data.city || ''
    const capitalizedLoc = locName.charAt(0).toUpperCase() + locName.slice(1)
    const locWithContext = isCounty ? `Județul ${capitalizedLoc}` : capitalizedLoc

    if (data.category && data.city) {
        return {
            title: `${data.category} în ${locWithContext} - Servicii Profesionale | Servicii24`,
            description: `Găsește cei mai buni specialiști în ${data.category} din ${locWithContext}. Servicii verificate și contact direct pe Servicii24.eu.`,
            alternates: {
                canonical: `https://servicii24.eu/${slug}`,
            }
        }
    } else if (data.category) {
        return {
            title: `${data.category} - Servicii Profesionale | Servicii24`,
            description: `Găsește specialiști în ${data.category}. Servicii verificate, contact direct și disponibilitate imediată pe Servicii24.eu.`,
            alternates: {
                canonical: `https://servicii24.eu/${slug}`,
            }
        }
    } else if (data.city) {
        return {
            title: `Servicii Profesionale în ${locWithContext} | Servicii24`,
            description: `Descoperă toți meșterii și profesioniștii din ${locWithContext}. Servicii de calitate, verificate, la un click distanță.`,
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
        "name": data.category && data.city ? `${data.category} în ${data.city}` : data.category || data.city,
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
            <DynamicPageWrapper initialCategory={data.category} initialCity={data.city} />
        </>
    )
}
