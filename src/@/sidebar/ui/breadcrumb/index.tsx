import { BreadcrumbWrapper } from './bdb-style';
import CountryBDB from './country-bdb-view';
import GlobalBDB from './global-bdb.view';
import RightShareBDB from './right-share-bdb.view';
import SchoolBDB from './school-bdb-view';


const BreadcrumbInfo = () => {
  return <BreadcrumbWrapper>
    <GlobalBDB />
    <CountryBDB />
    <SchoolBDB />
    <RightShareBDB />
  </BreadcrumbWrapper>
}

export default BreadcrumbInfo;