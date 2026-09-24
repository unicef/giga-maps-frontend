import { Share } from '@carbon/icons-react';
import { IconButton } from '@carbon/react';

import { Ref } from 'react';
import { useTranslation } from 'react-i18next';
import { styled } from 'styled-components';


const ShareIcon = styled(Share)`
  fill: ${props => props.theme.text} !important;
`
const ShareButtonWrapper = styled.div<{ $centerIcon: boolean }>`
 ${({ $centerIcon }) => $centerIcon && `
  /* Carbon's sm padding is tuned for a 16px glyph and sinks a larger one. */
  .cds--btn.cds--btn--icon-only {
    padding-block: 0;
    align-items: center;
  }
 `}
 .cds--tooltip-content {
  background: ${props => props.theme.text} !important;
  color: ${props => props.theme.main}!important;
}
  .cds--popover-caret{
    background: ${props => props.theme.text};
  }
`

const ShareButton = ({ shareButtonRef, handleShareClicked, iconSize = 16 }: { shareButtonRef?: Ref<HTMLElement>, handleShareClicked: () => void, iconSize?: 16 | 20 }) => {
  const { t } = useTranslation();
  return (
    <ShareButtonWrapper $centerIcon={iconSize !== 16}>
      <IconButton
        align={'bottom-right'}
        label={t('share-content')}
        className="sidebar-worldview-shareIcon"
        onClick={handleShareClicked}
        ref={shareButtonRef}
        size="sm"
        kind="ghost"
      >
        <ShareIcon size={iconSize} aria-label="share" />
      </IconButton>
    </ShareButtonWrapper >
  );
}

export default ShareButton;