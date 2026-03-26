import { Toggle, ToggleProps,Tooltip } from '@carbon/react';
import { useStore } from 'effector-react';
import { useTranslation } from 'react-i18next';

import { LoadingText, LoadingToggle } from '~/@/common/style/styled-component-style';
import { $lng } from '~/core/i18n/store';
import { formatNumber } from '~/lib/utils';

import { LabelProgress, LineBar, ProgressBarWrapper, ToggleWrapper } from './progress-bar.style';

const ProgressBar = ({ value = 0, maxValue = 0, label = '', colorType = '', toggleProps, backColor = '', isLoading = false }: { value?: number, maxValue?: number, label?: string, toggleProps?: ToggleProps; colorType?: string; backColor?: string; isLoading?: boolean }) => {
  const progress = (value / maxValue) * 100;
  const togglePresent = !!toggleProps;
  const lng = useStore($lng);
  const { t } = useTranslation();

  return (
    <ProgressBarWrapper $height={togglePresent ? 1.5 : 1.2}>
      {togglePresent ? (
        <ToggleWrapper $backcolor={backColor} $color={colorType}>
          {isLoading ? <LoadingToggle /> : <Toggle hideLabel labelText="" {...toggleProps} />}
        </ToggleWrapper>
      ) : null}
      <LabelProgress $width={togglePresent ? 9.5 : 3.7} title={label}>
        {isLoading ? <LoadingText $blockSize='0.7' $marginEnd='0' /> : label}
      </LabelProgress>
      {isLoading && !toggleProps ? <LoadingText $blockSize='0.5' $marginEnd='0' /> : !toggleProps ? (
        <Tooltip align="bottom" label={label}>
          <LineBar as="button" $color={colorType} $progress={progress}>
            <div className='fill-bar' id={label} />
          </LineBar>
        </Tooltip>
      ) : null}
      <p className="progress-info">
        {isLoading ? <LoadingText $blockSize='0.7' $marginEnd='0' /> : <span title={t('int', { val: value })}>{formatNumber(value, lng)}</span>}
      </p>
    </ProgressBarWrapper>
  );
};

export default ProgressBar;
