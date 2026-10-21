import { Link, useSearch } from '@tanstack/react-router'

const TABS = [
  { label: 'Todos os NFTs', sort: undefined },
  { label: 'Novos lançamentos', sort: 'recent' },
  { label: 'Em alta', sort: 'price_desc' },
] as const

export function CatalogTabs() {
  const { sort } = useSearch({ strict: false }) as { sort?: string }

  return (
    <nav aria-label="Seções do catálogo" className="flex gap-5 overflow-x-auto whitespace-nowrap text-sm">
      {TABS.map((t) => {
        const active = sort === t.sort
        return (
          <Link
            key={t.label}
            to="/"
            hash="catalogo"
            search={(prev: Record<string, unknown>) => ({ ...prev, sort: t.sort, page: 1 })}
            aria-current={active ? 'true' : undefined}
            className={`-mb-px border-b-2 py-1 outline-none focus-visible:ring-2 focus-visible:ring-ring ${active ? 'border-brand font-bold text-brand' : 'border-transparent'}`}
          >
            {t.label}
          </Link>
        )
      })}
    </nav>
  )
}
