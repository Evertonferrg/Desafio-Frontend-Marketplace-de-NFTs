import { useRouter } from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'

// Barra do topo no celular: botão voltar + título centralizado.
export function PageBar({ title }: { title: string }) {
  const router = useRouter()
  return (
    <div className="relative mb-4 flex min-h-9 items-center justify-center md:hidden">
      <button
        type="button"
        onClick={() => router.history.back()}
        aria-label="Voltar"
        className="absolute left-0 grid size-9 place-items-center rounded-full bg-secondary text-brand outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ChevronLeft className="size-5" />
      </button>
      <h1 className="font-bold">{title}</h1>
    </div>
  )
}
