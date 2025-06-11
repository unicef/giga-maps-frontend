import { Button, Form, PopoverContent, Toggle } from "@carbon/react";
import { useStore } from 'effector-react';
import { MouseEvent, PropsWithChildren, useEffect, useState } from 'react';

import { $theme, gigaThemeList, setTheme, ThemeType } from '~/core/theme.model';
import { waitFor } from '~/lib/utils';

import { cancelAnimation } from '../../effects/add-layers-utils';
import { styles } from '../../map.constant';
import { $isAdminBoundaries, $isNavigateByAdminLevel, $isTilesAndLables, $style, changeStyle, onEnableAdminBoundaries, onEnableNavigateByAdminLevel, onEnableTitlesAndLabels } from '../../map.model';
import { Style } from '../../map.types';
import { CheckboxGroupWrapper, CustomCheckbox, CustomRadioButton, RadioButtonGroupWrapper, ThemeActionButtonWrapper, ThemeHeaderWrapper, ToggleWrapper } from './theme-button.style';
import { useTranslation } from "react-i18next";
import { Text } from "~/@/common/style/styled-component-style";

const mapThemeList = styles.filter((style: string) => !gigaThemeList.includes(style as ThemeType))
const ThemePopupContent = ({ setOpen }: PropsWithChildren<{ setOpen: (open: boolean) => void, }>) => {
  const { t } = useTranslation();
  const style = useStore($style);
  const theme = useStore($theme);
  const isAdminBoundaries = useStore($isAdminBoundaries);
  const isTilesAndLables = useStore($isTilesAndLables)
  const [gigaTheme, setGigaTheme] = useState(theme)
  const [currentStyle, setCurrentStyle] = useState(style)
  const [currentAdminBoundaries, setCurrentAdminBoundaries] = useState(isAdminBoundaries)
  const [currentTitlesAndLabels, setCurrentTitlesAndLabels] = useState(isTilesAndLables)
  const defaultMapStyle = gigaThemeList.includes(currentStyle as ThemeType) ? 'default' : currentStyle;
  const isNavigateByAdminLevel = useStore($isNavigateByAdminLevel)
  const [currentNavigateByAdminLevel, setCurrentNavigateByAdminLevel] = useState(isNavigateByAdminLevel)

  const onApply = async (e: MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    setTheme(gigaTheme);
    onEnableAdminBoundaries(currentAdminBoundaries);
    onEnableTitlesAndLabels(currentTitlesAndLabels);
    onEnableNavigateByAdminLevel(currentNavigateByAdminLevel)
    if (currentStyle !== style) {
      cancelAnimation();
      await waitFor(200);
      changeStyle(currentStyle);
    }
  }

  return (
    <PopoverContent className="theme-layer-popover-content">
      <ThemeHeaderWrapper>
        <h3>
          {t('themes-layers')}
        </h3>
      </ThemeHeaderWrapper>
      <Form aria-label="layer-theme-form">
        <RadioButtonGroupWrapper
          onChange={(value) => {
            setCurrentStyle(value as Style);
            setGigaTheme(value as ThemeType)
          }}
          legendText={t("themes")}
          name="theme-radio-button-group-giga"
          defaultSelected={gigaTheme}>
          {gigaThemeList.map((item, index) => (
            <CustomRadioButton key={`giga-${item}`} labelText={t(item + '-mode')} value={item} id={`giga_${item}_${index}`} />
          ))}
        </RadioButtonGroupWrapper>

        <RadioButtonGroupWrapper valueSelected={defaultMapStyle}
          onChange={(value) => {
            if (value === 'default') {
              setCurrentStyle(gigaTheme);
            } else {
              setCurrentStyle(value as Style)
            }
          }} legendText={t("map-types")} name="theme-radio-button-group" defaultSelected={defaultMapStyle}>
          <CustomRadioButton labelText={t('default-view')} value={'default'} id={`default-view-radio`} />
          {mapThemeList.map((item, index) => (
            <CustomRadioButton key={item} labelText={<>{t(item + '-view')}</>} value={item} id={`${item}_${index}`} />
          ))}
        </RadioButtonGroupWrapper>
        <CheckboxGroupWrapper legendText={t("layers")}>
          <CustomCheckbox checked={currentAdminBoundaries} onChange={() => setCurrentAdminBoundaries(prev => !prev)} labelText={t('administrative-boundaries')} id="admin-boundary" />
          <CustomCheckbox checked={currentTitlesAndLabels} onChange={() => setCurrentTitlesAndLabels(prev => !prev)} labelText={t('titles-and-labels')} id="titles-label" />
        </CheckboxGroupWrapper>
        <ToggleWrapper>
          <Toggle id="toggle" toggled={currentNavigateByAdminLevel} hideLabel onToggle={() => setCurrentNavigateByAdminLevel(prev => !prev)} />
          <Text>Navigate by Admin Level</Text>
        </ToggleWrapper>
        <ThemeActionButtonWrapper>
          <Button type="reset" kind="secondary" onClick={() => setOpen(false)}>
            {t('cancel')}
          </Button>
          <Button type="submit" onClick={(e) => {
            void onApply(e)
          }}>
            {t('apply')}
          </Button>
        </ThemeActionButtonWrapper>
      </Form>
    </PopoverContent>
  )
}

export default ThemePopupContent;


