import { Button } from '@/components/ui/button'

type Props = { page: number; totalPages: number; onPage: (page: number) => void }

export function Pagination({ page, totalPages, onPage }: Props) {
    if (totalPages <= 1) return null
    return (
        <nav aria-label="Paginação" className="flex items-center justify-center gap-4">
            <Button variant="outline" disabled={page <= 1} onClick={() => onPage(page - 1)}>
                Anterior
            </Button>
            <span className="text-sm" aria-current="page">
                Página {page} de {totalPages}
            </span>
            <Button variant="outline" disabled={page >= totalPages} onClick={() => onPage(page + 1)}>
                Próxima
            </Button>
        </nav>
    )

}