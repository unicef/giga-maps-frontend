import { useStore } from 'effector-react';
import { ChevronDown, ChevronUp, Earth, Search, X } from 'lucide-react';
import { type CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { $entityRegistryFiltered, selectAllEntityTypes } from '~/@/entities/models/entity.model';
import { EntityType } from '~/@/entities/types/base-entity.type';
import FooterTourContact from '~/@/sidebar/ui/common-components/footer-tour-contact.view';
import { SearchCountryList } from '~/@/sidebar/ui/search-result/search-country-list';
import SearchSchoolPanel from '~/@/sidebar/ui/search-result/search-country-list/search-school-panel-view';
import { SearchResultScroll } from '~/@/sidebar/ui/search-result/styles/search-result-style';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Popover, PopoverAnchor, PopoverContent } from '~/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import { $isMobile } from '~/core/media-query';
import { mapOverview } from '~/core/routes';
import { $theme, ThemeType } from '~/core/theme.model';
import { cn } from '~/lib/cn';
import { getVoid } from '~/lib/effector-kit';
import { getInputValue } from '~/lib/event-reducers';
import { useRoute } from '~/lib/router';

import { $isActiveSearchBar, $searchInput, $selectedSearchEntityTags, $showCountries, changeIsSearchFocused, changeSearchText, clearSearchText, onShowCountriesAdminList, toggleSearchEntityTag } from './top-search-bar.model';


const onChange = changeSearchText.prepend(getInputValue);
const onClear = clearSearchText.prepend(getVoid);

