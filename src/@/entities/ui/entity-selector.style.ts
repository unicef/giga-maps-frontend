import styled, { css } from 'styled-components';

export const EntitySelectorWrapper = styled.div`
  position: fixed;
  top: 0.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  display: flex;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  background: ${props => props.theme.main};
  border-radius: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(8px);

  @media (max-width: 768px) {
    top: auto;
    bottom: 33vh;
    left: 50%;
  }
`;

export const EntityToggleButton = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.625rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 1rem;
  font-size: 0.7rem;
  line-height: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  background: ${props => props.$active ? props.theme.activeBackground : 'transparent'};
  color: ${props => props.$active ? props.theme.activeText : props.theme.text};

  ${props => props.$active && css`
    border-color: ${props.theme.activeBackground};
    font-weight: 600;
  `}

  &:hover {
    background: ${props => props.$active ? props.theme.activeBackground : props.theme.hoverBackground};
  }

  svg {
    width: 0.875rem;
    height: 0.875rem;
    fill: currentColor;
  }
`;

export const EntityDot = styled.span<{ $color: string }>`
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background-color: ${props => props.$color};
  flex-shrink: 0;
`;
