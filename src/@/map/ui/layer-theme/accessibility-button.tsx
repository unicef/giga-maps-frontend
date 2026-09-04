import { useStore } from 'effector-react';
import { PersonStanding } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import {
  $showAccessibility,
  onShowAccessibility,
} from '~/@/sidebar/sidebar.model';
import ClickAnywhere from '~/@/sidebar/ui/common-components/click-anywhere';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from '~/components/ui/popover';
import { Toggle } from '~/components/ui/toggle';
import { $theme, setTheme, ThemeType } from '~/core/theme.model';
import { cn } from '~/lib/cn';
import { waitFor } from '~/lib/utils';

import { cancelAnimation } from '../../effects/add-layers-utils';
import { changeStyle } from '../../map.model';
import MapControlButton from './map-control-button';

const accessibilityPopoverClass = 'accessibility-wrapper-popup';
const accessibilityPopoverClassList = [accessibilityPopoverClass];
const closeAccessibilityPopover = () => onShowAccessibility(false);

export const AccessibilityButton = () => {
  const { t } = useTranslation();
  const theme = useStore($theme);
  const isOpen = useStore($showAccessibility);
  const prevThemeRef = useRef<ThemeType | null>(
    theme === ThemeType.accessible ? ThemeType.dark : theme,
  );
  const isAccessible = theme === ThemeType.accessible;

  useEffect(() => {
    if (!isAccessible) {
      prevThemeRef.current = theme;
    }
  }, [isAccessible, theme]);

  const onAccessibleModeChange = async (nextPressed: boolean) => {
    cancelAnimation();
    await waitFor(200);

    if (nextPressed) {
      prevThemeRef.current = theme;
      setTheme(ThemeType.accessible);
      changeStyle(ThemeType.accessible);
    } else {
      const prev = prevThemeRef.current ?? ThemeType.dark;
      setTheme(prev);
      changeStyle(prev);
    }
  };

  return (
    <>
      <Popover modal={false} onOpenChange={onShowAccessibility} open={isOpen}>
        <PopoverAnchor asChild>
          <div
            className={cn(accessibilityPopoverClass, 'relative! inline-flex!')}
          >
            <MapControlButton
              active={isOpen}
              aria-label={t('accessible-mode')}
              data-testid="accessible-button"
              label={t('accessible-mode')}
              onClick={() => onShowAccessibility(!isOpen)}
            >
              <PersonStanding className="size-4" />
            </MapControlButton>
          </div>
        </PopoverAnchor>
        <PopoverContent
          align="center"
          aria-label={t('accessible-mode')}
          className={cn(
            accessibilityPopoverClass,
            'z-[10000]! w-[min(20rem,calc(100vw-1rem))]! rounded-[6px]! border! border-border! bg-popover! p-4! shadow-xs!',
          )}
          onInteractOutside={(event) => event.preventDefault()}
          side="left"
          sideOffset={12}
        >
          <div className="flex! flex-col! gap-4!">
            <p className="m-0! text-sm! leading-5! text-foreground!">
              {t('accessible-mode')}
            </p>
            <div className="inline-flex! items-center!">
              <Toggle
                aria-label={t('accessible-mode')}
                className="h-6! w-11! min-w-11! shrink-0! justify-start! gap-0! rounded-full! bg-gray-800! p-0.5! shadow-none! hover:bg-gray-800! data-[state=on]:bg-connectivity-green-600! data-[state=on]:text-white!"
                onPressedChange={(nextPressed) => {
                  void onAccessibleModeChange(nextPressed);
                }}
                pressed={isAccessible}
                type="button"
              >
                <span
                  className={cn(
                    'size-5! rounded-full! bg-white! transition-transform!',
                    isAccessible ? 'translate-x-5!' : 'translate-x-0!',
                  )}
                />
              </Toggle>
              <span className="pl-2! text-sm! leading-5! text-foreground!">
                {t(isAccessible ? 'accessible-mode-on' : 'accessible-mode-off')}
              </span>
            </div>
            <p className="text-sm! leading-5! text-muted-foreground!">
              {t('accessible-mode-description')}
            </p>
          </div>
        </PopoverContent>
      </Popover>
      {isOpen && (
        <ClickAnywhere
          classList={accessibilityPopoverClassList}
          outsideClick={closeAccessibilityPopover}
          trigger={isOpen}
        />
      )}
    </>
  );
};
