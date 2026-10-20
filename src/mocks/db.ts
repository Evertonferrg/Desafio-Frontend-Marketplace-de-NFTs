import type { Nft, User, Wallet, Order } from '@/contracts'
import { buildNfts } from './fixtures/nfts'
import { DEMO_USERS } from './fixtures/users'

export type StoredUser = User & { passwordHash: string }
export type StoredSession = { token: string; userId: string; expiresAt: number }
export type CartLine = { nftId: string; quantity: number }

export type Db = {
  users: StoredUser[]
  nfts: Nft[]
  favorites: Record<string, string[]>
  carts: Record<string, CartLine[]>
  wallets: Record<string, Wallet[]>
  orders: Order[]
  sessions: StoredSession[]
  idempotency: Record<string, { hash: string; orderId: string }>
}

const KEY = 'nft-mock-db-v1'

export async function sha256(text: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

async function seed(): Promise<Db> {
  const users: StoredUser[] = await Promise.all(
    DEMO_USERS.map(async (u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      avatarUrl: null,
      passwordHash: await sha256(u.password), // nunca guardamos a senha em claro
    })),
  )
  return {
    users,
    nfts: buildNfts(),
    favorites: {},
    carts: {},
    wallets: {},
    orders: [],
    sessions: [],
    idempotency: {},
  }
}

export let db: Db

export function persist() {
  localStorage.setItem(KEY, JSON.stringify(db))
}

async function init() {
  const raw = localStorage.getItem(KEY)
  if (raw) {
    try {
      db = JSON.parse(raw) as Db
      return
    } catch {
      /* JSON corrompido: recria a partir do seed */
    }
  }
  db = await seed()
  persist()
}

/** Os handlers aguardam esta promise antes de ler o db. */
export const ready: Promise<void> = init()

/** Restaura integralmente o cenário conhecido. */
export async function resetDb() {
  db = await seed()
  persist()
}