import { Search } from '@carbon/react';
import styled, { css } from 'styled-components';

export const SearchContainer = styled(Search)<{ $active: boolean; $isMobile: boolean }>`
  flex: 1 1 auto;
  min-width: 0;

  .cds--search {
    display: flex;
    align-items: center;
    min-block-size: 2.5rem;
    background: ${props => props.theme.main};
    border-radius: 0.5rem;
    box-shadow: inset 0 0 0 1px ${props => props.$active ? props.theme.titleBlue : props.theme.schoolListBack};
    overflow: hidden;
  }

  input {
    border-bottom: 1px solid transparent;
    background: ${props => props.theme.main};
    color: ${props => props.theme.text};
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1.125rem;
    padding: 0 2.5rem 0 2.5rem !important;
  }

  input::placeholder {
    color: #6F6F6F;
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1.125rem;
    text-align: left;
  }

  .cds--search-magnifier {
    inset-inline-start: 0.875rem;
    z-index: 1;

    svg {
      fill: ${props => props.theme.text} !important;
      width: 1rem;
      height: 1rem;
    }
  }

  .cds--search-close {
    color: ${props => props.theme.text};

    svg {
      fill: ${props => props.theme.text} !important;
    }

    :hover {
      background: transparent;
      border-block-end: 1px solid transparent;
    }
  }

  .cds--search-close::before {
    background-color: transparent;
    block-size: 0;
  }

  .cds--search-close:hover,
  .cds--search-button:hover,
  .cds--search-magnifier {
    background-color: transparent;
  }

  .cds--search-close button {
    :hover {
      background: transparent;
    }
  }

  ${props => props.$isMobile && css`
    .cds--search-close--hidden {
      opacity: 1;
      visibility: visible;
    }
  `}
`;

export const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  height: 3.1rem;
  padding: 0 0.875rem;
  background: #161616;

  .cds--tooltip-content {
    background: ${props => props.theme.text} !important;
    color: ${props => props.theme.main} !important;
  }

  .cds--popover-caret {
    background: ${props => props.theme.text};
  }

  .search-icon {
    height: 1rem;
    width: 1rem;
    fill: ${props => props.theme.text};
    flex-shrink: 0;
  }

  svg {
    fill: ${props => props.theme.text} !important;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const BackButton = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  padding-right: 0.5rem;
  padding-left: 0.5rem;
`;

export const CountrySearchIcon = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.125rem;
  min-inline-size: 2.75rem;
  min-block-size: 2.5rem;
  padding: 0 0.625rem;
  background: ${props => props.theme.main};
  border: none;
  border-radius: 0.5rem;
  box-shadow: inset 0 0 0 1px ${props => props.$active ? props.theme.titleBlue : props.theme.schoolListBack};
  cursor: pointer;
  flex-shrink: 0;

  &:hover,
  &:focus,
  &:focus-visible,
  &:active {
    background: ${props => props.theme.main};
    outline: none;
  }

  svg {
    fill: ${props => props.theme.text} !important;
    pointer-events: none;
  }
`;
