import { Close } from '@carbon/icons-react';
import {
  MouseEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import {
  getVisibleChipCountForRows,
  type FilterChip,
} from './filter-chip-utils';

const CHIP_GAP_PX = 8;
const MAX_CHIP_ROWS = 2;

const chipClassName =
  'flex! items-center! gap-1! bg-[#0f62fe]! text-white! rounded-md! h-[22px]! px-2! text-[12px]! leading-[18px]! cursor-pointer!';

const toggleClassName =
  'flex! items-center! bg-[#393939]! text-white! rounded-md! h-[22px]! px-2! text-[12px]! leading-[18px]! cursor-pointer!';

type CollapsibleFilterChipsProps = {
  chips: FilterChip[];
  selectedCount: number;
  isExpanded: boolean;
  onClearChip: (chip: FilterChip, e: MouseEvent) => void;
  onToggleExpanded: (expanded: boolean) => void;
};

const CollapsibleFilterChips = ({
  chips,
  selectedCount,
  isExpanded,
  onClearChip,
  onToggleExpanded,
}: CollapsibleFilterChipsProps) => {
  const measureRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(chips.length);

  const measureVisibleCount = useCallback(() => {
    const measureRoot = measureRef.current;
    if (!measureRoot) return;

    const chipNodes = Array.from(
      measureRoot.querySelectorAll<HTMLElement>('[data-measure-chip]'),
    );
    const toggleNode = measureRoot.querySelector<HTMLElement>('[data-measure-toggle]');
    const chipWidths = chipNodes.map((node) => node.offsetWidth);
    const toggleWidth = toggleNode?.offsetWidth ?? 0;

    setVisibleCount(getVisibleChipCountForRows({
      chipWidths,
      containerWidth: measureRoot.clientWidth,
      toggleWidth,
      gap: CHIP_GAP_PX,
      maxRows: MAX_CHIP_ROWS,
    }));
  }, []);

  useLayoutEffect(() => {
    measureVisibleCount();
  }, [chips, selectedCount, measureVisibleCount]);

  useEffect(() => {
    const measureRoot = measureRef.current;
    if (!measureRoot || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(() => {
      measureVisibleCount();
    });
    observer.observe(measureRoot);
    return () => observer.disconnect();
  }, [measureVisibleCount]);

  const hasOverflow = visibleCount < chips.length;
  const visibleChips = isExpanded ? chips : chips.slice(0, visibleCount);

  return (
    <div className="relative! w-full!">
      <div
        ref={measureRef}
        aria-hidden
        className="pointer-events-none! invisible! absolute! inset-x-0! top-0! -z-10! flex! flex-wrap! gap-2!"
      >
        {chips.map((chip) => (
          <span
            key={`measure-${chip.chipId}`}
            data-measure-chip
            className={chipClassName}
          >
            <span className="truncate!">{chip.label}</span>
            <Close size={12} className="fill-current!" />
          </span>
        ))}
        <span data-measure-toggle className={toggleClassName}>
          Show all {selectedCount}
        </span>
      </div>

      <div className="flex! flex-wrap! items-center! gap-2!">
        {visibleChips.map((chip) => (
          <button
            key={chip.chipId}
            type="button"
            className={chipClassName}
            onClick={(e) => onClearChip(chip, e)}
          >
            <span className="truncate!">{chip.label}</span>
            <Close size={12} className="fill-current!" />
          </button>
        ))}
        {!isExpanded && hasOverflow && (
          <button
            type="button"
            className={toggleClassName}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleExpanded(true);
            }}
          >
            Show all {selectedCount}
          </button>
        )}
        {isExpanded && hasOverflow && (
          <button
            type="button"
            className={toggleClassName}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleExpanded(false);
            }}
          >
            Show less
          </button>
        )}
      </div>
    </div>
  );
};

export default CollapsibleFilterChips;
