import { Skeleton } from '@/components/ui/skeleton'

export function NftDetailSkeleton() {
  return (
    <div className="grid gap-8 md:grid-cols-2" aria-hidden="true">
      <div className="space-y-3">
        <Skeleton className="aspect-square w-full rounded-xl" />
        <div className="flex gap-2">
          <Skeleton className="h-16 w-16 rounded-lg" />
          <Skeleton className="h-16 w-16 rounded-lg" />
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )
}