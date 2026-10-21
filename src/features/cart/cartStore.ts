import { useSyncExternalStore } from 'react'

export type CartItem = {
  id: string
  name: string
  tokenId: string
  edition: string
  price: number
  qty: number
  image: string
}

// Dados de exemplo (troque pela sua API/estado real depois)
let items: CartItem[] = [
  { id: '042', name: 'Emerald Ape #042', tokenId: '#0042', edition: '1/50', price: 1.19, qty: 2, image: '/nfts/emerald-ape-042.png' },
  { id: '314', name: 'Violet Nomad #314', tokenId: '#0314', edition: '1/1', price: 1.39, qty: 6, image: '/nfts/violet-nomad-314.png' },
  { id: '088', name: 'Ivory Baron #088', tokenId: '#0088', edition: '1/10', price: 1.79, qty: 9, image: '/nfts/ivory-baron-088.png' },
]

const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())

export const NETWORK_FEE = 0.016

export const cartStore = {
  get: () => items,
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  setQty(id: string, qty: number) {
    items = items.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i))
    emit()
  },
  remove(id: string) {
    items = items.filter((i) => i.id !== id)
    emit()
  },
  add(nft: { id: string; name: string; price: string | number; image: string }, qty = 1, edition = '1/50') {
    const found = items.find((i) => i.id === nft.id)
    items = found
      ? items.map((i) => (i.id === nft.id ? { ...i, qty: i.qty + qty } : i))
      : [
          ...items,
          {
            id: nft.id,
            name: nft.name,
            tokenId: `#${nft.id.replace(/\D/g, '')}`,
            edition,
            price: Number(nft.price),
            qty,
            image: nft.image,
          },
        ]
    emit()
  },
  clear() {
    items = []
    emit()
  },
}

export function useCart() {
  const list = useSyncExternalStore(cartStore.subscribe, cartStore.get)
  const count = list.length
  const subtotal = list.reduce((n, i) => n + i.price * i.qty, 0)
  const fee = list.length ? NETWORK_FEE : 0
  return { items: list, count, subtotal, fee, total: subtotal + fee }
}

export const eth = (n: number, digits = 2) => `${n.toFixed(digits)} ETH`
