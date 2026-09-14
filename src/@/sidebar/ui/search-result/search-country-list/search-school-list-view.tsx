import { useStore } from 'effector-react';
import { Search, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { Input } from '~/components/ui/input';
import { ScrollArea } from '~/components/ui/scroll-area';

import { fetchSchoolListFx } from '../container/search-result.fx';
import {
  $schoolListCurrentPage,
  $searchSchoolList,
  $searchSchoolListValue,
  setSearchExpandLevel2,
  setSearchSchoolListValue,
} from '../container/search-result.model';
import { SearchSchool } from './search-school-item-view';

const SearchSchoolListPanel = () => {
  const { results: data } = useStore($searchSchoolList) ?? {};
  const isLoading = useStore(fetchSchoolListFx.pending);
  const searchValue = useStore($searchSchoolListValue);
  const isDone = useStore(fetchSchoolListFx.inFlight);
  const currentPage = useStore($schoolListCurrentPage);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isListEmpty = !data?.length && !isDone;
  const { t } = useTranslation();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [currentPage]);

  return (
    <div className="flex! min-h-0! flex-1! flex-col!">
      <div className="flex! shrink-0! items-center! justify-between! gap-2! px-4! py-3!">
        <p className="truncate! text-base! font-normal! text-foreground!">
          {t('school-list')}
        </p>
        <button
          aria-label={t('close')}
          className="shrink-0! cursor-pointer! text-foreground!"
          data-testid="close-school-list-icon"
          onClick={() => setSearchExpandLevel2('')}
          type="button"
        >
          <X size={24} />
        </button>
      </div>

      <div className="shrink-0! p-2!">
        <div className="relative!">
          <Input
            aria-label={t('search-schools')}
            className="h-10! w-full! rounded-md! border-0! bg-surface-field! pr-10! pl-4! text-xs! text-foreground! shadow-none! placeholder:text-xs! placeholder:text-muted-foreground! focus-visible:ring-0! focus-visible:ring-offset-0!"
            onChange={(event) => setSearchSchoolListValue(event.target.value)}
            placeholder={t('search-schools')}
            value={searchValue}
          />
          <Search
            className="pointer-events-none! absolute! top-1/2! right-4! -translate-y-1/2! text-muted-foreground!"
            size={16}
          />
        </div>
      </div>

      <ScrollArea
        className="min-h-0! flex-1!"
        viewportClassName="[&>div]:block!"
        viewportRef={scrollRef}
      >
        {isLoading && (
          <p className="p-4! text-sm! text-muted-foreground!">{t('loading')}</p>
        )}
        {isListEmpty && (
          <p className="flex! w-full! items-center! justify-center! p-4! text-sm! text-muted-foreground!">
            {t('not-found')}
          </p>
        )}
        {!isLoading && !!data?.length && (
          <div className="flex! flex-col! gap-4! p-4!">
            {data.map((school) => (
              <SearchSchool key={school.id} school={school} />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default SearchSchoolListPanel;
