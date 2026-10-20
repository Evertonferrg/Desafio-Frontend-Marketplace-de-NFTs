import { useSyncExternalStore } from 'react'

// Indica que a sessão expirou no meio do uso (resposta 401 com usuário logado).
let expired = false
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())

export const expiredStore = {
  get: () => expired,
  set(value: boolean) {
    if (expired === value) return
    expired = value
    emit()
  },
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
}

export function useSessionExpired() {
  return useSyncExternalStore(expiredStore.subscribe, expiredStore.get)
}