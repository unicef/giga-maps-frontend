import styled from 'styled-components';

export const EntityViewContainer = styled.div`
  padding: 1rem;
  color: ${props => props.theme.text};
`;

export const EntityViewHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

export const EntityTypeTag = styled.span<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.125rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  background: ${props => props.$color}20;
  color: ${props => props.$color};
`;

export const EntityName = styled.h3`
  color: ${props => props.theme.text};
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25rem;
  letter-spacing: 0.01rem;
  margin: 0;
  word-break: break-word;
`;

export const EntityFieldsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  gap: 0;
`;

export const EntityFieldItem = styled.div`
  padding: 0.75rem 0.5rem;
  padding-left: 0;
  overflow: hidden;
  word-wrap: break-word;

  p {
    color: ${props => props.theme.schoolId};
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1rem;
    margin-bottom: 0.25rem;
  }

  span {
    display: block;
    color: ${props => props.theme.text};
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.125rem;
  }
`;

export const EntityInfoRow = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.75rem;

  svg {
    width: 0.75rem;
    height: 0.75rem;
    fill: ${props => props.theme.text};
    margin-right: 0.25rem;
  }

  p {
    color: ${props => props.theme.titleDesc};
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1.125rem;
    text-transform: capitalize;
  }
`;

export const EntityEmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  text-align: center;
  color: ${props => props.theme.titleDesc};
  font-size: 0.8125rem;
  line-height: 1.25rem;

  svg {
    width: 2rem;
    height: 2rem;
    margin-bottom: 0.75rem;
    opacity: 0.4;
  }
`;

export const StatusDot = styled.span<{ $color: string }>`
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: ${props => props.$color};
  opacity: 0.65;
  margin-right: 0.375rem;
`;
