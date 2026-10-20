import { z } from 'zod'

export const SORTS = ['recent', 'price_asc', 'price_desc', 'name'] as const
export type Sort = (typeof SORTS)[number]

export const SORT_LABELS: Record<Sort, string> = {
    recent: 'Mais recentes',
    price_asc: 'Menor preço',
    price_desc: 'Maior preço',
    name: 'Nome (A-Z)',
}


// valore invalidos na url (nao quebra pagina)
export const CatalogSearchSchema = z.object({
    q: z.coerce.string().trim().min(1).optional().catch(undefined),
    category: z.coerce.string().min(1).optional().catch(undefined),
    sort: z.enum(SORTS).optional().catch(undefined),
    page: z.coerce.number().int().min(1).optional().catch(undefined),
})
export type CatalogSearch = z.infer<typeof CatalogSearchSchema>

//Paramentos da api
export type CatalogQuery = {
    q?: string
    category?: string
    sort: Sort
    page: number
    pageSize: number
}

export const PAGE_SIZE = 12