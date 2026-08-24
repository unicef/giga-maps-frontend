import { Skeleton } from '~/components/ui/skeleton';

export function SingleEntityDetailSkeleton() {
  return (
    <div className="min-w-0! px-4! py-6!">
      <Skeleton className="mb-3! h-7! w-3/4!" />
      <div className="relative! flex! w-full! flex-col! gap-3! pb-6! pt-1!">
        <Skeleton className="h-3.5! w-40!" />
        <Skeleton className="h-10! w-44!" />
        <Skeleton className="h-2! w-full!" />
      </div>
      <div className="space-y-3! pt-5!">
        <Skeleton className="h-4! w-32!" />
        <Skeleton className="h-3.5! w-4/5!" />
        <Skeleton className="h-3.5! w-3/5!" />
        <Skeleton className="h-3.5! w-2/3!" />
      </div>
    </div>
  );
}

export function EntityDetailSkeleton({ count = 1 }: { count?: number }) {
  const skeletonCount = Math.min(Math.max(count, 2), 4);

  return (
    <div className="space-y-3! px-3.5! py-3!">
      {Array.from({ length: skeletonCount }).map((_, index) => (
        <div key={index} className="rounded-lg! border! border-border! p-3!">
          <div className="mb-3! flex! items-center! gap-3!">
            <Skeleton className="size-5! shrink-0! rounded-sm!" />
            <Skeleton className="h-4! flex-1!" />
            <Skeleton className="size-2.5! shrink-0! rounded-full!" />
            <Skeleton className="size-4! shrink-0!" />
          </div>
          <div className="grid! grid-cols-2! gap-x-4! gap-y-2!">
            <Skeleton className="h-3.5! w-full!" />
            <Skeleton className="h-3.5! w-full!" />
            <Skeleton className="col-span-2! h-3.5! w-3/5!" />
          </div>
        </div>
      ))}
    </div>
  );
}
