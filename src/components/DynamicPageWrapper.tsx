"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/Header"
import { ServiceListing } from "@/components/ServiceListing"
import { Language } from "@/types"

interface DynamicPageWrapperProps {
    initialCategory?: string;
    initialCity?: string;
}

export function DynamicPageWrapper({ initialCategory, initialCity }: DynamicPageWrapperProps) {
    const [lang, setLang] = useState<Language>('ro')

    // Language detection
    useEffect(() => {
        const browserLang = navigator.language.toLowerCase()
        if (browserLang.startsWith('hu')) {
            setLang('hu')
        }
    }, [])

    return (
        <div className="min-h-screen bg-background">
            <Header lang={lang} setLang={setLang} />
            <ServiceListing
                initialCategory={initialCategory}
                initialCity={initialCity}
                lang={lang}
            />
        </div>
    )
}
