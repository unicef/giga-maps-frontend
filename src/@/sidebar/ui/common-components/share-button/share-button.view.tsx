import { Share } from '@carbon/icons-react';
import { IconButton } from '@carbon/react';

import { Ref } from 'react';
import { useTranslation } from 'react-i18next';
import { styled } from 'styled-components';


const ShareIcon = styled(Share)`
  fill: ${props => props.theme.text} !important;
`
const ShareButtonWrapper = styled.div`
 .cds--tooltip-content {
  background: ${props => props.theme.text} !important;
  color: ${props => props.theme.main}!important;
}
  .cds--popover-caret{
    background: ${props => props.theme.text};
  }
`

const ShareButton = ({ shareButtonRef, handleShareClicked }: { shareButtonRef: Ref<HTMLElement>, handleShareClicked: () => void }) => {
  const { t } = useTranslation();
  return (
    <ShareButtonWrapper>
      <IconButton
        align={'bottom-right'}
        label={t('share-content')}
        className="sidebar-worldview-shareIcon"
        onClick={handleShareClicked}
        ref={shareButtonRef}
        size="sm"
        kind="ghost"
      >
        <ShareIcon size="16" aria-label="share" />
      </IconButton>
    </ShareButtonWrapper >
  );
}

export default ShareButton;