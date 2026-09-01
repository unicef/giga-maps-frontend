import { Skeleton } from '~/components/ui/skeleton';

function DublicateSchoolLoader() {
  return (
    <div className="flex! flex-col! gap-2! border-b! border-border/60! py-3! last:border-b-0! dark:border-gray-800!">
      <div className="flex! items-start! justify-between! gap-2!">
        <Skeleton className="h-5! w-3/4! rounded!" />
        <Skeleton className="h-4! w-12! rounded!" />
      </div>
      <div className="flex! items-center! justify-between! gap-2!">
        <div className="flex! items-center! gap-2!">
          <Skeleton className="size-4! rounded-full!" />
          <Skeleton className="h-4! w-16! rounded!" />
        </div>
        <Skeleton className="size-7! rounded-full!" />
      </div>
    </div>
  );
}

export default DublicateSchoolLoader;