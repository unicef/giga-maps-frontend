import { useStore } from 'effector-react';

import { cn } from '~/lib/cn';

import { $searchAdminLevel2 } from '../container/search-result.model';
import { SearchButtonGroup } from './search-button-group';
import SearchSchoolList from './search-school-list-view';

export default function SearchSchoolPanel() {
  const isExpanded = useStore($searchAdminLevel2);

  if (!isExpanded) return null;

  return (
    <div
      className={cn(
        'school-list-wrapper absolute! top-0! left-full! ml-2! flex! w-full! flex-col! overflow-clip! rounded-md! bg-surface-panel! shadow-md!',
        'h-[calc(100dvh-var(--search-panel-top-offset)-var(--search-panel-bottom-offset))]!',
        'max-md:fixed! max-md:inset-x-0! max-md:top-12! max-md:bottom-0! max-md:ml-0! max-md:h-auto!',
      )}
    >
      <SearchSchoolList />
      <SearchButtonGroup />
    </div>
  );
}
