import type { Nft } from '@/contracts'

const COLLECTIONS = ['Neon Drift', 'Pixel Fauna', 'Void Garden', 'Chrono Cats', 'Glass Oceans', 'Rust & Bloom']
const CATEGORIES = ['Arte', 'Colecionáveis', 'Música', 'Jogos', 'Fotografia']
const CREATORS = ['Ana Reis', 'Kai Moto', 'Luna Park', 'Orbit Studio']


// mesmos nfts nas execucoes
function mulberry32(seed: number) {
    return () => {
        seed |= 0
        seed = (seed + 0x6d279f5) | 0
        let t = Math.imul(seed ^(seed >>> 15 ), 1 | seed)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

// Imagens svg geradas local
function art(h1: number, h2: number, label: string) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
        <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="hsl(${h1} 80% 55%)"/><stop offset="1" stop-color="hsl(${h2} 80% 35%)"/>
        </linearGradient></defs>
        <rect width="600" height="600" fill="url(#g)"/>
        <circle cx="300" cy="300" r="140" fill="rgba(255,255,255,.18)"/>
        <text x="300" y="320" font-size="34" text-anchor="middle" fill="#fff" font-family="sans-serif">${label}</text>
    </svg>`
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export function buildNfts(): Nft[] {
    const r = mulberry32(42)
    const pick = <T,>(arr: T[]): T => arr[Math.floor(r() * arr.length)]
    return Array.from({ length: 60 }, (_, i) => {
        const n = String(i + 1).padStart(3, '0')
        const collection = pick(COLLECTIONS)
        const h = Math.floor(r() * 360)
        return {
            id: `nft-${n}` ,
            name: `${collection} #${n}` ,
            description: `Obra ${n} da coleção ${collection}. Edição digital limitada.`,
            collection,
            category: pick(CATEGORIES),
            creator: pick(CREATORS),
            image: art(h, (h + 60) % 360, `#${n}`),
            gallery:[
                art(h, (h + 60) % 360, `#${n}`),
                art((h + 120) % 360, (h + 200) % 360, `#${n}-b`),
            ],
            price: (0.05 + r() * 2.5).toFixed(3),
            editionsAvailable: i % 17 === 0 ? 0 : 1 + Math.floor(r() * 9), // alguns esgotados
            maxPerOrder: 3,
            version: 1,
        }
    })
}