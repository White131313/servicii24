import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://servicii24.eu'

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/dashboard/', '/api/'], // Disallow internal/admin routes
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