const TopSearchBar = () => {
  const isMobile = useStore($isMobile);
  const searchText = useStore($searchInput);
  const isActiveSearchBar = useStore($isActiveSearchBar);
  const showCountries = useStore($showCountries)
  const entityRegistry = useStore($entityRegistryFiltered);
  const selectedTags = useStore($selectedSearchEntityTags);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchShellRef = useRef<HTMLDivElement>(null);
  const [dropdownWidth, setDropdownWidth] = useState(0);
  const { t } = useTranslation();
  const isGlobalView = useRoute(mapOverview);
  const isLight = useStore($theme) === ThemeType.light;
  const searchFill = isLight ? '#f4f4f4' : '#242424';
  const idleBorder = isLight ? '#c6c6c6' : '#161616';
  const activeBorder = '#0f62fe';
  // Independent focus: blue on search OR world icon, never both
  const searchBorder = isActiveSearchBar && !showCountries ? activeBorder : idleBorder;
  const countryTriggerBorder = showCountries ? activeBorder : idleBorder;
  const countriesPanelBg = isLight ? '#f4f4f4' : '#242424';

  const entityTagEntries = useMemo(
    () => Object.values(entityRegistry).filter((config) => config.active),
    [entityRegistry],
  );

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');

  const selectedTagConfigs = selectedTags
    .map((tag) => entityRegistry[tag])
    .filter(Boolean);

  const filteredSuggestions = useMemo(() => {
    if (!showSuggestions) return [];
    const query = mentionQuery.toLowerCase();
    return entityTagEntries.filter((config) => {
      //debugger;
      if (selectedTags.includes(config.type)) return false;
      const slug = config.slug.toLowerCase();
      const name = config.displayName.toLowerCase();
      const translated = t(config.slug).toLowerCase();
      return !query || slug.includes(query) || name.includes(query) || translated.includes(query);
    });
  }, [showSuggestions, mentionQuery, entityTagEntries, selectedTags, t]);

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

  useEffect(() => {
    if (!isGlobalView || isMobile) return;

    const input = document.getElementById('main-search-bar') as HTMLInputElement | null;
    if (!input) return;

    input.focus();
    changeIsSearchFocused(true);
  }, [isGlobalView, isMobile]);

  const onBlurSearch = (e: React.FocusEvent<HTMLInputElement>) => {
    // Check if the newly focused element is inside our search results
    const relatedTarget = e.relatedTarget as HTMLElement;
    const searchResults = document.querySelector('.search-results-container');

    const isInsideResults = searchResults?.contains(relatedTarget) || searchResults?.matches(':hover');
    const isInsideContainer = searchContainerRef.current?.contains(relatedTarget);

    if (!isInsideResults && !isInsideContainer) {
      setTimeout(() => {
        changeIsSearchFocused(false);
        setShowSuggestions(false);
      }, 0);
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const mentionMatch = value.match(/@([\w-]*)$/);
    if (mentionMatch) {
      setMentionQuery(mentionMatch[1]);
      setShowSuggestions(true);
    } else {
      setMentionQuery('');
      setShowSuggestions(false);
    }
    onChange(e);
  };

  const handleSelectEntityTag = (entityType: EntityType) => {
    toggleSearchEntityTag(entityType);
    const newText = searchText.replace(/@[\w-]*$/, '').trim();
    changeSearchText(newText);
    setShowSuggestions(false);
    setMentionQuery('');
    document.getElementById('main-search-bar')?.focus();
  };

  const handleRemoveTag = (entityType: EntityType) => {
    toggleSearchEntityTag(entityType);
    document.getElementById('main-search-bar')?.focus();
  };

  const dropdownButton = (
    <button
      aria-expanded={showCountries}
      aria-label={t('country-list')}
      className={cn(
        'main-search-list relative! z-1! flex! h-12! w-12! shrink-0! items-center! justify-center! gap-0.5! rounded-l-lg! border-0! px-2! py-0! text-foreground! shadow-[inset_0_0_0_1px_var(--country-trigger-border)] focus:outline-none!',
        ''
      )}
      style={{
        backgroundColor: searchFill,
        '--country-trigger-border': countryTriggerBorder,
      } as CSSProperties}
      onClick={() => {
        changeIsSearchFocused(false);
        document.getElementById('main-search-bar')?.blur();
        onShowCountriesAdminList(!showCountries);
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
      <Popover
        open={showCountries}
        onOpenChange={(open) => {
          onShowCountriesAdminList(open);
          if (open) {
            changeIsSearchFocused(false);
            document.getElementById('main-search-bar')?.blur();
          }
        }}
      >
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
              className="sidebar-searchbox relative! min-w-0! flex-1! rounded-r-lg! shadow-[inset_0_0_0_1px_var(--search-shell-border)]!"
              style={{
                backgroundColor: searchFill,
                '--search-shell-border': searchBorder,
              } as CSSProperties}
            >
              <div className="flex! h-12! items-center!">
                {selectedTagConfigs.map((config) => (
                  <Badge
                    key={config.type}
                    className="ml-1! shrink-0! cursor-default! rounded-md! bg-primary border-0! px-1.5! py-1! text-[11px]! font-medium! text-white!"
                  >
                    {t(config.slug, { defaultValue: config.displayName })}
                    {/* <button
                      type="button"
                      aria-label={t('remove-tag', { defaultValue: 'Remove filter' })}
                      className="ml-0.5! inline-flex! items-center! opacity-80! hover:opacity-100!"
                      onClick={() => handleRemoveTag(config.type as EntityType)}
                    >
                      <X size={10} />
                    </button> */}
                  </Badge>
                ))}
                <Input
                  aria-label={t('search-country-region-school-id')}
                  autoCapitalize="none"
                  autoComplete="off"
                  autoFocus={!isMobile}
                  autoCorrect="off"
                  spellCheck={false}
                  className="h-12! min-w-0! flex-1! border-0! bg-transparent! pl-3.5! pr-10! text-[0.9375rem]! font-normal! leading-5! text-foreground! caret-[#0f62fe]! shadow-none! placeholder:text-[12px]! placeholder:font-normal! placeholder:leading-5! placeholder:text-muted-foreground! focus-visible:ring-0! focus-visible:ring-offset-0!"
                  id="main-search-bar"
                  inputMode="search"
                  onBlur={onBlurSearch}
                  onChange={handleSearchChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setShowSuggestions(false);
                      setMentionQuery('');
                    }
                    if (e.key === 'Backspace' && !searchText && selectedTags.length > 0) {
                      handleRemoveTag(selectedTags[selectedTags.length - 1]);
                    }
                    if (e.key === 'Enter' && showSuggestions && filteredSuggestions.length > 0) {
                      e.preventDefault();
                      handleSelectEntityTag(filteredSuggestions[0].type as EntityType);
                    }
                  }}
                  onFocus={() => {
                    onShowCountriesAdminList(false);
                    changeIsSearchFocused(true);
                  }}
                  placeholder={selectedTagConfigs.length > 0 ? '' : t("search-country-region-school-id")}
                  value={searchText}
                />
                {!searchText && selectedTags.length === 0 ? (
                  <Search
                    size={16}
                    className="pointer-events-none! absolute! right-3.5! top-1/2! shrink-0! -translate-y-1/2! text-foreground!"
                  />
                ) : null}
              </div>
              <Button
                aria-label={t('clear-search')}
                variant={'icon'}
                className={cn(
                  'main-search-list absolute! right-0! top-0! z-1! h-12! w-12! shrink-0! items-center! justify-center! rounded-r-lg! border-0! bg-transparent! px-2! py-0! text-foreground!',
                  !searchText && selectedTags.length === 0 && 'hidden!'
                )}
                onClick={() => {
                  onClear();
                  changeIsSearchFocused(false);
                  setShowSuggestions(false);
                  setMentionQuery('');
                }}
              >
                <X size={16} className="text-foreground!" />
              </Button>

              {/* @ mention entity type suggestions */}
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute! left-0! right-0! top-full! z-50! mt-1! overflow-hidden! rounded-lg! border! border-[#e0e0e0]! bg-white! py-1! shadow-lg!">
                  <div className="px-3! py-1.5! text-[11px]! font-medium! uppercase! tracking-wider! text-[#8d8d8d]!">
                    {t('filter-by-type', { defaultValue: 'Filter by type' })}
                  </div>
                  {filteredSuggestions.map((config) => (
                    <button
                      key={config.type}
                      id={`entity-suggest-${config.slug}`}
                      className="flex! w-full! items-center! gap-2! px-3! py-2! text-left! text-sm! text-[#161616]! transition-colors! hover:bg-[#e8e8e8]! focus:bg-[#e8e8e8]! focus:outline-none!"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleSelectEntityTag(config.type as EntityType)}
                      type="button"
                    >
                      <span className="text-primary">{config.symbol}</span>
                      <span>@{t(config.slug, { defaultValue: config.displayName })}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </PopoverAnchor>
        <PopoverContent
          align="start"
          className="relative z-60 rounded-lg border-0 bg-transparent p-0 shadow-none outline-none!"
          side="bottom"
          sideOffset={2}
          style={{ width: dropdownWidth ? `${dropdownWidth}px` : undefined, maxWidth: 'calc(100vw - 2rem)' }}
        >
          <div
            className={cn(
              'countries-browse-panel overflow-hidden! rounded-lg!',
              !isLight && '[&_.search-container]:!bg-[#242424] [&_p]:!bg-[#242424]',
            )}
            style={{
              border: `1px solid ${isLight ? '#e0e0e0' : '#393939'}`,
              backgroundColor: countriesPanelBg,
            }}
          >
            <SearchResultScroll
              className="search-container max-h-[calc(80vh-6.5rem)]"
              style={{ backgroundColor: countriesPanelBg }}
            >
              <SearchCountryList />
            </SearchResultScroll>
            <div
              style={{ backgroundColor: countriesPanelBg }}
              className={cn(!isLight && '[&>div]:!bg-[#242424]')}
            >
              <FooterTourContact message={t("not-the-results-you-expected")} />
            </div>
          </div>
          <SearchSchoolPanel />
        </PopoverContent>
      </Popover>
    </div >
  );
};

export default TopSearchBar;
