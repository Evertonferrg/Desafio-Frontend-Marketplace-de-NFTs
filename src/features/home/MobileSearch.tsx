import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { HomeSidebar } from './HomeSidebar'

// Barra de busca + botão de filtros, só no celular (no desktop os filtros ficam na lateral).
export function MobileSearch() {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    void navigate({ to: '/', hash: 'catalogo', search: (prev: Record<string, unknown>) => ({ ...prev, q: q.trim() || undefined, page: 1 }) })
  }

  return (
    <div className="md:hidden">
      <form onSubmit={submit} role="search" className="flex gap-3">
        <label className="flex flex-1 items-center gap-2 rounded-lg bg-card px-3 py-2.5">
          <Search className="size-5 text-brand" aria-hidden="true" />
          <span className="sr-only">Explorar coleções</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Explorar coleções"
            className="min-w-0 flex-1 bg-transparent text-sm font-bold outline-none placeholder:text-muted-foreground"
          />
        </label>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Abrir filtros"
          className="grid size-11 place-items-center rounded-lg bg-primary text-primary-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <SlidersHorizontal className="size-5" />
        </button>
      </form>

      {open && (
        <div role="dialog" aria-modal="true" aria-label="Filtros" className="fixed inset-0 z-50 flex flex-col bg-background">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="font-bold">Filtros</h2>
            <button type="button" onClick={() => setOpen(false)} aria-label="Fechar filtros" className="p-2 text-brand">
              <X className="size-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4" onClick={(e) => (e.target as HTMLElement).closest('a') && setOpen(false)}>
            <HomeSidebar showFeatured={false} />
          </div>
        </div>
      )}
    </div>
  )
}
