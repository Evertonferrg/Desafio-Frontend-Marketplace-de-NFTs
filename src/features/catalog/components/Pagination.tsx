type Props = { page: number; totalPages: number; onPage: (page: number) => void }

// Mostra todas as páginas até 7; acima disso, 1 … vizinhas … última
function pagesToShow(page: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const wanted = [1, total, page - 1, page, page + 1].filter((n) => n >= 1 && n <= total)
  const sorted = [...new Set(wanted)].sort((a, b) => a - b)
  const out: (number | '…')[] = []
  sorted.forEach((n, i) => {
    if (i > 0 && n - sorted[i - 1] > 1) out.push('…')
    out.push(n)
  })
  return out
}

const box =
  'inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40'

export function Pagination({ page, totalPages, onPage }: Props) {
  if (totalPages <= 1) return null
  return (
    <nav aria-label="Paginação" className="flex flex-wrap items-center justify-end gap-2">
      {pagesToShow(page, totalPages).map((n, i) =>
        n === '…' ? (
          <span key={`gap-${i}`} aria-hidden="true" className="px-1 text-muted-foreground">
            …
          </span>
        ) : (
          <button
            key={n}
            type="button"
            onClick={() => onPage(n)}
            aria-label={`Página ${n}`}
            aria-current={n === page ? 'page' : undefined}
            className={`${box} ${n === page ? 'border-primary bg-primary font-semibold text-primary-foreground' : 'bg-background hover:bg-card'}`}
          >
            {n}
          </button>
        ),
      )}
      <button
        type="button"
        onClick={() => onPage(page + 1)}
        disabled={page >= totalPages}
        aria-label="Próxima página"
        className={`${box} bg-background hover:bg-card`}
      >
        ›
      </button>
    </nav>
  )
}