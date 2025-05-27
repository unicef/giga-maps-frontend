

import { Toggle, ToggleProps } from '@carbon/react';

import { LoadingText, LoadingToggle } from '~/@/common/style/styled-component-style';
import { formatNumber } from '~/lib/utils';

import { CustomTooltip } from '../../landing-page-side-bar/styles/landing-page-style';
import { LabelProgress, LineBar, ProgressBarWrapper, ToggleWrapper } from './progress-bar.style';
import { useStore } from 'effector-react';
import { $lng } from '~/core/i18n/store';

const ProgressBar = ({ value = 0, maxValue = 0, label = "", colorType = "", toggleProps, backColor = "", isLoading = false }: { value?: number, maxValue?: number, label?: string, toggleProps?: ToggleProps; colorType?: string; backColor?: string; isLoading?: boolean }) => {
  const progress = (value / maxValue) * 100; // Calculate the progress percentage
  const togglePresent = !!toggleProps;
  const lng = useStore($lng);
  return (
    <ProgressBarWrapper $height={togglePresent ? 1.5 : 1.2}>
      {
        togglePresent && (
          <ToggleWrapper $color={colorType} $backcolor={backColor} >
            {isLoading ? <LoadingToggle /> :
              <Toggle labelText="" hideLabel {...toggleProps} />
            }
          </ToggleWrapper>
        )
      }
      <LabelProgress $width={togglePresent ? 9.5 : 3.7} title={label}>
        {isLoading ? <LoadingText $blockSize='0.7' $marginEnd='0' /> : label}
      </LabelProgress>
      {isLoading && !toggleProps ? <LoadingText $marginEnd='0' $blockSize='0.5' /> :
        <>
          {
            !toggleProps && <CustomTooltip
              align="bottom"
              autoAlign={true}
              label={label}
              flexgrow={1}
            >
              <LineBar as="button" $color={colorType} $progress={progress}>
                <div id={label} className='fill-bar' />
              </LineBar>
            </CustomTooltip>
          }
        </>
      }
      <p className="progress-info">
        {isLoading ? <LoadingText $blockSize='0.7' $marginEnd='0' /> : formatNumber(value, lng)}
      </p>
    </ProgressBarWrapper>
  );
};

export default ProgressBar;
