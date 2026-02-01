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

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/5 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 transition-all duration-300">
            <div className="container flex h-16 sm:h-20 items-center justify-between px-4 mx-auto">
                <div className="flex items-center gap-2 sm:gap-6">
                    <Link href={`/?lang=${lang}`} className="group flex items-center transition-transform active:scale-95">
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

                        <Link
                            href={`/contact?lang=${lang}`}
                            className="flex items-center gap-2.5 px-5 py-2 hover:bg-muted/50 rounded-full text-sm font-bold transition-all text-foreground/80 hover:text-foreground"
                        >
                            <MessageCircle size={16} strokeWidth={2.5} className="text-blue-500" />
                            Contact
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center gap-2 sm:gap-4 font-semibold">
                    {/* Mobile Contact Icon */}
                    <Link
                        href={`/contact?lang=${lang}`}
                        className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted transition-all active:scale-90"
                    >
                        <MessageCircle size={20} strokeWidth={2.2} />
                    </Link>

                    <div className="flex items-center bg-muted/40 rounded-full p-1 border-none shadow-none">
                        <button
                            onClick={() => setLang('ro')}
                            className={`px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs transition-all ${lang === 'ro' ? 'bg-background shadow-none text-foreground font-black' : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            RO
                        </button>
                        <button
                            onClick={() => setLang('hu')}
                            className={`px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs transition-all ${lang === 'hu' ? 'bg-background shadow-none text-foreground font-black' : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            HU
                        </button>
                    </div>

                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-all text-muted-foreground hover:text-foreground bg-muted/20 active:scale-90 shadow-none border-none"
                    >
                        {theme === "dark" ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
                    </button>
                </div>
            </div>
        </header>
    )
}
