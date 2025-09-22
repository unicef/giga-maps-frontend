import styled from 'styled-components';

export const SidebarDublicateSchoolWrapper = styled.div`
  font-family: 'Open Sans';
  display: flex;
  flex-direction: column;
`;

export const TotalCountLabel = styled.header`
  padding: 1rem 1rem 1.5rem;
  font-size: 0.875rem;
  color: ${props => props.theme.white};
`;

export const DublicateSchoolList = styled.div`
  padding: 0 1rem;
`;

export const SchoolListItem = styled.div`
  display: flex;
  padding: 0.5rem 0;
  background: transparent;
  align-items: flex-start;
  flex-direction: column;
  margin-bottom: 0.5rem;
  &:first-child {
    padding-top: 0;
  }
`;

export const SchoolItemCount = styled.span`
  color: ${props => props.theme.titleBlue};
  font-size: 1rem;
  margin-right: 0.5rem;
`;

export const SchoolName = styled.div`
  border: none;
  padding: 0;
  margin: 0;
  color: ${props => props.theme.titleBlue};
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
`;

export const SchoolInternetSpeed = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.375rem;
  margin-left: 0.375rem;
`;

export const ToggleLink = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.titleBlue};
  text-align: left;
  cursor: pointer;
  font-family: 'Open Sans';
  font-size: 0.75rem;
  text-decoration-line: underline;
  padding: 0;
`;