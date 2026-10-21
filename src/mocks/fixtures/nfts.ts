import type { Nft } from '@/contracts'

const CATEGORIES = ['Arte', 'Colecionáveis', 'Música', 'Jogos', 'Fotografia']
const CREATORS = ['Ana Reis', 'Kai Moto', 'Luna Park', 'Orbit Studio']

const IMG = {
  ape: '/nfts/emerald-ape-042.png',
  nomad: '/nfts/violet-nomad-314.png',
  baron: '/nfts/ivory-baron-088.png',
  beat: '/nfts/golden-beat-207.png',
}
const IMAGES = Object.values(IMG)

// NFTs do design, na ordem em que aparecem na grade da Início.
const DESIGN = [
  { name: 'Emerald Ape #042', price: '1.190', image: IMG.ape },
  { name: 'Sage Nomad #009', price: '1.690', image: IMG.nomad },
  { name: 'Neon Vessel #552', price: '1.990', image: IMG.baron },
  { name: 'Cosmic Bloom #118', price: '1.290', image: IMG.nomad },
  { name: 'Violet Nomad #314', price: '1.390', image: IMG.nomad },
  { name: 'Ivory Baron #088', price: '1.790', image: IMG.baron },
  { name: 'Golden Beat #207', price: '0.990', image: IMG.beat },
  { name: 'Golden Frequency #071', price: '0.590', image: IMG.nomad },
  { name: 'Golden Signal #160', price: '0.390', image: IMG.beat },
]

// Nomes para os NFTs de preenchimento (o resto dos 60)
const PREFIX = ['Amber', 'Onyx', 'Jade', 'Coral', 'Lunar', 'Solar', 'Misty', 'Royal']
const SUFFIX = ['Ape', 'Nomad', 'Baron', 'Beat', 'Bloom', 'Signal']

// mesmos nfts nas execucoes
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d279f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function buildNfts(): Nft[] {
  const r = mulberry32(42)
  const pick = <T,>(arr: T[]): T => arr[Math.floor(r() * arr.length)]
  const total = 60
  const filler = total - DESIGN.length

  return Array.from({ length: total }, (_, i) => {
    const n = String(i + 1).padStart(3, '0')
    // Os do design ficam no fim da lista, de trás para frente, para
    // aparecerem primeiro quando a grade ordena por "mais recentes".
    const fixed = i >= filler ? DESIGN[total - 1 - i] : undefined

    const name = fixed?.name ?? `${pick(PREFIX)} ${pick(SUFFIX)} #${n}`
    const image = fixed?.image ?? IMAGES[i % IMAGES.length]
    const collection = 'Kurio Apes'

    return {
      id: `nft-${n}`,
      name,
      description: `${name} é uma obra digital da coleção ${collection}, verificada na Ethereum.`,
      collection,
      category: pick(CATEGORIES),
      creator: pick(CREATORS),
      image,
      gallery: [image, image, image, image], // o design mostra 4 miniaturas
      // os de preenchimento ficam baratos para os do design liderarem o "maior preço"
      price: fixed?.price ?? (0.05 + r() * 0.3).toFixed(3),
      editionsAvailable: i % 17 === 0 ? 0 : 1 + Math.floor(r() * 9), // alguns esgotados
      maxPerOrder: 3,
      version: 1,
    }
  })
}