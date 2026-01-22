export type Provider = {
    id: number
    name: string
    is_available: boolean
    category: string
    description: string
    availability_text: string
    city: string
    phone: string
    whatsapp: string
    language: 'ro' | 'hu'
    category_logo: string | null
    price_estimate: string | null
    is_verified: boolean
    service_area: string | null
    created_at: string
    latitude?: number
    longitude?: number
}

export type Language = 'ro' | 'hu'
