import { useEffect, useRef, useState } from 'react'
import { SORTS, SORT_LABELS, type CatalogSearch, type Sort } from '../search'


const CATEGORIES = ['Arte', 'Colecionáveis', 'Musica', 'Jogos', 'Fotografia']

type Props  = { 
    q?: string
    category?: string
    sort: Sort
    onChange: (patch: Partial<CatalogSearch>, opts?: { replace?: boolean }) => void
}

const field =
    'H-10 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring'

export function Filters({ q, category, sort, onChange }: Props){
    const [text, setText] = useState(q ?? '')
    const pushed = useRef(q ?? '')
  useEffect(() => {
    if ((q ?? '') !== pushed.current) {
      pushed.current = q ?? ''
      setText(q ?? '')
    }
  }, [q])

  // debounce da busca: só escreve na URL após 300 ms sem digitar
  useEffect(() => {
    const value = text.trim()
    if (value === pushed.current) return
    const t = setTimeout(() => {
      pushed.current = value
      onChange({ q: value || undefined, page: undefined }, { replace: true })
    }, 300)
    return () => clearTimeout(t)
  }, [text, onChange])

  return (
    <form
      role="search"
      className="flex flex-col gap-3 sm:flex-row"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="flex-1">
        <label htmlFor="q" className="sr-only">
          Buscar NFTs
        </label>
        <input
          id="q"
          type="search"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Buscar por nome, coleção ou criador"
          className={`${field} w-full`}
        />
      </div>

      <div>
        <label htmlFor="category" className="sr-only">
          Categoria
        </label>
        <select
          id="category"
          value={category ?? ''}
          onChange={(e) => onChange({ category: e.target.value || undefined, page: undefined })}
          className={field}
        >
          <option value="">Todas as categorias</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="sort" className="sr-only">
          Ordenar por
        </label>
        <select
          id="sort"
          value={sort}
          onChange={(e) =>
            onChange({ sort: e.target.value === 'recent' ? undefined : (e.target.value as Sort), page: undefined })
          }
          className={field}
        >
          {SORTS.map((s) => (
            <option key={s} value={s}>
              {SORT_LABELS[s]}
            </option>
          ))}
        </select>
      </div>
    </form>
  )
}
