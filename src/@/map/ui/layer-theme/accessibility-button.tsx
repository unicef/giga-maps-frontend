import { PersonStanding } from 'lucide-react';
import { useStore } from 'effector-react';
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next';

import { $theme, setTheme, ThemeType } from '~/core/theme.model';
import { waitFor } from '~/lib/utils';

import { cancelAnimation } from '../../effects/add-layers-utils';
import { changeStyle } from '../../map.model';
import MapControlButton from './map-control-button';

export const AccessibilityButton = () => {
  const { t } = useTranslation();
  const theme = useStore($theme);
  const prevThemeRef = useRef<ThemeType | null>(theme ?? null);

  useEffect(() => {
    if (theme !== ThemeType.accessible) {
      prevThemeRef.current = theme;
    }
  }, [theme]);

  const onApply = async () => {
    cancelAnimation();
    await waitFor(200);

    if (theme !== ThemeType.accessible) {
      prevThemeRef.current = theme;
      setTheme(ThemeType.accessible);
      changeStyle(ThemeType.accessible);
    } else {
      const prev = prevThemeRef.current ?? ThemeType.dark;
      setTheme(prev);
      changeStyle(prev);
    }
  }

  return (
    <MapControlButton
      active={theme === ThemeType.accessible}
      aria-label={t('accessible-mode')}
      data-testid="accessible-button"
      label={t('accessible-mode')}
      onClick={() => {
        void onApply();
      }}
    >
      <PersonStanding className="size-4" />
    </MapControlButton>
  )
}
