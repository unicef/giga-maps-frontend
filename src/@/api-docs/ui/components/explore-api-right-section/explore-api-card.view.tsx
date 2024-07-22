import { Locked } from '@carbon/icons-react';
import { Button } from '@carbon/react';

import { setCurrentExploreApi } from '~/@/api-docs/models/explore-api.model';
import { onDocumentAPIPopup, onDownloadAPIPopup } from '~/@/api-docs/models/popup.model';
import { ExploreApiType } from '~/@/api-docs/types/explore-api-type';
import { getCardAllProps } from '~/@/api-docs/utils';
import ConnectivityIcon from '~/assets/images/connectivity_api_icon.svg';
import { AuthCheckWrapper } from '~/core/auth/utils';

import { ExploreApiCardActions, ExploreApiCardContianer, ExploreApiCardInfo, ExploreCardHeader } from './explore-api-right.style';

const ExploreApiCards = ({ item }: { item: ExploreApiType }) => {
  const { isPublic } = getCardAllProps(item);
  return (
    <ExploreApiCardContianer>
      <ExploreCardHeader>
        <ConnectivityIcon size={48} />
        <div className='card-public-logo-lock-icon'>
          <div className='card-public-logo'>
            <span>
              {item.category}
            </span>
          </div>
          {
            !item.is_unlocked && <Locked className='lock-card-icon' />
          }
        </div>
      </ExploreCardHeader>
      <ExploreApiCardInfo>
        <h3>{item.name}</h3>
        <p>{item.description}</p>
      </ExploreApiCardInfo>
      <ExploreApiCardActions>
        <div>
          <Button
            onClick={AuthCheckWrapper(() => {
              setCurrentExploreApi(item.id);
              onDocumentAPIPopup(true)
            })}
            kind="ghost"
            id={`documentation-${item.id}`}
          >
            Documentation
          </Button>
          {isPublic && <Button
            onClick={AuthCheckWrapper(() => {
              setCurrentExploreApi(item.id);
              onDownloadAPIPopup(true);
            })}
            className='card-actions-download'
            kind="ghost">
            Download
          </Button>}
        </div>
      </ExploreApiCardActions>
    </ExploreApiCardContianer>
  )
}
export default ExploreApiCards;