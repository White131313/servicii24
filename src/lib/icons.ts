import {
    Wrench,
    Zap,
    Truck,
    Key,
    Cat,
    Brush,
    Car,
    Hammer,
    Droplet,
    Thermometer,
    BookOpen,
    Fan,
    User,
    ShieldCheck,
    House
} from "lucide-react"

export const categoryIcons: Record<string, any> = {
    "Lăcătuș": Key,
    "Lakatos": Key,
    "Electrician": Zap,
    "Villanyszerelő": Zap,
    "Asistență rutieră": Truck,
    "Útmenti segítség": Truck,
    "Instalator": Droplet,
    "Vízvezeték-szerelő": Droplet,
    "Curățenie": Brush,
    "Takarítás": Brush,
    "Șofer de închiriat": User,
    "Bérelhető sofőr": User,
    "Veterinar": Cat,
    "Állatorvos": Cat,
    "Construcții": Hammer,
    "Építőipar": Hammer,
    "Închirieri auto": Car,
    "Autókölcsönző": Car,
    "Instalator A.C": Fan,
    "Klímaszerelő": Fan,
    "Hornar": Thermometer,
    "Kéményseprő": Thermometer,
    "Meditații": BookOpen,
    "Korrepetálás": BookOpen,
    "Forare puțuri": Droplet,
    "Kútfúrás": Droplet,
    "Acoperiș": House,
    "Tető": House
}

export function getCategoryIcon(category: string) {
    const Icon = categoryIcons[category] || Wrench
    return Icon
}
