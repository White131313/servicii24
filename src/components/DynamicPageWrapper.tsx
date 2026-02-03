"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/Header"
import { ServiceListing } from "@/components/ServiceListing"
import { Language } from "@/types"

interface DynamicPageWrapperProps {
    initialCategory?: string;
    initialCity?: string;
    initialLang?: Language;
}

export function DynamicPageWrapper({ initialCategory, initialCity, initialLang }: DynamicPageWrapperProps) {
    const [lang, setLang] = useState<Language>(initialLang || 'ro')

    // Initial language detection (only if no initialLang provided)
    useEffect(() => {
        if (initialLang) return;
        const browserLang = navigator.language.toLowerCase()
        if (browserLang.startsWith('hu')) {
            setLang('hu')
        }
    }, [initialLang])

    return (
        <div className="min-h-screen">
            <Header lang={lang} setLang={setLang} />
            <ServiceListing
                initialCategory={initialCategory}
                initialCity={initialCity}
                lang={lang}
            />
        </div>
    )
}
