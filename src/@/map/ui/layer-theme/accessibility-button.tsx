import { IconButton } from '@carbon/react'
import { useEffect, useRef } from 'react'
import { AccessibilityAlt } from '@carbon/icons-react'
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { $theme, setTheme, ThemeType } from '~/core/theme.model';
import { changeStyle } from '../../map.model';
import { useStore } from 'effector-react';
import { cancelAnimation } from '../../effects/add-layers-utils';
import { waitFor } from '~/lib/utils';

const IconWrapper = styled.div<{ $isActive?: boolean }>`
  margin-top: 0.5rem;
  .cds--btn--icon-only{
    border-radius: 50%;
    padding: 4.5px;
    border: 1px solid ${props => props.$isActive ? props.theme.titleBlue : props.theme.main};
    background: ${props => props.$isActive ? props.theme.titleBlue : props.theme.main};
  }
  .cds--btn--primary:focus {
    box-shadow: 0 0 0 1px ${props => props.theme.main};
  }
  svg{
    fill: ${props => props.theme.text};
    width: 20px;
    height: 20px;
  }
  .cds--popover{
    position:relative;
    z-index:6001;
    top:-1rem;
  }
  .cds--tooltip-content {
    background: ${props => props.theme.text} !important;
    color: ${props => props.theme.main}!important;
  }
  .cds--popover-caret{
    background: ${props => props.theme.text} !important;
  }
`

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
      // Going TO accessible: save current theme then set accessible
      prevThemeRef.current = theme;
      setTheme(ThemeType.accessible);
      changeStyle(ThemeType.accessible);
    } else {
      // Currently accessible -> revert to previous theme
      const prev = prevThemeRef.current ?? ThemeType.dark; // fallback
      setTheme(prev);
      changeStyle(prev);
    }
  }

  return (
    <IconWrapper $isActive={ThemeType.accessible === theme}>
      <IconButton
        kind='secondary'
        data-testid="accessible-button"
        align="left"
        size="sm"
        label={t("accessible-mode")}
        onClick={onApply}>
        <AccessibilityAlt />
      </IconButton>
    </IconWrapper>
  )
}
