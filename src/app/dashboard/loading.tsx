import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLoading() {
  return (
    <div role="status" aria-busy="true" aria-live="polite" className="space-y-6 p-6">
      {/* Header skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
      
      {/* Quick actions skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      
      {/* Metrics skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
    </div>
  );
}
