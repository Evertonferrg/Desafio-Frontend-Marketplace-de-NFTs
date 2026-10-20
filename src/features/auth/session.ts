import type { AuthResponse, Session } from "@/contracts";
import { useSyncExternalStore } from "react";

const KEY = 'nft-session'

type State = { token: string; session: Session } | null

function read(): State {
    try {
        const raw = localStorage.getItem(KEY)
        if (!raw) return null
        const parsed = JSON.parse(raw) as AuthResponse
        return parsed.token && parsed.session ? { token: parsed.token, session: parsed.session} : null
    } catch {
        return null
    }
}

let state: State = read()
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())

//store simples de sessao (token + usuario)
export const sessionStore = {
    get: (): State => state,
    getToken: (): string | null => state?.token ?? null,
    set(res: AuthResponse) {
        state = { token: res.token, session: res.session}
        try {
            localStorage.setItem(KEY, JSON.stringify(res))
        } catch {
            /* sessao valida apenas nessa aba */
        }
        emit()
    },
    clear() {
        state = null
        try {
            localStorage.removeItem(KEY)
        } catch {
            //ignora
        }
        emit()
    },
    subscribe(listener: () => void) {
        listeners.add(listener)
        return () => {
            listeners.delete(listener)
        }
    },
}

export function useSession(){
    return useSyncExternalStore(sessionStore.subscribe, sessionStore.get)
}