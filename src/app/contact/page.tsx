"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/Header"
import { Language } from "@/types"
import { Phone, Mail, Clock, ShieldCheck, MapPin, MessageSquare, ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function ContactPage() {
    const [lang, setLang] = useState<Language>('ro')

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const urlLang = params.get('lang')
        if (urlLang === 'hu') setLang('hu')
        else if (urlLang === 'ro') setLang('ro')
    }, [])

    const t = {
        ro: {
            title: "Contactează-ne",
            subtitle: "Suntem aici să te ajutăm în orice situație.",
            descriptionTitle: "Despre Servicii24.eu",
            description: "Servicii24.eu este locul unde urgențele își găsesc rezolvarea instantanee. Suntem o platformă modernă dedicată conectării rapide a clienților cu meseriași localizați și verificați. Indiferent că ai nevoie de un instalator, electrician, lăcătuș sau asistență rutieră, sistemul nostru îți oferă cele mai apropiate soluții în timp real, 24/7. Misiunea noastră este să eliminăm stresul căutării și să oferim acces instant la profesionalism.",
            phone: "Telefon",
            email: "Email",
            hours: "Disponibilitate",
            hoursVal: "Non-stop 24/7",
            back: "Înapoi la prima pagină",
            features: [
                { title: "Rapiditate", desc: "Găsești un specialist în mai puțin de 30 de secunde." },
                { title: "Verificare", desc: "Toți meseriașii sunt evaluați pentru siguranța ta." },
                { title: "Local", desc: "Folosim locația ta pentru a găsi cea mai apropiată soluție." }
            ]
        },
        hu: {
            title: "Kapcsolat",
            subtitle: "Azért vagyunk itt, hogy minden helyzetben segítsünk.",
            descriptionTitle: "A Servicii24.eu-ról",
            description: "A Servicii24.eu az a hely, ahol a sürgősségi esetek azonnali megoldást találnak. Modern platformunk célja, hogy gyorsan összekapcsolja az ügyfeleket a helyi és ellenőrzött szakemberekkel. Legyen szó vízvezeték-szerelőről, villanyszerelőről, lakatosról vagy útmenti segítségről, rendszerünk valós időben, a nap 24 órájában kínálja Önnek a legközelebbi megoldásokat. Küldetésünk a kereséssel járó stressz megszüntetése és az azonnali hozzáférés biztosítása a professzionalizmushoz.",
            phone: "Telefon",
            email: "E-mail",
            hours: "Elérhetőség",
            hoursVal: "Non-stop 24/7",
            back: "Vissza a főoldalra",
            features: [
                { title: "Gyorsaság", desc: "Kevesebb mint 30 másodperc alatt talál szakembert." },
                { title: "Ellenőrzés", desc: "Minden mestert ellenőrzünk az Ön biztonsága érdekében." },
                { title: "Helyi", desc: "Az Ön tartózkodási helyét használjuk a legközelebbi megoldás megtalálásához." }
            ]
        }
    }[lang]

    return (
        <div className="min-h-screen selection:bg-primary/20">
            <Header lang={lang} setLang={setLang} />

            <main className="container mx-auto px-4 py-12 sm:py-20">
                <div className="max-w-5xl mx-auto">
                    {/* Back button */}
                    <Link
                        href={`/?lang=${lang}`}
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group"
                    >
                        <ChevronLeft size={20} className="transition-transform group-hover:-translate-x-1" />
                        <span className="font-semibold text-sm">{t.back}</span>
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-20 items-start">
                        {/* Information side */}
                        <div className="space-y-10">
                            <div>
                                <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] mb-6">
                                    <span className="text-gradient">{t.title}</span>
                                </h1>
                                <p className="text-xl text-muted-foreground leading-relaxed">
                                    {t.subtitle}
                                </p>
                            </div>

                            <div className="space-y-6">
                                <a
                                    href="tel:+40770336394"
                                    className="flex items-center gap-6 p-6 rounded-3xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-all group"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-600">
                                        <Phone size={24} strokeWidth={2.5} />
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-widest font-black text-muted-foreground mb-1">{t.phone}</p>
                                        <p className="text-2xl font-black">+40 770 336 394</p>
                                    </div>
                                </a>

                                <a
                                    href="mailto:yourai.lab13@gmail.com"
                                    className="flex items-center gap-6 p-6 rounded-3xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-all group"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                                        <Mail size={24} strokeWidth={2.5} />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-xs uppercase tracking-widest font-black text-muted-foreground mb-1">{t.email}</p>
                                        <p className="text-lg sm:text-xl font-black truncate">yourai.lab13@gmail.com</p>
                                    </div>
                                </a>

                                <div className="flex items-center gap-6 p-6 rounded-3xl bg-muted/30 border border-border/50">
                                    <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600">
                                        <Clock size={24} strokeWidth={2.5} />
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-widest font-black text-muted-foreground mb-1">{t.hours}</p>
                                        <p className="text-xl font-black">{t.hoursVal}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description side */}
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 rounded-[40px] blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                            <div className="p-8 sm:p-12 rounded-[32px] bg-card border border-border/50 shadow-2xl space-y-8">
                                <h3 className="text-2xl font-black tracking-tight">{t.descriptionTitle}</h3>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    {t.description}
                                </p>

                                <div className="pt-8 grid grid-cols-1 gap-6">
                                    {t.features.map((f, i) => (
                                        <div key={i} className="flex gap-4 items-start">
                                            <div className="mt-1">
                                                <ShieldCheck className="text-primary" size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm mb-1">{f.title}</h4>
                                                <p className="text-xs text-muted-foreground">{f.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="py-10">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-sm text-muted-foreground/60">
                        &copy; {new Date().getFullYear()} Servicii24.eu. Built for excellence.
                    </p>
                </div>
            </footer>
        </div>
    )
}
