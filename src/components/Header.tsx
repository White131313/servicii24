"use client"

import { Moon, Sun, Wrench, User, Mail, Phone, MessageCircle } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import Link from "next/link"

export function Header({
    lang,
    setLang
}: {
    lang: 'ro' | 'hu',
    setLang: (l: 'ro' | 'hu') => void
}) {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const [showContact, setShowContact] = useState(false)

    useEffect(() => setMounted(true), [])

    if (!mounted) return (
        <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md">
            <div className="container flex h-16 sm:h-20 items-center justify-between px-4 mx-auto">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl">
                        <span className="text-xl sm:text-2xl font-bold font-display">Servicii24</span>
                    </div>
                </div>
            </div>
        </header>
    )

    const contactInfo = {
        phone: "+40770336394",
        email: "yourai.lab13@gmail.com"
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/10 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 transition-all duration-300">
            <div className="container flex h-16 sm:h-20 items-center justify-between px-4 mx-auto">
                <div className="flex items-center gap-2 sm:gap-6">
                    <Link href="/" className="group flex items-center transition-transform active:scale-95">
                        <div className="p-1.5 sm:p-2 rounded-2xl transition-all">
                            <span className="text-xl sm:text-2xl font-black tracking-tighter">
                                <span className="bg-gradient-to-br from-blue-500 via-indigo-600 to-violet-700 bg-clip-text text-transparent">Servicii24</span>
                                <span className="text-muted-foreground/20">.eu</span>
                            </span>
                        </div>
                    </Link>

                    <nav className="hidden lg:flex items-center gap-1">
                        <Link
                            href={`/dashboard?lang=${lang}`}
                            className="flex items-center gap-2.5 px-5 py-2 hover:bg-muted/50 rounded-full text-sm font-bold transition-all active:scale-95 text-foreground/80 hover:text-foreground"
                        >
                            <User size={16} strokeWidth={2.5} className="text-primary" />
                            {lang === 'ro' ? 'Sunt meseriaș' : 'Szakember vagyok'}
                        </Link>

                        <div className="relative group">
                            <button
                                className="flex items-center gap-2.5 px-5 py-2 hover:bg-muted/50 rounded-full text-sm font-bold transition-all text-foreground/80 hover:text-foreground"
                                onClick={() => setShowContact(!showContact)}
                                onBlur={() => setTimeout(() => setShowContact(false), 200)}
                            >
                                <MessageCircle size={16} strokeWidth={2.5} className="text-blue-500" />
                                Contact
                            </button>

                            <div className={`absolute top-full left-0 mt-2 w-64 bg-card border border-border/50 shadow-2xl rounded-2xl p-4 transition-all duration-200 transform z-[60] ${showContact ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2 lg:group-hover:opacity-100 lg:group-hover:visible lg:group-hover:translate-y-0'}`}>
                                <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground mb-3">{lang === 'ro' ? 'Suport Producție' : 'Támogatás'}</p>
                                <a href={`tel:${contactInfo.phone}`} className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-xl transition-colors group/item">
                                    <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-600">
                                        <Phone size={14} strokeWidth={2.5} />
                                    </div>
                                    <span className="text-sm font-bold text-foreground/80 group-hover/item:text-foreground">{contactInfo.phone}</span>
                                </a>
                                <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-xl transition-colors group/item mt-1">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600">
                                        <Mail size={14} strokeWidth={2.5} />
                                    </div>
                                    <span className="text-xs font-bold text-foreground/80 group-hover/item:text-foreground truncate">{contactInfo.email}</span>
                                </a>
                            </div>
                        </div>
                    </nav>
                </div>

                <div className="flex items-center gap-2 sm:gap-4 font-semibold">
                    {/* Mobile Contact Icon */}
                    <div className="lg:hidden relative">
                        <button
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted transition-all active:scale-90"
                            onClick={() => setShowContact(!showContact)}
                            onBlur={() => setTimeout(() => setShowContact(false), 200)}
                        >
                            <MessageCircle size={20} strokeWidth={2.2} />
                        </button>
                        <div className={`absolute top-full right-0 mt-2 w-56 bg-card border border-border/50 shadow-2xl rounded-2xl p-3 transition-all duration-200 z-[60] ${showContact ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
                            <a href={`tel:${contactInfo.phone}`} className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg transition-colors overflow-hidden">
                                <Phone size={14} className="text-green-600 shrink-0" />
                                <span className="text-xs font-bold truncate">{contactInfo.phone}</span>
                            </a>
                            <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg transition-colors mt-1 overflow-hidden">
                                <Mail size={14} className="text-blue-600 shrink-0" />
                                <span className="text-[10px] font-bold truncate">{contactInfo.email}</span>
                            </a>
                        </div>
                    </div>

                    <div className="flex items-center bg-muted/40 rounded-full p-1 border border-border/10">
                        <button
                            onClick={() => setLang('ro')}
                            className={`px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs transition-all ${lang === 'ro' ? 'bg-background shadow-lg text-foreground font-black' : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            RO
                        </button>
                        <button
                            onClick={() => setLang('hu')}
                            className={`px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs transition-all ${lang === 'hu' ? 'bg-background shadow-lg text-foreground font-black' : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            HU
                        </button>
                    </div>

                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-all text-muted-foreground hover:text-foreground bg-muted/20 active:scale-90 shadow-sm border border-border/10"
                    >
                        {theme === "dark" ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
                    </button>
                </div>
            </div>
        </header>
    )
}
