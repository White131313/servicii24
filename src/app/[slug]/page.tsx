import { DynamicPageWrapper } from "@/components/DynamicPageWrapper"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { normalize, COUNTY_MAPPINGS, COUNTY_MAPPINGS_HU, CATEGORY_SLUG_MAP, isHungarianCategory } from "@/lib/utils"

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
    const capitalizationLoc = locName.charAt(0).toUpperCase() + locName.slice(1)
    const fullLoc = isCounty
        ? (isHU ? `${capitalizationLoc} megye` : `Județul ${capitalizationLoc}`)
        : capitalizationLoc;

    const baseUrl = 'https://servicii24.eu';
    const canonical = `${baseUrl}/${slug}`;

    if (data.category && data.city) {
        const title = isHU
            ? `${data.category} ${fullLoc} - Sürgősségi Non-Stop 24/7 | Servicii24`
            : `${data.category} în ${fullLoc} - Urgențe Non-Stop 24/7 | Servicii24`;
        const description = isHU
            ? `Gyors ${data.category} segítség ${fullLoc} területén. Sürgősségi beavatkozások, ellenőrzött szakemberek és közvetlen kapcsolat 24/7. Hívja most!`
            : `Servicii rapide de ${data.category} în ${fullLoc}. Intervenții de urgență, meșteri verificați și contact direct 24/7. Sună acum!`;

        return {
            title,
            description,
            alternates: { canonical },
            openGraph: {
                title,
                description,
                url: canonical,
                siteName: 'Servicii24',
                locale: isHU ? 'hu_HU' : 'ro_RO',
                type: 'website',
            },
            twitter: {
                card: 'summary_large_image',
                title,
                description,
            }
        }
    } else if (data.category) {
        const title = isHU
            ? `${data.category} - Gyors Beavatkozás & Sürgősségek | Servicii24`
            : `${data.category} - Intervenție Rapidă & Urgențe | Servicii24`;
        const description = isHU
            ? `Profesionális ${data.category} szolgáltatások. Találjon ellenőrzött mestereket sürgősségi esetekre és azonnali javításokra a Servicii24-en.`
            : `Servicii profesionale de ${data.category}. Găsește specialiști verificați pentru urgențe și reparații imediate pe Servicii24.eu.`;

        return {
            title,
            description,
            alternates: { canonical },
            openGraph: {
                title,
                description,
                url: canonical,
                siteName: 'Servicii24',
                locale: isHU ? 'hu_HU' : 'ro_RO',
                type: 'website',
            }
        }
    } else if (data.city) {
        const title = isHU
            ? `Mesteremberek és Szolgáltatások ${fullLoc} - 24/7 Sürgősségek | Servicii24`
            : `Meseriași și Servicii Profesionale în ${fullLoc} - Urgențe 24/7 | Servicii24`;
        const description = isHU
            ? `Az összes professzionális szolgáltatás és mesterember ${fullLoc} területén. Sürgősségi javítások, Non-Stop elérhetőség és közvetlen kapcsolat.`
            : `Toate serviciile profesionale și meseriașii din ${fullLoc}. Urgențe, reparații Non-Stop și contact direct cu specialiști verificați.`;

        return {
            title,
            description,
            alternates: { canonical },
            openGraph: {
                title,
                description,
                url: canonical,
                siteName: 'Servicii24',
                locale: isHU ? 'hu_HU' : 'ro_RO',
                type: 'website',
            }
        }
    }

    return {
        title: 'Servicii24 - Găsește Meseriași și Servicii Profesionale',
        description: 'Cea mai rapidă platformă pentru a găsi specialiști și meseriași pentru urgențe 24/7.',
        alternates: { canonical: baseUrl }
    }
}

export default async function SlugPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params

    if (slug.includes('.') || slug === 'sitemap' || slug === 'robots' || slug === 'dashboard') {
        return notFound()
    }

    const data = await getRouteData(slug)
    if (!data) return notFound()

    const isHU = data.lang === 'hu';
    const locName = data.city || ''
    const capitalizationLoc = locName.charAt(0).toUpperCase() + locName.slice(1)
    const fullLoc = data.isCounty
        ? (isHU ? `${capitalizationLoc} megye` : `Județul ${capitalizationLoc}`)
        : capitalizationLoc;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": data.category || "Servicii Profesionale",
        "provider": {
            "@type": "Organization",
            "name": "Servicii24"
        },
        "description": data.category && data.city
            ? (isHU ? `${data.category} szolgáltatások ${fullLoc} területén.` : `Servicii de ${data.category} în ${fullLoc}.`)
            : (isHU ? `Professzionális szolgáltatások és mesteremberek.` : `Servicii profesionale și meseriași.`),
        "areaServed": data.city ? {
            "@type": "Place",
            "name": fullLoc
        } : undefined,
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": data.category || "Servicii",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": data.category || "Servicii Profesionale"
                    }
                }
            ]
        }
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
