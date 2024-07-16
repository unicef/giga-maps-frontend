import { combine, sample } from 'effector';
import { useStore } from 'effector-react';

import ExploreApiCards from './explore-api-card.view';
import { ExploreApiCardsWrapper } from './explore-api-right.style';
import { $exploreDataWithFilter } from '~/@/api-docs/models/explore-api.model';


const ExploreApiList = () => {
  const exploreApiList = useStore($exploreDataWithFilter)
  return (
    <ExploreApiCardsWrapper>
      {exploreApiList.map((item) => <ExploreApiCards key={item.id} item={item} />)}
    </ExploreApiCardsWrapper>
  )
}

export default ExploreApiList;