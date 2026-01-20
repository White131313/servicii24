"use client"

import { Moon, Sun, Wrench, User } from "lucide-react"
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
                        <span className="text-xl sm:text-2xl font-bold">Servicii24</span>
                    </div>
                </div>
            </div>
        </header>
    )

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/20 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 transition-all duration-300">
            <div className="container flex h-16 sm:h-20 items-center justify-between px-4 mx-auto">
                <div className="flex items-center gap-2 sm:gap-8">
                    <Link href="/" className="group flex items-center transition-transform active:scale-95">
                        <div className="p-2 sm:p-2.5 rounded-2xl transition-all">
                            <span className="text-xl sm:text-2xl font-bold tracking-tight">
                                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Servicii24</span>
                                <span className="text-muted-foreground/30">.eu</span>
                            </span>
                        </div>
                    </Link>

                    <Link
                        href={`/dashboard?lang=${lang}`}
                        className="hidden md:flex items-center gap-3 px-6 py-2.5 bg-foreground text-background hover:opacity-90 rounded-full text-sm font-semibold transition-all shadow-sm active:scale-95"
                    >
                        <div className="relative">
                            <User size={18} strokeWidth={2.5} />
                            <Wrench size={10} strokeWidth={3} className="absolute -right-1 -bottom-0.5 rotate-[15deg] text-background fill-background bg-foreground rounded-full p-[1px]" />
                        </div>
                        {lang === 'ro' ? 'Sunt meseriaș' : 'Szakember vagyok'}
                    </Link>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 font-semibold">
                    <Link
                        href={`/dashboard?lang=${lang}`}
                        className="md:hidden flex items-center justify-center w-10 h-10 bg-muted/40 text-foreground rounded-full hover:bg-muted/60 transition-all active:scale-90"
                        title={lang === 'ro' ? 'Sunt meseriaș' : 'Szakember vagyok'}
                    >
                        <div className="relative">
                            <User size={20} strokeWidth={2.2} />
                            <Wrench size={12} strokeWidth={3} className="absolute -right-1 -bottom-0.5 rotate-[15deg] text-muted-foreground fill-muted-foreground bg-muted p-[1px] rounded-full" />
                        </div>
                    </Link>

                    <div className="flex items-center bg-muted/40 rounded-full p-1 transition-all border-none">
                        <button
                            onClick={() => setLang('ro')}
                            className={`px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs transition-all border-none ${lang === 'ro' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            RO
                        </button>
                        <button
                            onClick={() => setLang('hu')}
                            className={`px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs transition-all border-none ${lang === 'hu' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            HU
                        </button>
                    </div>

                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-all text-muted-foreground hover:text-foreground bg-muted/20 active:scale-90"
                    >
                        {theme === "dark" ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
                    </button>
                </div>
            </div>
        </header>
    )
}
