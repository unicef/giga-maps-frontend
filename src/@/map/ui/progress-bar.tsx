import React from 'react';
import styled, { keyframes, css } from 'styled-components';

// Animation for when the progress bar completes
const progressAnimation = keyframes`
  0% {
    width: 0%;
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

// Container for the progress bar
export const ProgressWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  height: 3px;
  background-color: transparent;
  overflow: hidden;
`;

// The actual progress bar with animations
export const ProgressBarStyled = styled.div<{ progress: number; status: 'active' | 'finished' | 'error' }>`
  height: 100%;
  background-color: ${({ status }) =>
    status === 'error' ? '#fa4d56' :
    status === 'finished' ? '#42be65' :
    '#0f62fe'};
  width: ${({ progress }) => `${progress}%`};
  transition: width 0.3s ease-in-out;
  position: relative;
  box-shadow: 0 0 10px rgba(15, 98, 254, 0.5);
  
  ${({ status }) => status === 'finished' && css`
    animation: ${progressAnimation} 0.5s ease-out forwards;
  `}
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100%;
    background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%);
    transform: translateX(100%);
    animation: shimmer 1.5s infinite;
  }
  
  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`;

interface ProgressBarProps {
  progress: number;
  status: 'active' | 'finished' | 'error';
}

// The reusable progress bar component
const ProgressBar: React.FC<ProgressBarProps> = ({ progress, status }) => {
  // Don't render if progress is 0 and status is not active
  if (progress === 0 && status !== 'active') {
    return null;
  }
  
  return (
    <ProgressWrapper>
      <ProgressBarStyled progress={progress} status={status} />
    </ProgressWrapper>
  );
};

export default ProgressBar;
