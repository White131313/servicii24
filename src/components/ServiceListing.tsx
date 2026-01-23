"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { Provider, Language } from "@/types"
import { supabase } from "@/lib/supabase"
import { Search, MapPin, Loader2, Clock, BadgeCheck, Wallet, Star, ChevronLeft, ChevronRight, RefreshCcw } from "lucide-react"
import { ProviderCard } from "./ProviderCard"
import { ProviderModal } from "./ProviderModal"
import { CITY_NAME_MAPPINGS, COUNTY_MAPPINGS } from "@/lib/utils"

interface ServiceListingProps {
    initialCategory?: string;
    initialCity?: string;
    lang: Language;
}

export function ServiceListing({ initialCategory, initialCity, lang }: ServiceListingProps) {
    const [providers, setProviders] = useState<Provider[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [search, setSearch] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory || null)
    const [detectedCity, setDetectedCity] = useState<string | null>(initialCity || null)
    const [isLocating, setIsLocating] = useState(false)
    const [showLocationPrompt, setShowLocationPrompt] = useState(!initialCity)
    const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)


    const t = {
        ro: {
            heroTitle: "Găsește rapid un specialist în orașul tău.",
            heroSub: "Fără anunțuri. Fără probleme. Contact direct.",
            searchPlac: "Caută un serviciu sau oraș...",
            locationAllow: "Permite",
            locationDeny: "Nu, mersi",
            locationTitle: "Locația ta",
            locationDesc: "Găsește meșteri din orașul tău.",
            locationFound: "Meseriași în zona",
            clear: "Șterge",
            results: "rezultate",
            noResults: "Niciun rezultat găsit",
            retry: "Reîncearcă",
            whyChooseUs: "De ce noi?",
            availabilityTitle: "Disponibilitate 24/7",
            availabilityDesc: "Suntem aici oricând ai nevoie de ajutor, la orice oră.",
            verifiedTitle: "Profesioniști Verificați",
            verifiedDesc: "Fiecare partener este verificat pentru calitate și seriozitate.",
            transparencyTitle: "Transparență Totală",
            transparencyDesc: "Vezi recenzii reale și prețuri corecte direct de la sursă.",
            testimonialsTitle: "Ce spun clienții noștri",
            t1: "Servicii de nota 10! Am găsit un instalator în 5 minute.",
            t2: "Foarte utilă platforma, am rezolvat rapid problema cu acoperișul.",
            t3: "Profesioniști adevărați. Recomand cu toată încrederea!",
            t4: "Cel mai bun mod de a găsi un meseriaș serios în orașul tău.",
            t5: "Rapid, sigur și eficient. Exact ce aveam nevoie.",
            name1: "Andrei M.",
            name2: "Elena P.",
            name3: "Ioan D.",
            name4: "Marius V.",
            name5: "Cristina S."
        },
        hu: {
            heroTitle: "Találjon szakembert gyorsan.",
            heroSub: "Hirdetések nélkül. Problémamentesen. Közvetlen kapcsolat.",
            searchPlac: "Keressen szolgáltatást vagy várost...",
            locationAllow: "Engedélyezés",
            locationDeny: "Nem, kösz",
            locationTitle: "Helymeghatározás",
            locationDesc: "Találjon mestereket a városában.",
            locationFound: "Szakemberek a környéken:",
            clear: "Törlés",
            results: "találat",
            noResults: "Nincs találat",
            retry: "Próbálja újra",
            whyChooseUs: "Miért mi?",
            availabilityTitle: "24/7 Elérhetőség",
            availabilityDesc: "Bármikor itt vagyunk, amikor segítségre van szüksége.",
            verifiedTitle: "Ellenőrzött Szakemberek",
            verifiedDesc: "Minden partnert ellenőrizünk a minőség és a megbízhatóság érdekében.",
            transparencyTitle: "Teljes Átláthatóság",
            transparencyDesc: "Valós vélemények és korrekt árak közvetlenül a forrástól.",
            testimonialsTitle: "Ügyfeleink mondták",
            t1: "10-es osztályzatú szolgáltatás! 5 perc alatt találtam vízvezeték-szerelőt.",
            t2: "Nagyon hasznos platform, gyorsan megoldottam a tetővel kapcsolatos problémát.",
            t3: "Igazi profik. Teljes bizalommal ajánlom!",
            t4: "A legjobb módszer egy komoly mester megtalálására az Ön városában.",
            t5: "Gyors, biztonságos és hatékony. Pontosan amire szükségem volt.",
            name1: "András M.",
            name2: "Ilona P.",
            name3: "János D.",
            name4: "Márió V.",
            name5: "Krisztina S."
        }
    }[lang]

    const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null)

    // Initial Fetch (Standard)
    useEffect(() => {
        const fetchProviders = async () => {
            setLoading(true)
            try {
                // If we have precise user coordinates, try Radius Search RPC
                if (userLocation) {
                    const { data, error: rpcError } = await supabase
                        .rpc('get_nearby_providers', {
                            user_lat: userLocation.lat,
                            user_lng: userLocation.lng,
                            radius_km: 50 // [CONFIG] Search radius in KM
                        })

                    // [FIX] If RPC worked but returned 0 results (e.g. user is in a remote village >50km away),
                    // FALLBACK to standard fetch so they don't see an empty screen.
                    if (!rpcError && data && data.length > 0) {
                        setProviders(data)
                        setLoading(false)
                        return // Exit if RPC found something
                    }
                    console.warn("RPC returned 0 results or failed, falling back to standard fetch.")
                }

                // Fallback (Standard Fetch)
                const { data, error: supabaseError } = await supabase
                    .from('providers')
                    .select('*')
                if (supabaseError) throw supabaseError
                setProviders(data || [])
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        // Debounce slightly to avoid rapid re-fetches if location updates quickly
        const timeoutId = setTimeout(() => {
            fetchProviders()
        }, 100)

        return () => clearTimeout(timeoutId)
    }, [userLocation]) // Trigger re-fetch when location changes

    const categories = useMemo(() => {
        const langProviders = providers.filter(p => p.language === lang)
        const cats = Array.from(new Set(langProviders.map(p => p.category)))
        return cats.sort()
    }, [providers, lang])

    const filteredProviders = useMemo(() => {
        // Universal normalization function
        const normalize = (s: string) => s.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/-/g, ' ');

        // First filter by language
        let result = providers.filter(p => p.language === lang)

        if (selectedCategory) {
            const normalizedSelected = normalize(selectedCategory);
            result = result.filter(p => {
                const normalizedCat = normalize(p.category);
                return normalizedCat === normalizedSelected ||
                    normalizedCat.replace(/i$/, '') === normalizedSelected.replace(/i$/, '') ||
                    normalizedCat === normalizedSelected
            })
        }
        if (search) {
            const searchTerms = normalize(search).split(/\s+/).filter(t => t.length > 0)
            result = result.filter(p => {
                const content = normalize(`${p.name} ${p.category} ${p.city} ${p.description}`)
                return searchTerms.every(term => content.includes(term))
            })
        }

        // CITY FILTERING LOGIC UPDATE:
        // If we have `userLocation` (Radius Search is active), we SKIP text-based city filtering
        // because the DB has already filtered by distance!
        // We only apply text filtering if the user MANUALLY typed a city or if we fell back to text-based detection.
        if (detectedCity && !userLocation) {
            const searchCity = normalize(detectedCity)
            let variants = CITY_NAME_MAPPINGS[searchCity] || COUNTY_MAPPINGS[searchCity] || [searchCity]

            if (variants.length === 1 && variants[0] === searchCity) {
                Object.entries(CITY_NAME_MAPPINGS).forEach(([key, values]) => {
                    const normalizedValues = values.map(v => normalize(v))
                    if (normalizedValues.includes(searchCity)) {
                        variants = [...values, key]
                    }
                })
            }

            result = result.filter(p => {
                const pCity = normalize(p.city)
                return variants.some(v => pCity.includes(normalize(v)) || normalize(v).includes(pCity))
            })
        }
        return result
    }, [search, providers, selectedCategory, detectedCity, userLocation, lang])

    // ... (Scroll logic stays the same) ...
    const scrollRef = useRef<HTMLDivElement>(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(false)

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
            setCanScrollLeft(scrollLeft > 5)
            setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5)
        }
    }

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft } = scrollRef.current
            const amount = 200
            scrollRef.current.scrollTo({
                left: direction === 'left' ? scrollLeft - amount : scrollLeft + amount,
                behavior: 'smooth'
            })
        }
    }

    useEffect(() => {
        checkScroll()
        window.addEventListener('resize', checkScroll)
        return () => window.removeEventListener('resize', checkScroll)
    }, [categories])

    // Auto-detect location if permission is already granted OR restore from localStorage
    useEffect(() => {
        // [CRITICAL] Check if user MANUALLY cleared location - if so, show PROMPT but don't auto-locate
        const manuallyCleared = sessionStorage.getItem('servicii24_manual_clear') === 'true'
        if (manuallyCleared) {
            setShowLocationPrompt(true)
            return // EXIT EARLY - wait for user to click "Permite" again
        }

        const savedCity = localStorage.getItem('servicii24_city')
        const permGranted = localStorage.getItem('servicii24_permission') === 'granted'
        const permDenied = sessionStorage.getItem('servicii24_permission') === 'denied'

        if (savedCity) {
            setDetectedCity(savedCity)
            setShowLocationPrompt(false)
            // Try to recover coords if permission was granted previously to refine search
            if (permGranted) handleLocationRequest()
            return
        }

        if (permDenied) {
            setShowLocationPrompt(false)
            return
        }

        if (permGranted) {
            handleLocationRequest()
            return
        }

        if (!detectedCity && !initialCity && navigator.permissions && navigator.geolocation) {
            navigator.permissions.query({ name: 'geolocation' }).then((result) => {
                if (result.state === 'granted') {
                    handleLocationRequest()
                }
            })
        }
    }, [])

    const openProviderModal = (provider: Provider) => {
        setSelectedProvider(provider)
        setIsModalOpen(true)
    }

    const handleLocationRequest = async () => {
        localStorage.setItem('servicii24_permission', 'granted') // Save intent
        localStorage.removeItem('servicii24_manual_clear')
        sessionStorage.removeItem('servicii24_manual_clear') // Remove block flag since user clicked "Allow"
        setIsLocating(true)
        setShowLocationPrompt(false)
        if (!navigator.geolocation) {
            setIsLocating(false)
            return
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                const { latitude, longitude } = position.coords

                // [NEW] Store coordinates for Radius Search
                setUserLocation({ lat: latitude, lng: longitude })

                const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=${lang}`)
                const data = await response.json()
                const city = data.city || data.locality || data.principalSubdivision
                if (city) {
                    setDetectedCity(city)
                    localStorage.setItem('servicii24_city', city) // Save to storage
                }
            } catch (err) {
                console.error("Geocoding error:", err)
            } finally {
                setIsLocating(false)
            }
        }, (err) => {
            console.error("Geolocation error:", err)
            setIsLocating(false)
        }, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        })
    }

    const handleClearLocation = () => {
        // Force loading state for immediate feedback
        setLoading(true)

        // Clear ALL persistence
        localStorage.removeItem('servicii24_city')
        localStorage.removeItem('servicii24_permission')
        localStorage.removeItem('servicii24_coords')
        sessionStorage.setItem('servicii24_manual_clear', 'true') // [KEY] Set flag in SESSION to block auto-loop but allow prompt
        // Removed sessionStorage.clear() as it would clear our flag too!

        // HARD RELOAD to guarantee fresh state
        // This is the "Nuclear Option" to ensure mobile browsers don't cache the state
        window.location.reload()
    }

    return (
        <main className="container mx-auto px-4 py-4 sm:py-6">
            <div className="flex flex-col items-center text-center mb-8 sm:mb-12">
                <h1 className="text-4xl sm:text-6xl font-black mb-4 tracking-tight leading-[1.1]">
                    {selectedCategory && detectedCity
                        ? <span className="text-gradient">{lang === 'hu' ? `${selectedCategory} în ${detectedCity}`.replace(' în ', ' ') : `${selectedCategory} în ${detectedCity}`}</span>
                        : (lang === 'ro' ? (
                            <>
                                Ai o urgență?<br />
                                <span className="text-muted-foreground/40 font-bold block text-2xl sm:text-3xl mt-2">Găsește specialistul tău în 30 de secunde.</span>
                            </>
                        ) : (
                            <>
                                Sürgősségi segítségre van szüksége?<br />
                                <span className="text-muted-foreground/40 font-bold block text-2xl sm:text-3xl mt-2">Találja meg a szakembert 30 másodperc alatt.</span>
                            </>
                        ))}
                </h1>
            </div>

            <div className="mx-auto mb-8 sm:mb-16 relative">
                <div className="sticky top-20 sm:top-24 z-40 space-y-4 px-1">
                    {showLocationPrompt && !detectedCity && (
                        <div className="mx-auto bg-card border border-border/80 rounded-2xl p-3 sm:p-5 shadow-xl animate-in fade-in slide-in-from-top-4 duration-700 mb-6 flex items-center gap-4 sm:gap-6 max-w-2xl">
                            <div className="bg-blue-500/10 text-blue-600 p-2 sm:p-3 rounded-xl shrink-0">
                                <MapPin size={20} className="sm:size-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-sm sm:text-lg leading-tight">{t.locationTitle}</h3>
                                <p className="text-[11px] sm:text-sm text-muted-foreground leading-tight">{t.locationDesc}</p>
                            </div>
                            <div className="flex gap-2 shrink-0">
                                <button onClick={handleLocationRequest} disabled={isLocating} className="bg-blue-600 text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-sm font-bold shadow-md hover:bg-blue-700 active:scale-95 transition-all">
                                    {isLocating ? <Loader2 className="animate-spin size-4" /> : t.locationAllow}
                                </button>
                                <button onClick={() => {
                                    setShowLocationPrompt(false)
                                    sessionStorage.setItem('servicii24_permission', 'denied') // Save only for session
                                }} className="px-3 sm:px-5 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-sm font-bold hover:bg-muted transition-all border border-border">
                                    {t.locationDeny}
                                </button>
                            </div>
                        </div>
                    )}

                    {detectedCity && (
                        <div className="bg-green-500/10 text-green-600 dark:text-green-400 rounded-xl px-4 py-2 flex items-center justify-between gap-2 border border-green-500/20 mb-2 max-w-2xl mx-auto">
                            <div className="flex items-center gap-2 text-sm font-bold">
                                <MapPin size={16} />
                                <span>{t.locationFound} <span className="underline">{detectedCity}</span> <span className="opacity-60 font-normal text-xs ml-1">(rază 50km)</span></span>
                            </div>
                            <button onClick={handleClearLocation} className="text-xs uppercase font-black opacity-60 hover:opacity-100">[{t.clear}]</button>
                        </div>
                    )}

                    <div className="bg-card/80 backdrop-blur-md border border-border/50 shadow-xl rounded-2xl sm:rounded-3xl p-2 sm:p-3 transition-all max-w-4xl mx-auto">
                        <div className="relative flex items-center mb-1">
                            <div className="absolute left-3 sm:left-4 text-primary"><Search size={18} strokeWidth={2.5} /></div>
                            <input
                                type="text"
                                className="w-full pl-10 sm:pl-14 pr-4 py-3 sm:py-4 bg-transparent outline-none text-base sm:text-xl font-semibold placeholder:text-muted-foreground/30"
                                placeholder={t.searchPlac}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="mt-1 sm:mt-2 pt-2 border-t border-border/30 overflow-hidden relative">
                            {canScrollLeft && (
                                <button onClick={() => scroll('left')} className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-6 sm:h-8 sm:w-8 bg-card border border-border/50 shadow-xl rounded-full flex items-center justify-center text-primary z-20 hover:scale-110 active:scale-95 transition-all">
                                    <ChevronLeft size={16} className="sm:size-18" strokeWidth={3} />
                                </button>
                            )}
                            <div ref={scrollRef} onScroll={checkScroll} className="flex items-center gap-2 overflow-x-auto no-scrollbar px-1 mx-10 sm:mx-12 scroll-smooth">
                                <button onClick={() => setSelectedCategory(null)} className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${selectedCategory === null ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-muted/50 text-muted-foreground hover:bg-primary/10'}`}>
                                    {lang === 'ro' ? 'Toate' : 'Összes'}
                                </button>
                                {categories.map(cat => (
                                    <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-muted/50 text-muted-foreground hover:bg-primary/10'}`}>
                                        {cat}
                                    </button>
                                ))}
                            </div>
                            {canScrollRight && (
                                <button onClick={() => scroll('right')} className="absolute right-0 top-1/2 -translate-y-1/2 h-6 w-6 sm:h-8 sm:w-8 bg-card border border-border/50 shadow-xl rounded-full flex items-center justify-center text-primary z-20 hover:scale-110 active:scale-95 transition-all">
                                    <ChevronRight size={16} className="sm:size-18" strokeWidth={3} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Total Results Count - Small and subtle under search bar */}
            {!loading && filteredProviders.length >= 0 && ( // SHOW ALWAYS (including 'Toate')
                <div className="text-center mb-6 -mt-4 animate-in fade-in slide-in-from-top-2 duration-500 flex items-center justify-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-muted-foreground/60 uppercase tracking-widest">
                        {filteredProviders.length} {t.results}
                    </p>
                </div>
            )}

            {loading ? (
                <div className="grid gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="bg-card rounded-3xl p-6 border border-border/50 animate-pulse space-y-4">
                            <div className="flex gap-4"><div className="w-16 h-16 bg-muted rounded-2xl" /><div className="flex-1 space-y-2"><div className="h-4 bg-muted rounded w-3/4" /><div className="h-3 bg-muted rounded w-1/2" /></div></div>
                            <div className="space-y-2"><div className="h-3 bg-muted rounded w-full" /><div className="h-3 bg-muted rounded w-5/6" /></div>
                        </div>
                    ))}
                </div>
            ) : filteredProviders.length === 0 ? (
                <div className="text-center py-20">
                    <Search size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                    <p className="text-xl font-bold mb-4">{t.noResults}</p>
                    <button onClick={() => { setSearch(""); setSelectedCategory(null); }} className="bg-primary text-primary-foreground px-6 py-2 rounded-xl font-bold shadow-lg shadow-primary/20">{t.clear}</button>
                </div>
            ) : (search || selectedCategory || detectedCity) ? (
                /* Functional GRID layout for searching/filtering */
                <div className="grid gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto">
                    {filteredProviders.map((provider) => (
                        <div key={provider.id} className="transition-all duration-300 ease-in-out min-w-0 w-full">
                            <ProviderCard provider={provider} lang={lang} onOpen={() => openProviderModal(provider)} />
                        </div>
                    ))}
                </div>
            ) : (
                /* Smooth Marquee for default state */
                <div className="relative group overflow-hidden py-4 marquee-container">
                    <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
                    <div className={`marquee-content ${isModalOpen ? 'paused' : ''}`}>
                        {[...filteredProviders, ...filteredProviders].map((provider, idx) => (
                            <div key={`${provider.id}-${idx}`} className="w-[85vw] sm:w-[380px] shrink-0">
                                <ProviderCard provider={provider} lang={lang} onOpen={() => openProviderModal(provider)} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <section className="container mx-auto px-6 py-2 sm:py-12">
                <div className="text-center mb-6 sm:mb-10">
                    <h2 className="text-2xl sm:text-5xl font-bold tracking-tight mb-2 sm:mb-4">{t.whyChooseUs}</h2>
                    <div className="h-1 w-16 bg-primary/20 mx-auto rounded-full"></div>
                </div>
                <div className="grid gap-6 md:grid-cols-3 max-w-7xl mx-auto">
                    <div className="bg-card border border-border/50 p-5 sm:p-8 rounded-3xl shadow-sm hover:shadow-md transition-all text-center">
                        <Clock className="size-12 sm:size-16 text-blue-600 mx-auto mb-4 sm:mb-6" />
                        <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">{t.availabilityTitle}</h3>
                        <p className="text-sm sm:text-base text-muted-foreground">{t.availabilityDesc}</p>
                    </div>
                    <div className="bg-card border border-border/50 p-5 sm:p-8 rounded-3xl shadow-sm hover:shadow-md transition-all text-center">
                        <BadgeCheck className="size-12 sm:size-16 text-emerald-600 mx-auto mb-4 sm:mb-6" />
                        <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">{t.verifiedTitle}</h3>
                        <p className="text-sm sm:text-base text-muted-foreground">{t.verifiedDesc}</p>
                    </div>
                    <div className="bg-card border border-border/50 p-5 sm:p-8 rounded-3xl shadow-sm hover:shadow-md transition-all text-center">
                        <Wallet className="size-12 sm:size-16 text-purple-600 mx-auto mb-4 sm:mb-6" />
                        <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">{t.transparencyTitle}</h3>
                        <p className="text-sm sm:text-base text-muted-foreground">{t.transparencyDesc}</p>
                    </div>
                </div>
            </section>

            <section className="container mx-auto px-6 py-4 sm:py-12">
                <div className="text-center mb-6 sm:mb-8">
                    <h2 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4">{t.testimonialsTitle}</h2>
                    <div className="h-1 w-16 bg-primary/20 mx-auto rounded-full"></div>
                </div>
                <div className="relative group w-full">
                    {/* Changed from marquee-content to flex overflow-auto for manual scrolling */}
                    <div className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar pb-6 px-4">
                        {[1, 2, 3, 4, 5].map((idx) => (
                            <div key={idx} className="w-[85vw] sm:w-[380px] shrink-0 bg-card border border-border rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm snap-center">
                                <div className="flex items-center gap-1 mb-3 sm:mb-4 text-amber-400">
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} fill="currentColor" />)}
                                </div>
                                <div className="px-1">
                                    <p className="text-muted-foreground italic mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">"{(t as any)[`t${idx}`]}"</p>
                                    <p className="font-bold text-sm sm:text-base">{(t as any)[`name${idx}`]}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {isModalOpen && selectedProvider && (
                <ProviderModal provider={selectedProvider} lang={lang} onClose={() => setIsModalOpen(false)} />
            )}
        </main>
    )
}
