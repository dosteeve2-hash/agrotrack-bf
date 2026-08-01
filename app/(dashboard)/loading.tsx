import { SkeletonCard, SkeletonMeteo, SkeletonTableRow } from '@/components/ui/Skeleton';

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6 p-1">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>

      {/* Météo */}
      <SkeletonMeteo />

      {/* Graphique parcelles */}
      <div className="rounded-2xl h-52 bg-white/5 border border-white/5 animate-pulse" />

      {/* Liste collectes */}
      <div className="rounded-2xl p-4 border border-white/5 animate-pulse" style={{ background: '#0D1E38' }}>
        <div className="h-5 w-36 rounded-lg bg-white/10 mb-4" />
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonTableRow key={i} />
        ))}
      </div>
    </div>
  );
}
