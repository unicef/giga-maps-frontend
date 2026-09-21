import { useStore } from 'effector-react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '~/components/ui/button';

import { setSearchInMobile } from '../../common-components/top-search-bar/top-search-bar.model';
import { SCHOOL_LIST_PAGE_SIZE } from '../container/search-result.constant';
import { fetchSchoolListFx } from '../container/search-result.fx';
import {
  $schoolListCurrentPage,
  $searchAdminLevel2,
  $searchSchoolIds,
  $searchSchoolList,
  onSchoolListCurrentPage,
  resetSchoolSelection,
  triggerSearchApply,
} from '../container/search-result.model';

export const SearchButtonGroup = () => {
  const isExpanded = useStore($searchAdminLevel2);
  const { count = 0 } = useStore($searchSchoolList) ?? {};
  const currentPage = useStore($schoolListCurrentPage);
  const isLoading = useStore(fetchSchoolListFx.pending);
  const { size } = useStore<Set<string>>($searchSchoolIds);
  const { t } = useTranslation();

  if (!isExpanded) return null;

  const pageCount = Math.max(1, Math.ceil(count / SCHOOL_LIST_PAGE_SIZE));

  return (
    <div className="shrink-0!">
      <div className="flex! gap-2! p-2!">
        <Button
          className="h-10! flex-1! rounded-full! border-0! bg-secondary! text-sm! font-medium! text-secondary-foreground! shadow-none! hover:bg-surface-highlight! hover:shadow-sm!"
          data-testid="selected-school-close-button"
          disabled={!size}
          onClick={() => resetSchoolSelection()}
          size="lg"
          variant="secondary"
        >
          {t('clear-all-selected', { selected: size })}
        </Button>
        <Button
          className="h-10! flex-1! rounded-full! bg-primary! text-sm! font-medium! text-primary-foreground! hover:bg-primary/90! hover:shadow-sm!"
          data-testid="selected-school-apply-button"
          disabled={!size}
          onClick={() => {
            setSearchInMobile(false);
            triggerSearchApply();
          }}
          size="lg"
        >
          {t('apply')}
        </Button>
      </div>

      <div className="flex! items-center! justify-end! gap-2! bg-surface-panel-raised! px-4! py-2!">
        <div className="relative! flex! items-center!">
          <select
            aria-label={t('page')}
            className="cursor-pointer! appearance-none! bg-transparent! pr-5! text-xs! text-foreground! outline-none! disabled:cursor-not-allowed! disabled:opacity-60!"
            disabled={isLoading || pageCount <= 1}
            onChange={(event) =>
              onSchoolListCurrentPage(Number(event.target.value))
            }
            value={currentPage}
          >
            {Array.from({ length: pageCount }, (_, index) => (
              <option
                className="bg-surface-panel-raised! text-foreground!"
                key={index}
                value={index}
              >
                {index + 1}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none! absolute! right-0! text-foreground!"
            size={16}
          />
        </div>

        <span className="text-xs! text-foreground!">
          {t('of-page', { count: pageCount })}
        </span>

        <button
          aria-label={t('previous')}
          className="flex! size-4! items-center! justify-center! text-foreground! disabled:cursor-not-allowed! disabled:opacity-40!"
          disabled={isLoading || currentPage === 0}
          onClick={() => onSchoolListCurrentPage(currentPage - 1)}
          type="button"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          aria-label={t('next')}
          className="flex! size-4! items-center! justify-center! text-foreground! disabled:cursor-not-allowed! disabled:opacity-40!"
          disabled={isLoading || currentPage >= pageCount - 1}
          onClick={() => onSchoolListCurrentPage(currentPage + 1)}
          type="button"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
