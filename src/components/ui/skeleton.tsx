import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

// A animação de shimmer está na classe .skeleton (src/index.css)
function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="skeleton" className={cn('skeleton rounded-md', className)} {...props} />
}

export { Skeleton }