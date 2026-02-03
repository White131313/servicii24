"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/Header"
import { ServiceListing } from "@/components/ServiceListing"
import { Language } from "@/types"

export default function Home() {
  const [lang, setLang] = useState<Language>('ro')

  // Language detection
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const urlLang = params.get('lang')

    if (urlLang === 'hu') {
      setLang('hu')
      return
    }
    if (urlLang === 'ro') {
      setLang('ro')
      return
    }

    const browserLang = navigator.language.toLowerCase()
    if (browserLang.startsWith('hu')) {
      setLang('hu')
    }
  }, [])

  const t = {
    ro: {
      footerTitle: "💬 Ai un serviciu și vrei să apari aici?",
      footerDescPrefix: "Trimite-ne un mesaj pe",
      footerWhatsApp: "WhatsApp",
      footerOr: "sau scrie-ne un",
      footerEmail: "Email",
    },
    hu: {
      footerTitle: "💬 Szolgáltatást nyújt și szeretne itt megjelenni?",
      footerDescPrefix: "Küldjön üzenetet",
      footerWhatsApp: "WhatsApp-on",
      footerOr: "vagy írjon",
      footerEmail: "E-mailt",
    }
  }[lang]

  return (
    <div className="min-h-screen selection:bg-primary/20">
      <Header lang={lang} setLang={setLang} />

      <ServiceListing lang={lang} />

      <footer className="relative border-t border-border/50 py-8 sm:py-16 bg-gradient-to-t from-primary/5 via-muted/10 to-transparent overflow-hidden pb-[calc(2rem+env(safe-area-inset-bottom))]">
        <div className="absolute inset-0 bg-grid-black-light dark:bg-grid-white-5 [mask-image:linear-gradient(to_bottom,transparent,black)] pointer-events-none"></div>
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-xl mx-auto mb-8 sm:mb-10">
            <h3 className="text-xl sm:text-3xl font-bold mb-3 sm:mb-4">{t.footerTitle}</h3>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {t.footerDescPrefix}{" "}
              <a
                href="https://wa.me/40770336394"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-green-600 dark:text-green-500 hover:underline inline-flex items-center gap-1 transition-all hover:scale-105"
              >
                {t.footerWhatsApp}
              </a>{" "}
              {t.footerOr}{" "}
              <a
                href="mailto:yourai.lab13@gmail.com"
                className="font-bold text-blue-600 dark:text-blue-500 hover:underline inline-flex items-center gap-1 transition-all hover:scale-105"
              >
                {t.footerEmail}
              </a>
              .
            </p>
          </div>
          <p className="text-sm text-muted-foreground/60">
            &copy; {new Date().getFullYear()} Servicii24.eu. Built for excellence.
          </p>
        </div>
      </footer>
    </div >
  )
}
