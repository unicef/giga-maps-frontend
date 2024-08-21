import { Edit, RecentlyViewed, Renew, TrashCan, View } from '@carbon/icons-react';
import {
    CheckboxGroup,
    FilterableMultiSelect,
    MultiSelect, NumberInput, Select, SideNavLink, SideNavMenu,
    SideNavMenuItem, TableBody, TableCell, TableContainer,
    TableHead, TableToolbarContent, TabPanel, Toggletip, ToggletipContent
} from '@carbon/react';
import styled, { css } from "styled-components";

import { Scroll } from '~/@/scroll';
import CarbonPagination from '~/lib/carbon/carbon-pagination';

export const AdminMainComponent = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
`
export const AdminMainLeftPanel = styled.div`
    width: 17rem;
    position: relative;
    box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.15);
    background: #222;
    color: #fff;
`
export const AdminMainRightPanel = styled.div`
    width: calc(100vw - 17rem);
    height: 100%;
    position: relative;
    overflow:hidden;
`

export const AdminTopHeading = styled.div`
    padding : 1rem 0.88rem 0.94rem 0.94rem;
    background:#222;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom:0.3rem;
>h3{
    color:#FFF;
    font-family: Open Sans;
    font-size: 1rem;
    font-style: normal;
    font-weight: 700;
    line-height: 1.5rem; 
}
>svg{
    fill: white;
    transform: rotate(-90deg);
    cursor: pointer;
}
`
export const AdminTabsContainer = styled.div`
>.cds--side-nav__item::marker {
    content: none;
  }
`
export const AdminSingleTab = styled(SideNavLink)`
    display: flex;
    align-items: center;
    padding: 0.8rem 1rem 0.8rem 1rem ;
    height:3rem ;

  >.cds--side-nav__icon.cds--side-nav__icon--small {
    margin-right: 0.7rem;
  }

  >span {
    font-family: Open Sans;
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1.125rem;
  }
`

export const AdminSideNavMenu = styled(SideNavMenu)`
    
    >button{
        height:3rem;
        padding: 0.8rem 1rem 0.8rem 1rem ;

        >.cds--side-nav__icon{
            margin-right: 0.7rem;
        }
    }

    span {
        font-family: Open Sans;
        font-size: 0.875rem;
        font-style: normal;
        font-weight: 400;
        line-height: 1.125rem;
        color: #fff !important;
      }
`

export const AdminSubSingleTab = styled(SideNavMenuItem)`
    a{
        height:3rem !important ;
        padding-left:2.7rem !important;
    }
    
