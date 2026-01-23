import { Language } from "@/types";

// Maps various slug variants (singular, plural, legacy) to actual DB category names
export const CATEGORY_SLUG_MAP: Record<string, string> = {
    // Romanian Plurals/Legacy
    'lacatusi': 'Lăcătuș',
    'lacatus': 'Lăcătuș',
    'electricieni': 'Electrician',
    'electrician': 'Electrician',
    'asistenta-rutiera': 'Asistență rutieră',
    'instalatori': 'Instalator',
    'instalator': 'Instalator',
    'soferi-de-inchiriat': 'Șofer de închiriat',
    'soferi': 'Șofer de închiriat',
    'veterinari': 'Veterinar',
    'veterinar': 'Veterinar',
    'constructii': 'Construcții',
    'inchirieri-auto': 'Închirieri auto',
    'meditatii': 'Meditații',
    'hornari': 'Hornar',
    'hornar': 'Hornar',
    'acoperisuri': 'Acoperiș',
    'acoperis': 'Acoperiș',
    'curatenie': 'Curățenie',
    'instalator-ac': 'Instalator A.C',
    'forare-puturi': 'Forare puțuri',

    // Hungarian/Legacy
    'epitoipar': 'Építőipar',
    'allatorvosok': 'Állatorvos',
    'allatorvos': 'Állatorvos',
    'korrepetalas': 'Korrepetálás',
    'villanyszerelok': 'Villanyszerelő',
    'villanyszerelo': 'Villanyszerelő',
    'autokolcsonzo': 'Autókölcsönző',
    'autokolcsonzes': 'Autókölcsönző',
    'utmenti-segitseg': 'Útmenti segítség',
    'automentes': 'Útmenti segítség',
    'kemenyseprok': 'Kéményseprő',
    'kemenysepro': 'Kéményseprő',
    'vizvezetek-szerelok': 'Vízvezeték-szerelő',
    'vizvezetek-szerelo': 'Vízvezeték-szerelő',
    'berelheto-soforok': 'Bérelhető sofőr',
    'berelheto-sofor': 'Bérelhető sofőr',
    'lakatosok': 'Lakatos',
    'lakatos': 'Lakatos',
    'tetok': 'Tető',
    'teto': 'Tető',
    'takaritas': 'Takarítás',
    'klimaszerelo': 'Klímaszerelő',
    'kutfuras': 'Kútfúrás',
    'kutfurasok': 'Kútfúrás',
    'foras-kutak': 'Kútfúrás',
    'sofor': 'Bérelhető sofőr',
    'soforok': 'Bérelhető sofőr'
};

export const normalize = (str: string) =>
    str.toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

export const CITY_NAME_MAPPINGS: Record<string, string[]> = {
    "miercurea ciuc": ["miercurea ciuc", "csikszereda", "cickszereda", "ciuc"],
    "csikszereda": ["miercurea ciuc", "csikszereda", "cickszereda", "ciuc"],
    "cickszereda": ["miercurea ciuc", "csikszereda", "cickszereda", "ciuc"],
    "ciuc": ["miercurea ciuc", "csikszereda", "cickszereda", "ciuc"],
    "brasov": ["brasov", "brasso"],
    "brasso": ["brasov", "brasso"],
    "targu mures": ["targu mures", "marosvasarhely", "mures"],
    "marosvasarhely": ["targu mures", "marosvasarhely", "mures"],
    "mures": ["targu mures", "marosvasarhely", "mures"],
    "sfantu gheorghe": ["sfantu gheorghe", "sepsiszentgyorgy", "covasna"],
    "sepsiszentgyorgy": ["sfantu gheorghe", "sepsiszentgyorgy", "covasna"],
    "covasna": ["sfantu gheorghe", "sepsiszentgyorgy", "covasna"],
    "cluj-napoca": ["cluj-napoca", "kolozsvar", "cluj"],
    "kolozsvar": ["cluj-napoca", "kolozsvar", "cluj"],
    "cluj": ["cluj-napoca", "kolozsvar", "cluj"],
    "gheorgheni": ["gheorgheni", "gyergyoszentmiklos"],
    "gyergyoszentmiklos": ["gheorgheni", "gyergyoszentmiklos"],
    "odorheiu secuiesc": ["odorheiu secuiesc", "szekelyudvarhely"],
    "szekelyudvarhely": ["odorheiu secuiesc", "szekelyudvarhely"],
    "ciumani": ["gheorgheni", "ciumani", "hargita", "harghita"],
};

// Separated by language to prevent cross-language URL generation
export const COUNTY_MAPPINGS_RO: Record<string, string[]> = {
    "harghita": ["miercurea ciuc", "csikszereda", "gheorgheni", "odorheiu secuiesc", "toplita", "cristuru secuiesc", "vlahita", "harghita"],
    "mures": ["targu mures", "marosvasarhely", "sighisoara", "reghin", "tarnaveni", "ludus", "sovata", "mures"],
    "brasov": ["brasov", "brasso", "fagaras", "sacele", "zarnesti", "codlea", "rasnov"],
    "covasna": ["sfantu gheorghe", "sepsiszentgyorgy", "targu secuiesc", "covasna", "baraolt", "intorsura buzaului"],
    "cluj": ["cluj-napoca", "kolozsvar", "turda", "dej", "campia turzii", "gherla", "huedin", "cluj"]
};

