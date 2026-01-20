"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function DashboardContent() {
    const searchParams = useSearchParams()
    const lang = searchParams.get("lang") === "hu" ? "hu" : "ro"

    const t = {
        ro: {
            title: "Dashboard Meseriași",
            desc: "Această secțiune este în curs de dezvoltare. În curând, vei putea să-ți gestionezi profilul și anunțurile direct de aici.",
            back: "Înapoi la prima pagină"
        },
        hu: {
            title: "Szakember Vezérlőpult",
            desc: "Ez a szekció fejlesztés alatt áll. Hamarosan innen kezelheti profilját és hirdetéseit.",
            back: "Vissza a főoldalra"
        }
    }[lang]

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <span className="text-4xl">🏗️</span>
            </div>
            <h1 className="text-4xl font-black mb-4">{t.title}</h1>
            <p className="text-xl text-muted-foreground max-w-md">
                {t.desc}
            </p>
            <a
                href={lang === 'hu' ? '/?lang=hu' : '/'}
                className="mt-8 px-8 py-3 bg-primary text-primary-foreground rounded-2xl font-bold hover:scale-105 transition-all shadow-lg"
            >
                {t.back}
            </a>
        </div>
    )
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>}>
            <DashboardContent />
        </Suspense>
    )
}
