import { Skeleton } from '@/components/ui/skeleton'

// Mesmas dimensões do NftCard, para o layout não "pular" quando os dados chegam.
export function NftCardSkeleton() {
  return (
    <div className="rounded-lg bg-card p-3" aria-hidden="true">
      <Skeleton className="aspect-square w-full" />
      <div className="mt-3 space-y-1">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-5 w-1/3" />
      </div>
    </div>
  )
}