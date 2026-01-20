"use client"

import { Provider, Language } from "@/types"
import { getCategoryIcon } from "@/lib/icons"
import { Phone, MessageCircle, MapPin, Clock, X } from "lucide-react"

interface ProviderModalProps {
    provider: Provider
    lang: Language
    onClose: () => void
}

export function ProviderModal({ provider, lang, onClose }: ProviderModalProps) {
    const Icon = getCategoryIcon(provider.category)

    const t = {
        ro: {
            call: "SUNĂ ACUM",
            whatsapp: "WHATSAPP",
            location: "Locație",
            availability: "Disponibilitate",
            details: "Detalii complete",
            price: "Informații preț"
        },
        hu: {
            call: "HÍVÁS MOST",
            whatsapp: "WHATSAPP",
            location: "Helyszín",
            availability: "Elérhetőség",
            details: "Részletes leírás",
            price: "Ár információk"
        }
    }[lang]

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-background/60 backdrop-blur-md animate-in fade-in duration-300"
            onClick={onClose}
        >
            <div
                className="bg-card w-full max-w-2xl border-4 border-primary/10 rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-10 p-2 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground transition-all"
                >
                    <X size={24} />
                </button>

                <div className="flex-1 overflow-y-auto p-8 sm:p-12 no-scrollbar">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 mb-8">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[1.5rem] bg-primary/10 flex items-center justify-center shrink-0">
                            <Icon size={48} className="text-primary" />
                        </div>
                        <div>
                            <h2 className="text-2xl sm:text-4xl font-black leading-tight mb-2">{provider.name}</h2>
                            <p className="text-primary font-black uppercase tracking-[0.2em] text-sm">{provider.category}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        <div className="flex items-center gap-3 bg-muted/40 p-4 rounded-2xl border border-border/50">
                            <MapPin size={24} className="text-primary" />
                            <div>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{t.location}</p>
                                <p className="font-black text-sm">{provider.city}</p>
                            </div>
                        </div>
                        {provider.availability_text && (
                            <div className="flex items-center gap-3 bg-muted/40 p-4 rounded-2xl border border-border/50">
                                <Clock size={24} className="text-primary" />
                                <div>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{t.availability}</p>
                                    <p className="font-black text-sm">{provider.availability_text}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4 mb-10">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] px-1 italic">{t.details}</p>
                        <div className="bg-muted/20 p-6 rounded-3xl border border-border/30">
                            <p className="text-lg leading-relaxed text-foreground font-medium whitespace-pre-wrap">
                                {provider.description}
                            </p>
                        </div>
                    </div>

                    {provider.price_estimate && (
                        <div className="mb-10 bg-primary/5 p-6 rounded-3xl border-2 border-primary/10">
                            <p className="text-[10px] font-black text-primary/60 uppercase tracking-[0.3em] mb-1">{t.price}</p>
                            <p className="text-2xl font-black text-primary">{provider.price_estimate}</p>
                        </div>
                    )}
                </div>

                <div className="p-8 border-t border-border/50 bg-card/80 backdrop-blur-md">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <a
                            href={`tel:${provider.phone}`}
                            className="flex-1 flex items-center justify-center gap-3 bg-red-600 text-white p-5 rounded-[1.25rem] font-black text-lg transition-all hover:bg-red-700 shadow-2xl shadow-red-600/30"
                        >
                            <Phone size={24} />
                            {t.call}
                        </a>
                        {provider.whatsapp && (
                            <a
                                href={provider.whatsapp.startsWith('http') ? provider.whatsapp : `https://wa.me/${provider.whatsapp.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 flex items-center justify-center gap-3 bg-green-600 text-white p-5 rounded-[1.25rem] font-black text-lg transition-all hover:bg-green-700 shadow-2xl shadow-green-600/30"
                            >
                                <MessageCircle size={24} />
                                {t.whatsapp}
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
