import { Skeleton } from '~/components/ui/skeleton';
import { cn } from '~/lib/cn';

import { LANDING_CONTAINER } from '../landing.constant';

// Every section renders null until the CMS responds, so without this the page
// is a blank screen for the length of the request. Mirrors the hero's real
// dimensions so nothing shifts when the content lands.
export const HeroSkeleton = () => (
  <section
    aria-hidden="true"
    className={cn(
      LANDING_CONTAINER,
      'py-16! tablet:py-24!',
      'tablet:flex! tablet:min-h-[calc(100vh-4rem)]! tablet:flex-col! tablet:justify-center!',
    )}
    data-slot="hero-skeleton"
  >
    <div className="grid! items-center! gap-12! tablet:grid-cols-2! tablet:gap-16!">
      <div className="flex! flex-col! items-start!">
        <Skeleton className="mb-4! h-10! w-full! max-w-[34rem]! bg-muted!" />
        <Skeleton className="mb-8! h-10! w-3/4! max-w-[26rem]! bg-muted!" />

        <Skeleton className="mb-10! h-5! w-full! max-w-[24rem]! bg-muted!" />

        <div className="flex! gap-8!">
          {[0, 1, 2].map((index) => (
            <div className="flex! flex-col! gap-2!" key={index}>
              <Skeleton className="h-8! w-24! bg-muted!" />
              <Skeleton className="h-4! w-20! bg-muted!" />
            </div>
          ))}
        </div>

        <Skeleton className="mt-10! h-12! w-48! rounded-full! bg-muted!" />
      </div>

      <Skeleton className="aspect-[824/719] hidden! w-full! bg-muted! tablet:block!" />
    </div>
  </section>
);
