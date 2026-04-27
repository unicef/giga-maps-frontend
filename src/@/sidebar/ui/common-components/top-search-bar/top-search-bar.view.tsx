import { useStore } from 'effector-react';
import { type CSSProperties, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import FooterTourContact from '~/@/sidebar/ui/common-components/footer-tour-contact.view';
import { SearchCountryList } from '~/@/sidebar/ui/search-result/search-country-list';
import SearchSchoolPanel from '~/@/sidebar/ui/search-result/search-country-list/search-school-panel-view';
import { SearchResultScroll } from '~/@/sidebar/ui/search-result/styles/search-result-style';
import { Input } from '~/components/ui/input';
import { Popover, PopoverAnchor, PopoverContent } from '~/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import { $isMobile } from '~/core/media-query';
import { cn } from '~/lib/cn';
import { getVoid } from '~/lib/effector-kit';
import { getInputValue } from '~/lib/event-reducers';

import { $isActiveSearchBar, $searchInput, $showCountries, changeIsSearchFocused, changeSearchText, clearSearchText, onShowCountriesAdminList } from './top-search-bar.model';
import { ChevronDown, ChevronUp, Cross, Earth, Search, X } from 'lucide-react';
import { Button } from '~/components/ui/button';


const onChange = changeSearchText.prepend(getInputValue);
const onClear = clearSearchText.prepend(getVoid);

const TopSearchBar = () => {
  const searchText = useStore($searchInput);
  const isActiveSearchBar = useStore($isActiveSearchBar);
  const showCountries = useStore($showCountries)
  const isMobile = useStore($isMobile)
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchShellRef = useRef<HTMLDivElement>(null);
  const [dropdownWidth, setDropdownWidth] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    const updateWidth = () => {
      const shellWidth = searchShellRef.current?.offsetWidth ?? 0;
      setDropdownWidth(shellWidth);
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);

    return () => {
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  const onBlurSearch = (e: React.FocusEvent<HTMLInputElement>) => {
    // Check if the newly focused element is inside our search results
    const relatedTarget = e.relatedTarget as HTMLElement;
    const searchResults = document.querySelector('.search-results-container');

    const isInsideResults = searchResults?.contains(relatedTarget) || searchResults?.matches(':hover');
    const isInsideContainer = searchContainerRef.current?.contains(relatedTarget);

    if (!isInsideResults && !isInsideContainer) {
      setTimeout(() => changeIsSearchFocused(false), 0);
    }
  }

  const dropdownButton = (
    <button
      aria-expanded={showCountries}
      aria-label={t('country-list')}
      className={cn(
        'main-search-list relative! z-1! flex! h-12! w-12! shrink-0! items-center! justify-center! gap-0.5! rounded-l-lg! border-0! bg-[#e8e8e8]! px-2! py-0! shadow-[inset_0_0_0_1px_var(--country-trigger-border)] focus:outline-none!',
        ''
      )}
      onClick={() => {
        changeIsSearchFocused(false)
        onShowCountriesAdminList(!showCountries)
      }}
      type="button"
    >
      <Earth size={18} />
      {showCountries ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
    </button>
  );

  return (
    <div
      className={cn(
        'top-search-bar mt-2! flex! h-12! items-center! gap-0! bg-transparent! px-3.5!',
        'max-md:w-full!',
      )}
      ref={searchContainerRef}
    >
      <Popover open={showCountries} onOpenChange={onShowCountriesAdminList}>
        <PopoverAnchor asChild>
          <div className="flex! min-w-0! flex-1! items-center! gap-0!" ref={searchShellRef}>
            <TooltipProvider>
              {showCountries ? dropdownButton : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    {dropdownButton}
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    sideOffset={4}
                  >
                    {t('country-list')}
                  </TooltipContent>
                </Tooltip>
              )}
            </TooltipProvider>
            <div
              className="sidebar-searchbox relative! min-w-0! flex-1! rounded-r-lg! bg-[#f4f4f4]! shadow-[inset_0_0_0_1px_var(--search-shell-border)]!"
              style={{ '--search-shell-border': isActiveSearchBar ? '#0f62fe' : '#c6c6c6' } as CSSProperties}
            >
              <Search size={16} className="pointer-events-none! absolute! left-3.5! top-1/2! z-1! -translate-y-1/2!" />
              <Input
                aria-label={t('search-country-region-school-id')}
                autoCapitalize="none"
                autoComplete="off"
                autoFocus={isMobile}
                autoCorrect="off"
                spellCheck={false}
                className="h-12! border-0! bg-transparent! px-11! pr-11! text-[0.9375rem]! font-normal! leading-5! text-[#161616]! shadow-none! placeholder:text-[12px]! placeholder:font-normal! placeholder:leading-5! placeholder:text-[#8d8d8d]! focus-visible:ring-0! focus-visible:ring-offset-0!"
                id="main-search-bar"
                inputMode="search"
                onBlur={onBlurSearch}
                onChange={onChange}
                onFocus={() => {
                  onShowCountriesAdminList(false);
                  changeIsSearchFocused(true);
                }}
                placeholder={t("search-country-region-school-id")}
                value={searchText}
              />
              <Button
                aria-label={t('clear-search')}
                variant={'icon'}
                className={cn(
                  'main-search-list absolute! right-0! top-0! z-1! h-12! w-12! shrink-0! items-center! justify-center! rounded-r-lg! border-0! bg-transparent! px-2! py-0!',
                  !searchText && 'hidden!'
                )}
                onClick={() => {
                  onClear();
                  changeIsSearchFocused(false);
                }}
              >
                <X size={16} className="fill-current" />
              </Button>
            </div>
          </div>
        </PopoverAnchor>
        <PopoverContent
          align="start"
          className="z-60 rounded-lg border border-primary bg-[#161616] p-0 shadow-xs"
          side="bottom"
          sideOffset={2}
          style={{ width: dropdownWidth ? `${dropdownWidth}px` : undefined, maxWidth: 'calc(100vw - 2rem)' }}
        >
          <SearchResultScroll className="search-container max-h-[calc(80vh-4.5rem)] bg-[#161616]">
            <SearchCountryList />
          </SearchResultScroll>
          <FooterTourContact message={t("not-the-results-you-expected")} />
          <SearchSchoolPanel />
        </PopoverContent>
      </Popover>
    </div >
  );
};

export default TopSearchBar;
