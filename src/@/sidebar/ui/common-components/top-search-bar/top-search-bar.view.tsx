import { useStore } from 'effector-react';
import { ChevronDown, ChevronUp, Earth, Search, X } from 'lucide-react';
import { type CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { $entityRegistryFiltered, selectAllEntityTypes } from '~/@/entities/models/entity.model';
import { EntityType } from '~/@/entities/types/base-entity.type';
import FooterTourContact from '~/@/sidebar/ui/common-components/footer-tour-contact.view';
import { $selectedPlace } from '~/@/sidebar/ui/search-result/container/search-result.model';
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
import { cn } from '~/lib/cn';
import { getVoid } from '~/lib/effector-kit';
import { useRoute } from '~/lib/router';

import { $isActiveSearchBar, $isSearchTextDirty, $searchInput, $selectedSearchEntityTags, $showCountries, changeIsSearchFocused, changeSearchText, clearSearchText, onShowCountriesAdminList, searchInputBlurred, searchTextTyped, toggleSearchEntityTag } from './top-search-bar.model';


const onClear = clearSearchText.prepend(getVoid);

const entitiesSelectedKeyByType: Partial<Record<EntityType, string>> = {
  [EntityType.SCHOOL]: 'search-schools-selected',
  [EntityType.HEALTH]: 'search-health-selected',
};

const TopSearchBar = () => {
  const isMobile = useStore($isMobile);
  const searchText = useStore($searchInput);
  const isSearchTextDirty = useStore($isSearchTextDirty);
  const selectedPlace = useStore($selectedPlace);
  const isActiveSearchBar = useStore($isActiveSearchBar);
  const showCountries = useStore($showCountries)
  const entityRegistry = useStore($entityRegistryFiltered);
  const selectedTags = useStore($selectedSearchEntityTags);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchShellRef = useRef<HTMLDivElement>(null);
  const keepSelectionOnClickRef = useRef(false);
  const [dropdownWidth, setDropdownWidth] = useState(0);
  const { t } = useTranslation();
  const isGlobalView = useRoute(mapOverview);
  const searchFillClass = 'bg-filter-field!';
  const idleBorder = 'var(--giga-border)';
  const activeBorder = '#0f62fe';
  const searchBorder = isActiveSearchBar && !showCountries ? activeBorder : idleBorder;
  const countryTriggerBorder = showCountries ? activeBorder : idleBorder;

  const entityTagEntries = useMemo(
    () => Object.values(entityRegistry).filter((config) => config.active),
    [entityRegistry],
  );

  const selectedPlaceLabel = useMemo(() => {
    if (!selectedPlace) return '';
    const country = t(selectedPlace.countryName);
    if (selectedPlace.kind === 'country' || selectedPlace.kind === 'entity-pending') return country;
    const name = selectedPlace.kind === 'entities'
      ? t(
        (selectedPlace.entityType && entitiesSelectedKeyByType[selectedPlace.entityType])
        ?? 'search-entities-selected',
        { count: selectedPlace.count },
      )
      : selectedPlace.name;
    return t('search-selected-place', { country, name });
  }, [selectedPlace, t]);

  const displayValue = isSearchTextDirty ? searchText : selectedPlaceLabel;

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
        searchInputBlurred();
      }, 0);
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // drop the label if the caret left it in
    const value = isSearchTextDirty
      ? e.target.value
      : e.target.value.replace(selectedPlaceLabel, '');
    const mentionMatch = value.match(/@([\w-]*)$/);
    if (mentionMatch) {
      setMentionQuery(mentionMatch[1]);
      setShowSuggestions(true);
    } else {
      setMentionQuery('');
      setShowSuggestions(false);
    }
    searchTextTyped(value);
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
        searchFillClass,
      )}
      style={{
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
              className={cn(
                'sidebar-searchbox relative! min-w-0! flex-1! rounded-r-lg! shadow-[inset_0_0_0_1px_var(--search-shell-border)]!',
                searchFillClass,
              )}
              style={{
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
                  onFocus={(e) => {
                    onShowCountriesAdminList(false);
                    changeIsSearchFocused(true);
                    if (!isSearchTextDirty && displayValue) {
                      e.currentTarget.select();
                      keepSelectionOnClickRef.current = true;
                    }
                  }}
                  onMouseUp={(e) => {
                    if (keepSelectionOnClickRef.current) {
                      e.preventDefault();
                      keepSelectionOnClickRef.current = false;
                    }
                  }}
                  placeholder={selectedTagConfigs.length > 0 ? '' : t("search-country-region-school-id")}
                  value={displayValue}
                />
                {!displayValue && selectedTags.length === 0 ? (
                  <Search
                    size={16}
                    className="pointer-events-none! absolute! right-3.5! top-1/2! shrink-0! -translate-y-1/2! text-foreground!"
                  />
                ) : null}
              </div>
              <Button
                aria-label={t('clear-search-input')}
                variant={'icon'}
                className={cn(
                  'main-search-list absolute! right-0! top-0! z-1! h-12! w-12! shrink-0! items-center! justify-center! rounded-r-lg! border-0! bg-transparent! px-2! py-0! text-foreground!',
                  !displayValue && selectedTags.length === 0 && 'hidden!'
                )}
                onClick={() => {
                  const wasShowingSelection = !isSearchTextDirty && !!selectedPlace;
                  onClear();
                  changeIsSearchFocused(false);
                  setShowSuggestions(false);
                  setMentionQuery('');
                  if (wasShowingSelection) mapOverview.navigate();
                }}
              >
                <X size={16} className="text-foreground!" />
              </Button>

              {/* @ mention entity type suggestions */}
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute! left-0! right-0! top-full! z-50! mt-1! overflow-hidden! rounded-lg! border! border-border! bg-popover! py-1! shadow-lg!">
                  <div className="px-3! py-1.5! text-[11px]! font-medium! uppercase! tracking-wider! text-muted-foreground!">
                    {t('filter-by-type', { defaultValue: 'Filter by type' })}
                  </div>
                  {filteredSuggestions.map((config) => (
                    <button
                      key={config.type}
                      id={`entity-suggest-${config.slug}`}
                      className="flex! w-full! items-center! gap-2! px-3! py-2! text-left! text-sm! text-foreground! transition-colors! hover:bg-surface-elevated! focus:bg-surface-elevated! focus:outline-none!"
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
          className="relative z-6003 rounded-lg border-0 bg-transparent p-0 shadow-none outline-none!"
          side="bottom"
          sideOffset={2}
          style={{ width: dropdownWidth ? `${dropdownWidth}px` : undefined, maxWidth: 'calc(100vw - 2rem)' }}
        >
          <div className="countries-browse-panel overflow-hidden! rounded-lg! border! border-border! bg-surface-panel! [&_.search-container]:bg-surface-panel! [&>div]:bg-surface-panel!">
            <SearchResultScroll className="search-container max-h-[calc(80vh-6.5rem)] bg-surface-panel!">
              <SearchCountryList />
            </SearchResultScroll>
            <div className="bg-surface-panel! [&>div]:bg-surface-panel!">
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
