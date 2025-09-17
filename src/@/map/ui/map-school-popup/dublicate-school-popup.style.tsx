import { InlineLoading } from "@carbon/react";
import styled from "styled-components";
import { Scroll } from "~/@/scroll";

export const DublicateSchoolListWrapper = styled.div`
  font-family: Open Sans;
  width: 17.3125rem;
  background: ${props => props.theme.grayDark};
  border-radius: 0.125rem;
  box-shadow: 0 0.5rem 1.25rem 0 rgba(0, 0, 0, 0.55);
  display: flex;
  flex-direction: column;
`;

export const TotalCountLabel = styled.p`
  background: ${props => props.theme.grayDark};
  padding: 1rem;
  font-size: 0.875rem;
  color: #d8d8d8;
  font-weight: 400;
  vertical-align: middle;
  line-height: 1rem;
  border-bottom: 0.0625rem solid #525252;
  .data-source-tooltip .cds--tooltip-content {
    background-color: ${props => props.theme.grayDark} !important;
    color: ${props => props.theme.white} !important;            
  }
  .data-source-tooltip .cds--tooltip-caret {
    background-color: ${props => props.theme.grayDark} !important;
  }
`;

export const DublicateSchoolList = styled(Scroll)`
  max-height: 50vh;
  overflow-y: auto;
  padding: 0 1rem;
`;

export const SchoolListItem = styled.div`
  width: 100%;
  display: block;
  gap: 0.75rem;
  padding: 1rem 0;
  background: transparent;
  border: none;
  border-bottom: 0.0625rem solid #525252;
  text-align: left;
  overflow: hidden;
`;

export const ItemTopSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 0.25rem;
`;

export const ItemBottomSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-left: 0.375rem;
`;

export const SchoolInternetSpeed = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.625rem;
  align-items: center;
`;

export const SchoolName = styled.div`
    font-size: 1.25rem;
    font-weight: 400;
    color: ${props => props.theme.filterText};
    line-height: 1.75rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const SchoolItemCount = styled.div`
  color: ${props => props.theme.filterText};
  font-family: 'Open Sans';
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.75rem;
  min-width: 4.25rem;
  text-align: right;
`;

export const GoToSchoolInfo = styled.button`
  width: 2.5rem;
  height: 2.5rem;
  min-height: 2.5rem;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
`;

export const LoadingList = styled(InlineLoading)`
  padding: 16px;
`