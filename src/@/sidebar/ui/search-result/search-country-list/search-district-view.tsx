import { useStore } from 'effector-react';

import { $searchAdminLevel1, $searchAdminLevel2, $searchSchoolAdmin1, $searchSchoolAdmin2, setSearchExpandLevel1, setSearchExpandLevel2 } from '../container/search-result.model';
import { DistrictWithSchoolCount } from '../container/search-result.type';
import { ChevronDownIcon, ChevronRightIcon, ChevronUpIcon, DistictWrapper, Dot, LeftItem, LinkItem, RightItem, SearchItem } from '../styles/search-result-style';
import { mapCountry } from '~/core/routes';
import { Link } from '~/lib/router';
import { useMemo } from 'react';

export const expandDistrict = ({ districtCode, isExpanded }: { isExpanded: boolean; districtCode: string }) => {
  setSearchExpandLevel1(isExpanded ? "" : districtCode);
}

export const expandDistrict2 = ({ districtCode, isExpanded }: { isExpanded: boolean; districtCode: string }) => {
  setSearchExpandLevel2(isExpanded ? "" : districtCode);
}

export const SearchDistrict = ({ districtData, countryId, code: countryCode, prevAdmin1 }: { code: string; districtData: DistrictWithSchoolCount, countryId: string; prevAdmin1?: string; }) => {
  const selectedAdmin1 = useStore($searchAdminLevel1);
  const selectedAdmin2 = useStore($searchAdminLevel2);
  const searchSchoolAdmin1 = useStore($searchSchoolAdmin1)
  const searchSchoolAdmin2 = useStore($searchSchoolAdmin2)
  const { admin1_code, admin1_name: admin1, admin1_id: admin1Id, admin2_id: admin2Id, admin2_name: admin2, admin2_count: admin2Count, school_count: schoolCount, data } = districtData;
  const nestedDistrictData = useMemo(() => Object.values(data || {}), [data]);
  const name = admin1 ?? admin2 as string;
  const adminId = admin1Id ?? admin2Id;
  const isSchool = Boolean(schoolCount && schoolCount > 0);
  const isAdminLevel2 = Boolean(admin2);
  const isAdminLevel1 = Boolean(admin1);
  const isExpanded = selectedAdmin1 === admin1Id;
  const isExpanded2 = selectedAdmin2 === adminId;
  const showAdmin2Button = isAdminLevel1 && !!admin2Count && admin2Count > 0;
  const showSchoolButton = (isAdminLevel1 && !nestedDistrictData.length) || (isAdminLevel2 && isSchool);
  const showDot = searchSchoolAdmin1.has(admin1 as string) || searchSchoolAdmin2.has(`${prevAdmin1}-${admin2 ?? '_Blank'}`);
  const districtName = showAdmin2Button ? nestedDistrictData[0].admin2_description : ""
  return <>
    <DistictWrapper>
      <SearchItem $nested={isSchool && !isAdminLevel1}>
        <LeftItem $bold={isExpanded}>
          {isAdminLevel1 && admin1_code ? <Link to={mapCountry} params={{ code: countryCode, path: `/${admin1_code}` }}>{name}</Link> :
            name}
          {showDot && <Dot />}
        </LeftItem>
        {showSchoolButton && <RightItem onClick={() => expandDistrict2({ districtCode: adminId ?? name, isExpanded: isExpanded2 })}>
          <LinkItem $highlight={isExpanded2}>{schoolCount} Schools</LinkItem>
          <ChevronRightIcon $highlight={isExpanded2} $secondary />
        </RightItem>}
        {showAdmin2Button &&
          <RightItem onClick={() => expandDistrict({ districtCode: adminId ?? name, isExpanded })}>
            <LinkItem $underline={isExpanded}>{admin2Count} {districtName}</LinkItem>
            {isExpanded ? <ChevronUpIcon $secondary={isExpanded} /> : <ChevronDownIcon $secondary />}
          </RightItem>
        }
      </SearchItem >
    </DistictWrapper>
    {isExpanded && (nestedDistrictData?.length > 0) && <>
      {nestedDistrictData?.map((nestedDistrict, index) => (
        <SearchDistrict
          key={`${nestedDistrict.school_count}-${index}`}
          districtData={nestedDistrict}
          prevAdmin1={admin1}
          countryId={countryId}
          code={countryCode}
        />
      ))}
    </>}
  </>
}