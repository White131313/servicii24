"use client"

import { useState } from "react"
import { Provider, Language } from "@/types"
import { getCategoryIcon } from "@/lib/icons"
import { Phone, MessageCircle, MapPin, CheckCircle2, Clock, X, ChevronRight } from "lucide-react"

export function ProviderCard({ provider, lang, onOpen }: { provider: Provider, lang: Language, onOpen: () => void }) {
    const Icon = getCategoryIcon(provider.category)

    const t = {
        ro: {
            more: "Vezi mai mult",
            call: "SUNĂ ACUM",
            whatsapp: "WHATSAPP",
            verified: "Verificat",
            location: "Locație",
            availability: "Disponibilitate",
            details: "Detalii complete",
            price: "Informații preț"
        },
        hu: {
            more: "Mutass többet",
            call: "HÍVÁS MOST",
            whatsapp: "WHATSAPP",
            verified: "Ellenőrzött",
            location: "Helyszín",
            availability: "Elérhetőség",
            details: "Részletes leírás",
            price: "Ár információk"
        }
    }[lang]

    const showPrice = provider.price_estimate &&
        provider.price_estimate.trim().length > 0 &&
        !provider.price_estimate.toLowerCase().includes('contact') &&
        !provider.price_estimate.toLowerCase().includes('lépjen')

    return (
        <>
            <div
                onClick={onOpen}
                className="group relative bg-card hover:bg-accent/5 transition-all duration-300 rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl border border-border/60 flex flex-col sm:h-full"
            >
                <div className="p-3 sm:p-6">

                    <div className="flex gap-4 mb-3">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0 border border-primary/10">
                            <Icon size={28} className="text-primary" />
                        </div>

                        <div className="flex-1 min-w-0 pr-8">
                            <div className="flex items-center gap-2">
                                <h3 className="text-base sm:text-lg font-bold leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                                    {provider.name}
                                </h3>
                                {provider.is_verified && (
                                    <div className="bg-blue-500/10 text-blue-600 dark:text-blue-400 p-1 rounded-full flex items-center gap-1 text-[8px] sm:text-[9px] font-black px-2 uppercase tracking-widest border border-blue-500/20 shrink-0">
                                        <CheckCircle2 size={10} />
                                        <span className="hidden xs:inline">{t.verified}</span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-2 flex flex-wrap gap-1.5 items-center">
                                {/* Category Tag */}
                                <span className="bg-primary/10 text-primary text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-lg border border-primary/20 uppercase tracking-widest whitespace-nowrap">
                                    {provider.category}
                                </span>

                                {/* Location Tag */}
                                <div className="flex items-center gap-1 bg-muted/80 text-muted-foreground text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-lg border border-border/50 whitespace-nowrap">
                                    <MapPin size={10} className="text-primary" />
                                    {provider.city}
                                </div>

                                {/* Availability Tag */}
                                {provider.availability_text && (
                                    <div className="flex items-center gap-1 bg-amber-500/5 text-amber-600 dark:text-amber-400 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-lg border border-amber-500/10 whitespace-nowrap">
                                        <Clock size={10} />
                                        {provider.availability_text}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <p className="text-[12px] sm:text-[13px] text-muted-foreground/80 line-clamp-2 min-h-[2.4em] leading-normal sm:leading-relaxed">
                        {provider.description}
                    </p>

                    <div className="mt-3 flex items-center justify-between gap-3">
                        {showPrice ? (
                            <div className="bg-primary/5 px-2 py-1 rounded-lg border border-primary/10 min-w-0 max-w-[60%]">
                                <p className="text-[11px] font-black text-primary truncate">{provider.price_estimate}</p>
                            </div>
                        ) : <div />}

                        <div className="flex items-center gap-1 text-primary/80 font-black text-[10px] uppercase tracking-wider shrink-0 whitespace-nowrap group-hover:translate-x-1 transition-transform">
                            {t.more}
                            <ChevronRight size={12} />
                        </div>
                    </div>
                </div>

                <div className="sm:mt-auto pt-2 sm:pt-5 border-t border-border/50 flex flex-col gap-2 sm:gap-3 p-3 sm:p-6 sm:pt-0">
                    <a
                        onClick={(e) => e.stopPropagation()}
                        href={`tel:${provider.phone}`}
                        className="flex items-center justify-center gap-2 bg-red-600 text-white p-3 sm:p-4 rounded-xl sm:rounded-2xl font-black text-sm transition-all hover:bg-red-700 active:scale-95 shadow-xl shadow-red-600/20 w-full relative overflow-hidden group/btn"
                    >
                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                        <Phone size={18} className="relative z-10 sm:w-[20px] sm:h-[20px]" />
                        <span className="relative z-10">{t.call}</span>
                    </a>
                    {provider.whatsapp && (
                        <a
                            onClick={(e) => e.stopPropagation()}
                            href={provider.whatsapp.startsWith('http') ? provider.whatsapp : `https://wa.me/${provider.whatsapp.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 bg-green-600 text-white p-3 sm:p-4 rounded-xl sm:rounded-2xl font-black text-sm transition-all hover:bg-green-700 active:scale-95 shadow-xl shadow-green-600/20 w-full"
                        >
                            <MessageCircle size={18} className="sm:w-[20px] sm:h-[20px]" />
                            <span>{t.whatsapp}</span>
                        </a>
                    )}
                </div>
            </div>
        </>
    )
}
