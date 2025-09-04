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

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(15, 98, 254, 0.7); }
  70% { box-shadow: 0 0 0 6px rgba(15, 98, 254, 0); }
  100% { box-shadow: 0 0 0 0 rgba(15, 98, 254, 0); }
`;

const shimmer = keyframes`
  0% { transform: translateX(-100%) translateY(0) scale(1, 1); opacity: 0.6; }
  20% { opacity: 0.8; }
  60% { transform: translateX(100%) translateY(0) scale(1, 1); opacity: 0.6; }
  100% { transform: translateX(80%) translateY(0) scale(1, 1); opacity: 0; }
`;

// Container for the progress bar
export const ProgressWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  height: 5px;
  background-color: rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

// The actual progress bar with animations
export const ProgressBarStyled = styled.div<{ progress: number; status: 'active' | 'finished' | 'loading' | 'error' }>`
  height: 100%;
  background: linear-gradient(90deg, #0f62fe, #3d8dff);
  width: ${({ progress }) => `${progress}%`};
  transition: width 0.3s ease-in-out;
  position: relative;
  box-shadow: 0 0 15px rgba(15, 98, 254, 0.6);
  border-radius: 0 3px 3px 0;
  animation: ${pulse} 2s infinite;
  transition: all 0.3s ease-in-out;
  ${({ status }) => status === 'finished' && css`
    animation: ${progressAnimation} 0.5s ease-out forwards, ${pulse} 2s infinite;
  `}
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.8) 30%,
      rgba(255, 255, 255, 0.9) 50%,
      rgba(255, 255, 255, 0.8) 70%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: translateX(-100%) skewX(-20deg);
    animation: ${shimmer} 2s infinite ease-out;
    width: 60%;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.5) 30%,
      rgba(255, 255, 255, 0.7) 50%,
      rgba(255, 255, 255, 0.5) 70%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: translateX(-100%) skewX(-20deg);
    animation: ${shimmer} 1.8s infinite 0.3s ease-out;
    width: 40%;
  }
  
  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }
`;

interface ProgressBarProps {
  progress: number;
  status: 'active' | 'finished' | 'loading' | 'error';
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
