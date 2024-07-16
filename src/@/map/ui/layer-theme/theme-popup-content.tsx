import { Button, Form, PopoverContent } from "@carbon/react";
import { useStore } from 'effector-react';
import { MouseEvent, PropsWithChildren, useState } from 'react';

import { $theme, gigaThemeList, setTheme, ThemeType } from '~/core/theme.model';
import { waitFor } from '~/lib/utils';

import { cancelAnimation } from '../../effects/add-layers-utils';
import { styles } from '../../map.constant';
import { $isAdminBoundaries, $isTilesAndLables, $style, changeStyle, onEnableAdminBoundaries, onEnableTitlesAndLabels } from '../../map.model';
import { Style } from '../../map.types';
import { CheckboxGroupWrapper, CustomCheckbox, CustomRadioButton, RadioButtonGroupWrapper, ThemeActionButtonWrapper, ThemeHeaderWrapper } from './theme-button.style';

const mapThemeList = styles.filter((style: string) => !gigaThemeList.includes(style as ThemeType))
const ThemePopupContent = ({ setOpen }: PropsWithChildren<{ setOpen: (open: boolean) => void, }>) => {
  const style = useStore($style);
  const theme = useStore($theme);
  const isAdminBoundaries = useStore($isAdminBoundaries);
  const isTilesAndLables = useStore($isTilesAndLables)
  const [gigaTheme, setGigaTheme] = useState(theme)
  const [currentStyle, setCurrentStyle] = useState(style)
  const [currentAdminBoundaries, setCurrentAdminBoundaries] = useState(isAdminBoundaries)
  const [currentTitlesAndLabels, setCurrentTilesAndLabels] = useState(isTilesAndLables)
  const defaultMapStyle = gigaThemeList.includes(currentStyle as ThemeType) ? 'default' : currentStyle;

  const onApply = async (e: MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    setTheme(gigaTheme);
    onEnableAdminBoundaries(currentAdminBoundaries);
    onEnableTitlesAndLabels(currentTitlesAndLabels);
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
          Themes & layers
        </h3>
      </ThemeHeaderWrapper>
      <Form aria-label="layer-theme-form">
        <RadioButtonGroupWrapper
          onChange={(value) => {
            setCurrentStyle(value as Style);
            setGigaTheme(value as ThemeType)
          }}
          legendText="Themes"
          name="theme-radio-button-group-giga"
          defaultSelected={gigaTheme}>
          {gigaThemeList.map((item, index) => (
            <CustomRadioButton key={`giga-${item}`} labelText={<><span className="capitalize">{item}</span> mode</>} value={item} id={`giga_${item}_${index}`} />
          ))}
        </RadioButtonGroupWrapper>

        <RadioButtonGroupWrapper valueSelected={defaultMapStyle}
          onChange={(value) => {
            if (value === 'default') {
              setCurrentStyle(gigaTheme);
            } else {
              setCurrentStyle(value as Style)
            }
          }} legendText="Map types" name="theme-radio-button-group" defaultSelected={defaultMapStyle}>
          <CustomRadioButton labelText={`Default view`} value={'default'} id={`default-view-radio`} />
          {mapThemeList.map((item, index) => (
            <CustomRadioButton key={item} labelText={<><span className="capitalize">{item}</span> view</>} value={item} id={`${item}_${index}`} />
          ))}
        </RadioButtonGroupWrapper>
        <CheckboxGroupWrapper legendText="Layers">
          <CustomCheckbox checked={currentAdminBoundaries} onChange={() => setCurrentAdminBoundaries(prev => !prev)} labelText={`Administrative boundaries`} id="admin-boundary" />
          <CustomCheckbox checked={currentTitlesAndLabels} onChange={() => setCurrentTilesAndLabels(prev => !prev)} labelText={`Titles and Labels`} id="titles-label" />
        </CheckboxGroupWrapper>
        <ThemeActionButtonWrapper>
          <Button type="reset" kind="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={(e) => {
            void onApply(e)
          }}>
            Apply
          </Button>
        </ThemeActionButtonWrapper>
      </Form>
    </PopoverContent>
  )
}

export default ThemePopupContent;


