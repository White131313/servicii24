import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Script from "next/script";

const inter = Inter({ subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  title: "Servicii24 - Meseriași pentru Urgențe Non-Stop în zona ta",
  description: "Ai o urgență? Găsește rapid specialiști și meseriași din zona ta. Intervenții non-stop 24/7 și contact direct pentru soluții imediate pe Servicii24.eu.",
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    viewportFit: 'cover',
  },
  alternates: {
    canonical: 'https://servicii24.eu',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="premium-bg"></div>
          <div className="fixed inset-0 bg-grid-black-light dark:bg-grid-white-5 pointer-events-none -z-10 [mask-image:radial-gradient(ellipse_at_center,black,transparent)]"></div>
          {children}
        </ThemeProvider>

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-JY5034TZM1"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-JY5034TZM1');
          `}
        </Script>
      </body>
    </html>
  );
}
