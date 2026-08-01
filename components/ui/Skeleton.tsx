import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-xl bg-white/5 border border-white/5', className)}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div
      className={cn('rounded-2xl p-5 flex flex-col gap-4 border border-white/5', className)}
      style={{ background: '#0D1E38' }}
    >
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <Skeleton className="h-8 w-2/3" />
    </div>
  );
}

export function SkeletonTableRow() {
  return (
    <div className="flex items-center gap-3 animate-pulse py-2">
      <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
      <Skeleton className="flex-1 h-4" />
      <Skeleton className="w-24 h-4" />
      <Skeleton className="w-16 h-6 rounded-full" />
    </div>
  );
}

/** Skeleton météo pour AgroTrack */
export function SkeletonMeteo({ className }: SkeletonProps) {
  return (
    <div
      className={cn('rounded-2xl p-5 border border-white/5', className)}
      style={{ background: '#0D1E38' }}
    >
      <Skeleton className="h-5 w-28 mb-4 animate-pulse" />
      <div className="flex items-end gap-4">
        <Skeleton className="h-16 w-16 rounded-2xl animate-pulse" />
        <div className="flex-1 flex flex-col gap-2">
          <Skeleton className="h-8 w-1/3 animate-pulse" />
          <Skeleton className="h-4 w-1/2 animate-pulse" />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2 mt-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-14 rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}
