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
    'villanyszerelo': 'Villanyszerelő',
    'autokolcsonzo': 'Autókölcsönző',
    'autokolcsonzes': 'Autókölcsönző',
    'utmenti-segitseg': 'Útmenti segítség',
    'automentes': 'Útmenti segítség',
    'kemenysepro': 'Kéményseprő',
    'vizvezetek-szerelok': 'Vízvezeték-szerelő',
    'vizvezetek-szerelo': 'Vízvezeték-szerelő',
    'berelheto-sofor': 'Bérelhető sofőr',
    'lakatos': 'Lakatos',
    'teto': 'Tető',
    'takaritas': 'Takarítás',
    'klimaszerelo': 'Klímaszerelő',
    'kutfuras': 'Kútfúrás'
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
    const huKeywords = ['tetok', 'szerelok', 'lakatos', 'allatorvos', 'autokolcsonzes', 'automentes', 'villanyszerelo', 'szolgaltatasok'];
    const slug = cat.toLowerCase();
    return huKeywords.some(kw => slug.includes(kw));
};
