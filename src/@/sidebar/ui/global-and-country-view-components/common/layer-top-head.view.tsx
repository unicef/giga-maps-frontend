import { SettingsAdjust, } from '@carbon/icons-react'
import { IconButton } from "@carbon/react";
import { useStore } from 'effector-react';
import { PropsWithChildren } from 'react';

import { $selectedLayerId } from '~/@/sidebar/sidebar.model';

import { LayerHeader } from "../styles/layer-view-common.style";
import { useTranslation } from 'react-i18next';

export default function LayerTopHead(
  { label, children, disabled = true, onClickSetting, hideSetting }:
    PropsWithChildren<{ label: string; disabled?: boolean; onClickSetting?: () => void, hideSetting?: boolean; }>) {
  const { t } = useTranslation();
  const selectedLayerId = useStore($selectedLayerId);

  return <LayerHeader>
    {!hideSetting && <IconButton
      align={'bottom-right'}
      className="filter-icon-button"
      label={t('data-layer-selection')}
      size="sm"
      kind="ghost"
      onClick={() => {
        if (onClickSetting) {
          onClickSetting()
        }
      }}
      disabled={disabled && !selectedLayerId}
    >
      <SettingsAdjust size={16} />
    </IconButton>}
    {children}
  </LayerHeader>
} 