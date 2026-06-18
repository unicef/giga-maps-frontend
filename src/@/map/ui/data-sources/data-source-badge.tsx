import { TooltipButton } from '~/@/common/style/styled-component-style';

import { DataSourceBadgeButton } from './data-sources.styles';
import { DataSourceBadgeItem } from './data-sources.types';

const DataSourceBadge = ({
  source,
  onClick,
}: {
  source: DataSourceBadgeItem;
  onClick?: (source: DataSourceBadgeItem) => void;
}) => {
  const badge = (
    <DataSourceBadgeButton
      type="button"
      $clickable={source.clickable}
      title={source.name}
      onClick={() => {
        if (source.clickable) onClick?.(source);
      }}
    >
      {source.name}
    </DataSourceBadgeButton>
  );

  if (source.clickable) {
    return badge;
  }

  return (
    <TooltipButton align="top" label={source.name} enterDelayMs={200}>
      <span style={{ display: 'inline-flex', maxWidth: '100%' }}>{badge}</span>
    </TooltipButton>
  );
};

export default DataSourceBadge;