export const COUNTY_MAPPINGS_HU: Record<string, string[]> = {
    "hargita": ["csikszereda", "gyergyoszentmiklos", "szekelyudvarhely", "marosheviz", "szekelykeresztur", "szentegyhaza", "hargita"],
    "maros": ["marosvasarhely", "segesvar", "szaszregen", "dicso-szentmarton", "marosludas", "szovata", "maros"],
    "brasso": ["brasso", "fogaras", "negyfalu", "zerne", "feketehalom", "barcarozsnyo"],
    "kovaszna": ["sepsiszentgyorgy", "kezdivasarhely", "kovaszna", "barot", "bodzafordulo"],
    "kolozs": ["kolozsvar", "torda", "des", "aranyosgyeres", "szamosujvar", "banffyhunyad", "kolozs"]
};

export const COUNTY_MAPPINGS: Record<string, string[]> = {
    ...COUNTY_MAPPINGS_RO,
    ...COUNTY_MAPPINGS_HU
};

// Heuristic to detect if a category string is Hungarian
export const isHungarianCategory = (cat: string): boolean => {
    if (!cat) return false;
    const huCategories = [
        'Építőipar', 'Állatorvos', 'Korrepetálás', 'Villanyszerelő',
        'Autókölcsönző', 'Útmenti segítség', 'Kéményseprő',
        'Vízvezeték-szerelő', 'Bérelhető sofőr', 'Lakatos',
        'Tető', 'Takarítás', 'Klímaszerelő', 'Kútfúrás'
    ];
    return huCategories.includes(cat);
};
// Utility to translate common Romanian professional terms to Hungarian
// It tries to detect if there's already a Hungarian part in the text and prioritize it.
export const translateProviderInfo = (text: string, lang: Language): string => {
    if (lang !== 'hu' || !text) return text;

    const huChars = /[áéíóöőúüűÁÉÍÓÖŐÚÜŰ]/g;
    const roChars = /[ăâîșțĂÂÎȘȚ]/g;
    const huKeywords = /\b(és|a|az|egy|van|lesz|vagyok|vagyunk|nyújtok|biztosítunk|kínálunk|szolgáltatás|szerelés|javítás|helyszín|időpont|elérhetőség)\b/i;

    const evaluateSection = (s: string) => {
        const huCount = (s.match(huChars) || []).length;
        const roCount = (s.match(roChars) || []).length;
        const hasHuKeywords = huKeywords.test(s);
        const hasExtraHu = /[őűŐŰ]/.test(s); // These are unique to HU

        let score = huCount * 2 - roCount * 3;
        if (hasHuKeywords) score += 10;
        if (hasExtraHu) score += 20;
        return score;
    };

    // 1. Try to split by common separators (newline or sentence boundaries with capital letters)
    const sections = text.split(/\n|(?<=[.!?])\s*(?=[A-ZŐŰÁÉÍÓÖÚÜ])/);
    let huParts: string[] = [];

    for (const section of sections) {
        if (section.trim().length < 5) continue;
        const score = evaluateSection(section);
        if (score > 5) {
            huParts.push(section.trim());
        }
    }

    // If we found sections that are clearly Hungarian, return them joined.
    if (huParts.length > 0) {
        return huParts.join(' ').trim();
    }

    // 2. Fallback: Dictionary-based word/phrase replacement
    const dictionary: Record<string, string> = {
        // Availability
        'Luni': 'Hétfő', 'Marti': 'Kedd', 'Miercuri': 'Szerda', 'Joi': 'Csütörtök', 'Vineri': 'Péntek', 'Sambata': 'Szombat', 'Duminica': 'Vasárnap',
        'Non-stop': 'Non-stop', 'Urgențe': 'Sürgősségi', 'Zilnic': 'Naponta', 'Program': 'Munkarend',
        'Oricand': 'Bármikor', 'Disponibil': 'Elérhető', 'Interventii': 'Beavatkozások',
        'Suna acum': 'Hívás most', 'Contact direct': 'Közvetlen kapcsolat',

        // Price estimates
        'Pret negociabil': 'Alkuképes ár', 'De la': 'Től', 'Ron': 'Lei', 'Lei': 'Lei', 'Gratuit': 'Ingyenes',
        'Contactati-ne': 'Lépjen kapcsolatba velünk', 'Estimare': 'Felmérés', 'Variabil': 'Változó',
        'In functie de': 'Függően', 'lucrare': 'munka',

        // Descriptions / Keywords
        'servicii profesionale': 'professzionális szolgáltatások',
        'Ofer': 'Kínálok', 'Oferim': 'Kínálunk',
        'experienta': 'tapasztalat',
        'garantie': 'garancia',
        'echipa': 'csapat',
        'calitate': 'minőség',
        'ieftin': 'olcsó',
        'rapid': 'gyors',
        'sector': 'kerület',
        'montaj': 'szerelés',
        'reparatii': 'javítások',
        'repararea': 'javítása',
        'intretinere': 'karbantartás',
        'asiguram': 'biztosítunk',
        'oferim': 'kínálunk',
        'autorizat': 'engedéllyel rendelkező',
        'modern': 'modern',
        'sigur': 'biztonságos',
        'intervenții': 'beavatkozások',
        'instalații': 'berendezések',
        'țevi': 'csövek',
        'apă': 'víz',
        'sistemelor': 'rendszerek',
        'eficientă': 'hatékony',
        'corectă': 'megfelelő',
        'orice': 'bármilyen'
    };

    let translated = text;
    // Sort keys by length descending to match longer phrases first
    const sortedKeys = Object.keys(dictionary).sort((a, b) => b.length - a.length);

    sortedKeys.forEach((ro) => {
        const hu = dictionary[ro];
        const regex = new RegExp(`\\b${ro}\\b`, 'gi');
        translated = translated.replace(regex, hu);
    });

    return translated;
};
