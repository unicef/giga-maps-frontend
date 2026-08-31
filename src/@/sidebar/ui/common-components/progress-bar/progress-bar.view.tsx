import { useStore } from 'effector-react';
import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';

import { Skeleton } from '~/components/ui/skeleton';
import { Toggle } from '~/components/ui/toggle';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip';
import { $lng } from '~/core/i18n/store';
import { cn } from '~/lib/cn';
import { formatNumber } from '~/lib/utils';

type ProgressToggleProps = {
  disabled?: boolean;
  id?: string;
  onToggle?: () => void;
  toggled?: boolean;
};

type ProgressBarProps = {
  backColor?: string;
  classname?: string;
  colorType?: string;
  containerClassName?: string;
  isLoading?: boolean;
  label?: string;
  maxValue?: number;
  toggleID?: string;
  togglePresent?: boolean;
  toggleProps?: ProgressToggleProps;
  value?: number;
};

const ProgressBar = ({
  value = 0,
  maxValue = 0,
  label = '',
  colorType = '',
  toggleProps,
  backColor = '',
  isLoading = false,
  containerClassName,
  classname,
  toggleID,
}: ProgressBarProps) => {
  const safeProgress =
    maxValue > 0 && Number.isFinite(value / maxValue)
      ? Math.min(Math.max((value / maxValue) * 100, 0), 100)
      : 0;
  const hasToggle = !!toggleProps;
  const lng = useStore($lng);
  const { t } = useTranslation();
  const isToggled = !!toggleProps?.toggled;
  const toggleControlId = toggleProps?.id ?? toggleID;

  return (
    <TooltipProvider>
      <div
        className={cn(
          'mb-1! flex! w-full! items-center! justify-start!',
          hasToggle ? 'h-6!' : 'h-5!',
          containerClassName,
        )}
      >
        {hasToggle ? (
          <div className="mr-2! w-[18%]!">
            {isLoading ? (
              <Skeleton className="h-5! w-11! rounded-full!" />
            ) : (
              <Toggle
                aria-label={label}
                disabled={toggleProps?.disabled}
                id={toggleControlId}
                onPressedChange={() => toggleProps?.onToggle?.()}
                pressed={isToggled}
                className="relative! h-5! min-w-11! rounded-full! bg-[#dadada]! p-0! hover:bg-[#dadada]! data-[state=on]:bg-[var(--toggle-on-bg)]!"
                style={
                  {
                    '--toggle-on-bg': backColor || colorType || '#dadada',
                  } as CSSProperties
                }
              >
                <span
                  className="absolute! left-[0.1875rem]! top-[0.125rem]! size-[0.9rem]! rounded-full! bg-[#595959]! transition-transform! data-[state=on]:translate-x-[1.625rem]!"
                  data-state={isToggled ? 'on' : 'off'}
                  style={{
                    backgroundColor: isToggled
                      ? colorType || '#595959'
                      : '#595959',
                    boxShadow: isToggled ? '0 3px 7px #aba8a8' : undefined,
                  }}
                />
              </Toggle>
            )}
          </div>
        ) : null}
        <div
          className={cn(
            'm-0! overflow-hidden! text-ellipsis! text-nowrap! text-xs! leading-3! text-foreground!',
            hasToggle ? 'basis-[9.5rem]!' : 'basis-[3.7rem]!',
          )}
          title={label}
        >
          {isLoading ? <Skeleton className="h-3! w-full!" /> : label}
        </div>
        {isLoading && !hasToggle ? (
          <Skeleton className="h-2! flex-1!" />
        ) : !hasToggle ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                aria-label={label}
                className="flex! h-2! flex-1! cursor-pointer! items-center! rounded-full! border-0! bg-[#f2f2f2]! p-0! shadow-none!"
                type="button"
              >
                <span
                  className={cn(
                    'h-0.5! rounded-full! transition-[width]! duration-300!',
                    classname,
                  )}
                  id={label}
                  style={{
                    backgroundColor: colorType,
                    width: `${safeProgress}%`,
                  }}
                />
              </button>
            </TooltipTrigger>
            <TooltipContent align="center" side="bottom" sideOffset={4}>
              {label}
            </TooltipContent>
          </Tooltip>
        ) : null}
        <div className="m-0! ml-[0.325rem]! basis-[2.3rem]! text-right! text-xs! text-foreground!">
          {isLoading ? (
            <Skeleton className="h-3! w-full!" />
          ) : (
            <span title={t('int', { val: value })}>
              {formatNumber(value, lng)}
            </span>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ProgressBar;
