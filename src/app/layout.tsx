import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  title: "Servicii24 - Găsește Meseriași și Servicii Profesionale",
  description: "Platformă premium pentru găsirea serviciilor profesionale în România și Ungaria. Meseriași verificați, asistență rutieră, instalatori și multe altele.",
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
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
          <div className="fixed inset-0 bg-grid-black-light dark:bg-grid-white-5 pointer-events-none -z-10 [mask-image:radial-gradient(ellipse_at_center,black,transparent)]"></div>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
