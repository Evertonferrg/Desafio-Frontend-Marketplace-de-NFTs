import { Skeleton } from '@/components/ui/skeleton'

export function NftCardSkeleton() {
    return (
        <div className="overflow-hidden rounded-x1 border bg-card" aria-hidden="true">
            <Skeleton className="aspect-square w-full rounded-none" />
            <div className="space-y-2 p-3">
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/4" />
            </div>
        </div>
    )
}