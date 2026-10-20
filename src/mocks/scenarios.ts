export const SCENARIOS = [
    'default',
    'slow',
    'empty',
    'network-error',
    'server-error',
    'session-expired',
    'favorites-fail',
] as const
export type Scenario = (typeof SCENARIOS)[number]

const KEY = 'mock-scenario'
const isScenario = (v: string | null): v is Scenario =>
    !!v && (SCENARIOS as readonly string[]).includes(v)


/** Ordem: ?scenario= na URL > sessionStorage > VITE_MOCK_SCENARIO > "default". */
export function getScenario(): Scenario {
    const fromUrl = new URLSearchParams(location.search).get('scenario')
    if (isScenario(fromUrl)) {
        sessionStorage.setItem(KEY, fromUrl)
        return fromUrl
    }
    const stored = sessionStorage.getItem(KEY)
    if (isScenario(stored)) return stored
    const fromEnv = (import.meta.env.VITE_MOCK_SCENARIO as string | undefined) ?? null
    return isScenario(fromEnv) ? fromEnv : 'default'
}