`
export const LogoutButton = styled.div`
border: 0.0625rem solid #E6E6E6;
  position: absolute;
  bottom: 0;
  width: 100%;

  >button {
    max-width: 100%;
    width: 100%;
    padding: 1.3rem 1rem 1.3rem 1rem;
    color: var(--text-text-primary, #525252);
    font-family: Open Sans;
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1.125rem;
  }
`
export const PageTitle = styled.div` 
    >h3{
        color: #FFF;
        font-family: Open Sans;
        font-size: 1.5rem;
        font-style: normal;
        font-weight: 500;
        line-height: 1.75rem;
    }

    >p{
        color: #F5F5F5;
        font-family: Open Sans;
        font-size: 0.875rem;
        font-style: normal;
        font-weight: 400;
        line-height: 1.125rem;
    }
`

export const PageTitleWrapper = styled.div<{ isSticky?: boolean }>`
    ${({ isSticky }) => isSticky && css`
        position: sticky;
        top: 0;
        z-index: 1;
    `}
    padding: 3.75rem 2rem 1rem 1rem;
    background: #222;
    display:flex;
    align-items: center;
    justify-content: space-between;
`

export const SearchContainer = styled.div`
    width:100%;
    display:flex;
    align-items: center;
    justify-content: end;
    .cds--search-magnifier {
        svg {
            fill: #222;
        }
    }
`

export const ActiveStatusWrapper = styled.div`
    background:#B9EFCB;
    border-radius:62rem;
    width: max-content;
    height:1.5rem;
    padding: 0.3rem 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
`
export const InactiveStatusWrapper = styled.div`
    background:#CDD3DA;
    border-radius:62rem;
    width: max-content;
     height:1.5rem;
    padding: 0.3rem 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
`

export const TableDataCell = styled(TableCell)`
    padding: 1rem 1rem 1.5rem 1rem;
`
export const DataSourceTableCell = styled(TableCell) <{ $updated: boolean; $changed?: boolean }>`
    padding: 1rem 1rem 1.5rem 1rem;
    background:${(props) => (props.$changed ? "#e7e8bb" : props.$updated ? "#d7e8fe" : "transparent")} !important;
    .cds--tooltip-trigger__wrapper{
    button{
        width: 100%;
        max-height: 100%;
        border: none;
        cursor:pointer;
        background: transparent;
    }
}
input{
    border: none;
    background: transparent;
    outline: none;
}
`

export const TableCellRoles = styled(TableCell)`
    padding: 1rem 1rem 1.5rem 1rem;
    width:50%;
`
export const TableDataBody = styled(TableBody)`
    >tr {
        >td {
            background: #FFFFFF;
            color: #474747;
            font-family: Open Sans;
            font-size: 0.875rem;
            font-style: normal;
            font-weight: 400;
            line-height: 1.25rem;
            letter-spacing: 0.01rem;
        }
    }
`

export const EditIcon = styled(Edit)`
    cursor:pointer;

`
export const ViewIcon = styled(View)`
cursor:pointer;
`
export const DeleteIcon = styled(TrashCan)`
    cursor:pointer;
`

export const TableDataHead = styled(TableHead)`
>tr{
    >th{
        border-top:  #E0E0E0;
        border-bottom: #E0E0E0;
        background: #F2F2F2;
}
}
`
export const TableTopHead = styled(TableHead)`
>tr{
    >th{
        padding-top: 1.3rem;
        padding-bottom: 1rem;
        border-top:  #E0E0E0;
        border-bottom: #E0E0E0;
        background: #FFF;
}
}
`

export const TableWrapper = styled.div<{ $minHeight?: string }>`
    min-height: calc(100vh - ${props => props.$minHeight ?? '10.5rem'});
    .cds--data-table thead {
        position: sticky;
        top: 0;
        z-index: 1;
    }
    .cds--data-table-content {
        overflow-x: initial;
    }
`
export const PermissionsTableWrapper = styled.div`
max-height: calc(100vh - 11rem);
`

export const CustomPagination = styled(CarbonPagination)`
.cds--popover {
    display:none;
}
`
export const RecentlyViewedIcon = styled(RecentlyViewed)`
 fill:#fff;
`

export const RenewIcon = styled(Renew)`
 fill:#fff;
`

export const InputContainer = styled.div`
    width: 48%;
    margin-top:1rem;
    select{
        background:#ffffff;
    }
`
export const DailyCountryInput = styled.div`
    width: 30%;
    margin-top:2rem;
    select{
        background:#ffffff;
    }
`
export const SchoolInputContainer = styled.div`
    margin-top:2rem;
    select{
        background:#ffffff;
    }
`
export const SchoolFieldsContainer = styled.div`
margin-top:1.38rem;
    select{
        background:#FAFAFA;
    }
    input{
        background:#FAFAFA;
    }
`

export const TextAreaContainer = styled.div`
    width: 100%;
    textarea{
         margin-top : 0.5rem;
    }
`
export const BackgroundTasktTextAreaContainer = styled.div`
    width: 45%;
    margin-top : 0.5rem;

    p{
        margin-top:0.5rem;
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
    }
    

`

export const InputLabel = styled.div`
    color: #525252;
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1rem;
    letter-spacing: 0.02rem;
`
export const InputBoxWrapper = styled.div`
    margin-top : 0.5rem;
     width:100% !important;
    input{
        background-color: #ffffff;
       
    }
`
export const BackgroundTaskInputBoxWrapper = styled.div`
    margin-top : 0.5rem;
     width:100% !important;
    p {
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
    }
`

export const SchoolFieldsWrapper = styled.div`
    margin-top : 0.5rem;
  input{
        background: #ffffff !important;
       
    }
`

export const DatePickerBoxWrapper = styled.div`
    margin-top : 0.5rem;
    div{
        width:100%;
    }
    input{
        background-color: #ffffff;
        width:100% !important;
    }
`
export const RowContainer = styled.div`
    flex-wrap:wrap;
    padding: 0rem 3rem 1rem 3rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
`

export const BottomButtonWrapper = styled.div`
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 1;
`

export const ApiKeyButtonWrapper = styled.div`
width: 100%;
display: flex;
align-items: center;
justify-content: space-between;
    button{
    width: 45%
    }
`

export const AddLayerWrapper = styled.div`
background-color: #FAFAFA;
position: relative;
height: 100vh;
min-width: 30rem;
max-width: 40rem;
`
export const TabsWrapper = styled.div`
margin-top: 0.8rem;
margin-left: 1rem;
.cds--tab-content {
    padding: 0;
}
`

export const SchoolTabsWrapper = styled.div`
margin-top: 0.1rem;
`

export const SelectLayerConfig = styled(Select)`
margin-top: 1.5rem;
    select{
    background-color: #FAFAFA!important;
}

`
export const MultiSelectLayerConfig = styled(MultiSelect)`
/* margin-top: 1.5rem; */
#aggregate-on-select,#apiSource-select,#parameter-select,#country-select{
    background-color: #FAFAFA;
}
    button{
    border-bottom: 1px solid var(--cds-border-strong);
}

