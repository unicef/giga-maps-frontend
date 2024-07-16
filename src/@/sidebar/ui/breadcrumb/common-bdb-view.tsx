/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Home } from '@carbon/icons-react';
import { BreadcrumbItem, Breadcrumb, BreadcrumbSkeleton, OverflowMenu, OverflowMenuItem } from "@carbon/react"
import { useStore } from 'effector-react';
import { css, styled } from 'styled-components';

import { $country, $isLoadinCountry } from '~/@/country/country.model';
import { mapCountry, mapOverview, mapSchools, router } from '~/core/routes';
import { Link } from '~/lib/router';

import { $allLoadings, $isLoadingSchoolView, $schoolStats } from '../../sidebar.model';
import { LoadingText } from '~/@/common/style/styled-component-style';

const BreadcrumbEllipsis = styled(BreadcrumbItem) <{ $maxWidth?: number; }>`
  .cds--link {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width:  ${props => (props.$maxWidth || 7)}rem;
    display: inline;
    color:${props => (props.theme.text)} !important; 
}
`
const BreadcrumbCustom = styled(BreadcrumbItem)`
.cds--overflow-menu__icon {
  fill: ${props => (props.theme.text)} !important;
}
`
const BreadcrumbOverflow = styled(OverflowMenuItem) <{ $isActive: boolean }>`
${props => !props.$isActive && css`
  cursor: auto;
`}

`
export const GoToMap = () => {
  return (
    <BreadcrumbItem >
      <Link to={mapOverview} ><Home size={36} /></Link>
    </BreadcrumbItem>
  )
}

export const GoToCountry = ({ isCurrentPage = false, admin1Name }: { isCurrentPage?: boolean; admin1Name?: string | null }) => {
  const countryData = useStore($country);
  const isLoading = useStore($allLoadings).country;
  const { name: countryName = '...', code = ' ' } = countryData || {};
  return (<>
    {isLoading ? <LoadingText width='5rem' $marginEnd='0' /> :
      <BreadcrumbEllipsis title={countryName} $maxWidth={isCurrentPage ? 10 : 5} href="#" isCurrentPage={isCurrentPage}>
        <Link to={mapCountry} params={{ code: code.toLocaleLowerCase() }}>{countryName}</Link>
      </BreadcrumbEllipsis>
    }
    {admin1Name && <BreadcrumbEllipsis $maxWidth={5} title={admin1Name} isCurrentPage>{admin1Name}</BreadcrumbEllipsis>}
  </>)
}

export const GoToSchool = () => {
  const schools = useStore($schoolStats) || [];
  const country = useStore($country);
  const isSchoolGreaterThanOne = schools?.length > 1;
  const schoolName = isSchoolGreaterThanOne ? 'Custom School' : schools[0]?.name || '';
  const school = schools[0];
  const admin1 = school?.admin1_name || "Unknown";
  const admin2Unknown = school?.admin1_name || "Unknown";
  const admin2 = school?.admin2_name || admin2Unknown;
  const isLoading = useStore($isLoadingSchoolView);
  const admin1Text = isSchoolGreaterThanOne ? "Admin 1..." : admin1;
  const admin2Text = isSchoolGreaterThanOne ? "Admin 2..." : admin2;
  const admin1Code = school?.admin1_code
  const clickAdmin1 = () => {
    if (!isSchoolGreaterThanOne && admin1Code) {
      return router.navigate(`/map/country/${country?.code.toLocaleLowerCase()}/${admin1Code}`)
    }
  }
  if (isLoading) {
    return <>
      <BreadcrumbEllipsis title={''} isCurrentPage>{''}</BreadcrumbEllipsis>
      <LoadingText width='5rem' $marginEnd='0' />
    </>
  }
  return (
    <>
      <BreadcrumbCustom data-floating-menu-container>
        <OverflowMenu aria-label="Overflow menu in a breadcrumb">
          <BreadcrumbOverflow $isActive={!isSchoolGreaterThanOne && !!admin1Code} onClick={clickAdmin1} itemText={admin1Text} />
          <BreadcrumbOverflow $isActive={false} itemText={admin2Text} />
        </OverflowMenu>
      </BreadcrumbCustom>
      <BreadcrumbEllipsis title={schoolName} isCurrentPage>{schoolName}</BreadcrumbEllipsis>
    </>
  )
}

