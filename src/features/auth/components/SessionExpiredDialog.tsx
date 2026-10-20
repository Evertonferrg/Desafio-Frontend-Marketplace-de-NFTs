import { useEffect, useRef } from 'react'
import { useLocation, useRouter } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { expiredStore, useSessionExpired } from '../expired'

/** Aviso modal (elemento <dialog> nativo: foco preso e Esc já funcionam). */
export function SessionExpiredDialog() {
  const expired = useSessionExpired()
  const ref = useRef<HTMLDialogElement>(null)
  const router = useRouter()
  const href = useLocation({ select: (l) => l.href })

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (expired && !dialog.open) dialog.showModal()
    if (!expired && dialog.open) dialog.close()
  }, [expired])

  return (
    <dialog
      ref={ref}
      onClose={() => expiredStore.set(false)}
      aria-labelledby="session-expired-title"
      className="m-auto w-full max-w-sm rounded-xl border bg-background p-6 text-foreground backdrop:bg-black/50"
    >
      <h2 id="session-expired-title" className="text-lg font-bold">
        Sua sessão expirou
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Entre novamente para continuar de onde parou.
      </p>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" onClick={() => expiredStore.set(false)}>
          Agora não
        </Button>
        <Button
          onClick={() => {
            expiredStore.set(false)
            void router.navigate({ to: '/login', search: { redirect: href } })
          }}
        >
          Entrar novamente
        </Button>
      </div>
    </dialog>
  )
}