`

export const LayerConfigButtonWrapper = styled.div`
position: sticky;
bottom: 0;
left: 0;
width: 100%;
display: flex;
z-index: 1;
  > button {
    flex: 1;
    padding-right: 1rem;
    max-width: 100%;
}
`

export const NumberInputWrapper = styled(NumberInput)`

margin-top: 1.5rem;
background-color: #FAFAFA!important;

    input{
    background-color: #FAFAFA!important;
}
`

export const ColorPicker = styled.input`
border: none;
background: transparent;
outline: none;
width: 2rem;
height: 2rem;
margin: 0;
`

export const ColorPickerWrapper = styled.div`
margin-top: 0.5rem;
display: flex;
align-items: center;
justify-items: spread;
    > p{
    color: var(--primary - black - 100 - giga - black, #222);
    font-family: Open Sans;
    font-size: 0.75rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1rem;
}
    > div{
    /* margin-top: 0.5rem; */
    display: flex;
    width: 100%;
    align-items: center;

        > span{

        margin-left: 0.65rem;
        color: #6F6F6F;
        font-family: Open Sans;
        font-size: 0.75rem;
        font-style: normal;
        font-weight: 400;
        line-height: 1rem;
    }
}
`
export const ColorPickerLine = styled.div`
margin-top: 0.5rem;
width: 100%;
height: 2px;
background: #DADADA;
`
export const ColorPickerLabel = styled.p`
margin-top:1.5rem;
color: #6F6F6F;
font-family: Open Sans;
font-size: 0.75rem;
font-style: normal;
font-weight: 400;
line-height: 1rem;
`
export const LegendCategotyContainer = styled.div`
margin-top:1rem;
`

export const PublishedLayerWrapper = styled.div`
margin-top: 0.5rem;
border-radius: 62.5rem;
background: #CDD3DA;
padding: 0rem 0.5rem 0.125rem 0.5rem;
color: #474747;
width: fit-content;
font-size: 0.75rem;
line-height: 1rem;
`
export const SelectRoles = styled(FilterableMultiSelect)`
    .cds--multi-select--filterable{
    background-color: #ffffff;
}
`

export const ToolbarContent = styled(TableToolbarContent)`
background-color: #ffffff;
`
export const DataTableContainer = styled(TableContainer)`
padding: 0;

.cds--search-magnifier-icon{
    fill:#222;
}
.import-csv-button{
    margin-right:0.2rem;
}
`

export const ContactMessageTextWrapper = styled.p`
    padding:0.6rem 0rem;
    color: #474747;
    font-size: 0.875rem;
    line-height: 1.25rem;
`
export const AlertComponentWrapper = styled.div`
border-bottom: 1px solid var(--primary-grey-80, #DADADA);
`
export const AdminSchoolTabPanel = styled(TabPanel)`
padding: 0px;
padding-top: 0.1rem;
`

export const Checkboxwrapper = styled(CheckboxGroup)`
flex-wrap:wrap;
width: 100%;
display: flex;
align-items: center;
justify-content: space-between;
    margin-top: 2rem;
`

export const SchoolAddEditWrapper = styled.div`
width:100%;
height: 100%;
position: relative;
`

export const FormWrapper = styled.div`
padding: 1rem 0.7rem;
width:100%;
`

export const $countryFilterModalStyle = css`
    display: grid;
    overflow: hidden;
    background-color: var(--cds-layer);
    grid-template-columns: 100%;
    grid-template-rows: auto 1fr auto;
    outline: 3px solid transparent;
    outline-offset: -3px;
    transform-origin: top center;
    width: 15rem;
    max-height: 100%;
    position: absolute;
    right: 0;
    height: 100%;
    bottom: 0;
    top: auto;
    background:#fff;
   button{
    svg{
      fill:#222 !important;
    }
  }
  .cds--modal-close:hover {
      background-color: transparent !important;
  }
`

export const CountryCheckboxWrapper = styled(CheckboxGroup)`
padding: 0rem 1rem 0.5rem 1rem;
`

export const $countrymodalHeadingStyle = css`
    color: #161616;
   font-weight: 500;
`

export const InlineToastWrapper = styled.div`
width:100%;
`
export const CountryToastWrapper = styled.div`
width:calc(100% - 17rem);
position: absolute;
top: 3rem;
left: 17rem;
`


export const DataLayerActiveCountries = styled.span`
margin-left:0.5rem;
color: #277AFF;
font-size: 0.75rem;
font-style: normal;
font-weight: 400;
line-height: 1rem;
letter-spacing: 0.02rem;
text-decoration-line: underline;
cursor:pointer;
`

export const DataLayerNameField = styled.div`
margin-top:0.5rem;

input{
    background: transparent;
}
`

export const DataLayerFieldContainer = styled.div`
margin-top:1.5rem;
`

export const CountryListToggletip = styled(Toggletip)`

:focus{
    outline:none !important;
}
.cds--popover-content{
    /* border: #222 1px solid; */
    /* background: #ffff; */
    
    .cds--toggletip-content{
        padding-top:0.5rem;
    }
}
.cds--popover-caret{
    display:none !important ;
}
`

export const CountryListToggletipContent = styled(ToggletipContent)`
/* max-height: 12rem; */
/* width:8rem; */

.list-content {
    margin-top:0.5rem;
    /* color: #222; */
    font-size: 0.75rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1rem;
}
`
export const SideBarScrollContainer = styled(Scroll)`
max-height:calc(100vh - 12rem);
`

export const SideBarTabsContainer = styled.div`
height:100%;
`

export const CountryListWrapper = styled.div`
display:flex;
align-items:center;
img{
    margin-right:0.5rem;
    max-height: 50px;
    max-width: 50px;
}
`

export const UploadFlagImage = styled.div`
width:48%;
img{
    height:3rem;
    width:3rem;
}
svg{
    fill:#9E9E9E;
    height:3rem;
    width:3rem;
}
h3{
color: #222;
margin-top:1rem;
font-size: 0.875rem;
font-style: normal;
font-weight: 500;
line-height: 1.125rem;
letter-spacing: 0.01rem;
}
p{
color: #6F6F6F;
margin-top:0.5rem;
margin-bottom:1rem;
font-size: 0.875rem;
font-style: normal;
font-weight: 400;
line-height: 1.125rem;
}
`

export const CountryAddEditWrapper = styled.div`
width:100%;
background:  #ffffff;
position: relative;
margin-top: 1rem;
`

export const CountryListBottomButton = styled.div`
position:absolute;
bottom:0;
width:100%;
button{
    width:50%;
}
`

export const CountryListDataLayer = styled.div`

h3{
    padding:1rem;
    padding-bottom:0;
color: #000;
margin:0;
font-size: 1rem;
font-weight: 500;
}
h4{
padding-left:3rem;
padding-top:2rem;
color: #000;
margin:0;
font-size: 0.87rem;
font-weight: 500;
}
input{
        background:#FAFAFA;
        width:100%;
    }
.nationl-benchmark{
    display:flex;
    align-items:center;

    p{
        color: #000;
        margin-top: 2rem;
        margin-right: 0.5rem;
        font-size: 1rem;
        font-weight: 500;
        width: 20%;
        color: #525252;
        font-size: 0.75rem;
        font-weight: 400;
        line-height: 1rem;
        letter-spacing: 0.02rem;
        margin-left: 4rem;
    }
}

.cds--accordion__content{
    padding-top:0;
}
`

export const DateOfJoiningWrapper = styled.div`
padding:1rem 0;
margin-top:1rem;
width:48%;
`
export const UserListScroll = styled(Scroll)`
max-height:calc(100vh - 13.5rem);
`

export const RolesListScroll = styled(Scroll)`
max-height:calc(100vh - 13.5rem);
`

export const ApiKeyRequestListScroll = styled(Scroll)`
max-height:calc(100vh - 10.5rem);
`

export const DataSourceListScroll = styled(Scroll)`
    max-height:calc(100vh - 13.5rem);
    .ps__rail-x {
        display: block !important;
        .ps__thumb-x {
            display: block !important;
        }
    }

`

export const DataSourceTableWrapper = styled.div`
    min-height: calc(100vh - 8rem);
.cds--data-table-content {
    overflow-x: initial;
}
`

export const StatusWrapperDataSource = styled.div`
  color:#474747 ;
  font-family: Open Sans;
  font-style: normal;
  font-weight: 400;
  line-height: 1rem; 
  background: #D6E4FD;
  border-radius: 62rem;
  width: max-content;
  height: 1.5rem;
  padding: 0.3rem 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`
export const ActionButtonWrapper = styled.div`
display:flex;
align-items:center;
justify-content: space-between;
padding-left: 1rem;
height: 3rem;
p{
    color:  #474747;
    font-size: 0.875rem;
    font-weight: 400;
}
.action-button{
    display:flex;
align-items:center;
}
.right-action-button {
    flex: 1;
    margin-left: 1rem;
}
`
export const AdminTableScroll = styled(Scroll) <{ $contentHeight?: string }>`
    max-height:calc(100vh - ${props => props.$contentHeight ?? '16rem'});
`

export const SchoolListScroll = styled(Scroll)`
max-height:calc(100vh - 16rem);`

export const BackgroundTasktScroll = styled(Scroll)`
max-height:calc(100vh - 13.5rem);`

export const CountryListScroll = styled(Scroll)`
max-height:calc(100vh - 16rem);
`
export const RecentLogScroll = styled(Scroll)`
max-height: calc(100vh - 10.5rem);
`

export const LastWeekStatusWrapper = styled.div`
display:flex;
align-items: center;
cursor:pointer;
`

export const CountrySummaryListScroll = styled(Scroll)`
max-height:calc(100vh - 16rem);
`
export const CountryDailySummaryListScroll = styled(Scroll)`
max-height:calc(100vh - 16rem);
`

export const CountrySummaryFormScroll = styled(Scroll)`
max-height:calc(100vh - 3rem);
`

export const SchoolFormScroll = styled(Scroll)`
max-height:calc(100vh - 11rem);`

export const CountryFormScroll = styled(Scroll)`
max-height:calc(100vh - 7.5rem);
`
export const AmenitiesContainer = styled.div`
display:flex;
flex-direction:column;
padding: 0rem 3.3rem 1rem 3rem;
.amenities-checkbox{
    display: flex;
    flex-direction: row;
    margin-top: 0.5rem;
    .cds--checkbox-label-text{
        font-size: 12px;
        font-weight: 400;
        line-height: 18px;
    }
}
`
export const CheckboxCleanData = styled.div`
display:flex;
flex-direction:column;
margin-top:1rem;
.amenities-checkbox{
    display: flex;
    flex-direction: row;
    margin-top: 0.5rem;
    .cds--checkbox-label-text{
        font-size: 12px;
        font-weight: 400;
        line-height: 18px;
    }
}
`

export const WeeklyStatslinkSchool = styled.div`
height:3rem;
display: flex;
align-items: center;
a{
    color:#0062fe;
}
`

export const RecentActionLink = styled.div`
a{
    color:#0062fe;
}
`

export const InvalidateCacheWrapper = styled.div`

button{
    width:100%;
    padding-left:2.5rem;
}
`

export const AboutUsUploadImgesWrapper = styled.div`
margin-top:1rem;

.file-uploader{
    margin-top:2rem;
}
`

export const AboutUsImagesScroll = styled(Scroll)`
max-height: calc(100vh - 7rem);
`

export const AboutUsImagesListWrapper = styled.div`
min-height: calc(100vh - 7rem);
    .cds--data-table thead {
        position: sticky;
        top: 0;
        z-index: 1;
    }
    .cds--data-table-content {
        overflow-x: initial;
    }
`

export const DeleteConfirmation = styled.div`
    position: fixed;
    z-index: 5;
    width: calc(100% - 17rem);
`
export const AddFilterContainer = styled.div`
    height: 100vh;
    width: 18.5rem;
    z-index: 999;
    position: fixed;
    right: 0;
    top: 0;
    background: #222;
`

export const AddEditForm = styled.div`
    display: flex;
    padding: 1rem 0rem;
`
