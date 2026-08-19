import { Skeleton } from '~/components/ui/skeleton';

export const SchoolPopupLoading = () => {
  return (
    <div className="popup-template-loading">
      <div className="relative! flex! w-[300px]! flex-col! gap-3! rounded-xl! border! border-gray-800! bg-gray-900! p-4! shadow-xl!">
        {/* Header Skeleton */}
        <div className="flex! items-start! justify-between! gap-3!">
          <Skeleton className="h-7! w-3/4! rounded-md!" />
          <Skeleton className="size-4! rounded-sm!" />
        </div>

        {/* Metrics Skeleton */}
        <div className="flex! flex-col! gap-1.5!">
          <div className="flex! items-center! gap-2!">
            <Skeleton className="size-4! rounded-full!" />
            <Skeleton className="h-5! w-16! rounded!" />
            <Skeleton className="h-5! w-20! rounded-md!" />
          </div>
          <Skeleton className="h-5! w-40! rounded!" />
        </div>

        {/* Data Source Skeleton */}
        <div className="flex! flex-col! gap-2! pt-1!">
          <Skeleton className="h-4! w-24! rounded!" />
          <div className="flex! gap-2!">
            <Skeleton className="h-6! w-16! rounded-md!" />
            <Skeleton className="h-6! w-24! rounded-md!" />
            <Skeleton className="h-6! w-8! rounded-md!" />
          </div>
        </div>

        {/* Button Skeleton */}
        <Skeleton className="mt-1! h-9! w-full! rounded-full!" />
      </div>
    </div>
  );
};