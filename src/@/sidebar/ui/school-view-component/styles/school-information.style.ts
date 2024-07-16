import styled from "styled-components";

export const StatisticsStatus = styled.span<{ $color: string; }>`
  color: ${props => props.$color ? props.$color : '#46C66D'} ;
  text-transform: capitalize;
font-size: 0.75rem;
font-weight: 400;
line-height: 2.125rem;
`

export const StatisticsStatusLg = styled(StatisticsStatus)`
  font-size: 2.375rem;
`