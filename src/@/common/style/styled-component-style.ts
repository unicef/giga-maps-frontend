import { Button, CheckboxSkeleton, InlineNotification, Link, SkeletonText, ToggleSkeleton, Tooltip } from "@carbon/react";
import { css, styled } from "styled-components";

type StyledCommonProps = { $padding?: string; $margin?: string; }

export const InlineToast = styled(InlineNotification)`
width:100%;
max-width:100% ;
`

export const Box = styled.div<StyledCommonProps>`
  ${({ $padding }) => $padding && css`
    padding: ${$padding}rem;
  `} 
  ${({ $margin }) => $margin && css`
    margin: ${$margin}rem;
  `} 
`;

export const EmptyList = styled.div<{ $color?: string; }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1rem;
  font-size: 0.9rem;
  color:${props => props.$color ?? props.theme.text};
`

export const Chip = styled.div`
    margin-top: 0.3rem;
    border-radius: 62.5rem;
    background: #CDD3DA;
    padding: 0rem 0.5rem 0.125rem 0.5rem;
    color: var(--tag-cool-gray-text, #474747);
    font-family: Open Sans;
    font-size: 0.75rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1rem;
    text-transform: capitalize;
`

export const Text = styled.p<{ $size?: number; $weight?: number; $transform?: string; $color?: string; }>`
  ${({ $size = 0.75, $weight = 400, $transform = "initial", $color }) => $size && css`
      font-size: ${$size}rem;
      font-weight: ${$weight};
      text-transform: ${$transform};
      color: ${$color};
      margin:0.5rem 0;
.info-icon{
  button{
  border: none;
    background: inherit;
    margin-left: 0.5rem;
    svg{
      fill:#7E7E7E;
      width: 0.75rem;
      height: 0.75rem;
    }
}
}

  `}
`

export const Div = styled.div<{ $padding?: string; $margin?: string; $flex?: string; $width?: string; $height?: string; $style?: string }>`

  ${props => props.$padding && css`
    padding: ${props.$padding};
  `}

  ${props => props.$height && css`
    height: ${props.$height};
  `}

  ${props => props.$width && css`
    width: ${props.$width};
  `}

  ${props => props.$margin && css`
    margin: ${props.$margin};
  `}

  ${props => props.$flex && css`
    display: flex;
    align-items: ${props.$flex};
    justify-items: ${props.$flex};
  `}

  ${props => props.$style && css`
    ${props.$style}
  `}
`

export const BorderBottom = styled.div`
  padding-bottom: 0.8rem;
  /* border-bottom: 0.5px solid var(--border-border-strong-01, #474747); */
`

export const LinkGhost = styled(Link) <{ type: string }>`
  ${({ type }) => type === 'danger' && css`
    color: #b81921 !important;
  `}
  cursor: pointer;
`
export const FloatButton = styled(Button)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 2;
`

export const Center = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`
type SkeletonType = { $width?: string; $marginEnd?: string; $blockSize?: string; $marginStart?: string; $inlineSize?: string };

const skeltonStyle = css<SkeletonType>`
  text-align: left;
  ${props => props.$marginStart && css`
    margin-block-start: ${props.$marginStart}rem;
  `};
  ${props => props.$marginEnd && css`
    margin-block-end: ${props.$marginEnd}rem;
  `};
  background: ${props => props.theme.skeleton};
  padding: 0 !important;
  ${props => props.$blockSize && css`
    block-size: ${props.$blockSize}rem;
  `};
  ${props => props.$blockSize && css`
    block-size: ${props.$blockSize}rem;
  `};
  ${props => props.$blockSize && css`
    block-size: ${props.$blockSize}rem;
  `};
  &::before {
    background: ${props => props.theme.skeletonHighlight};
  }
`

export const LoadingText = styled(SkeletonText) <SkeletonType>`
  ${skeltonStyle}
`
export const LoadingToggle = styled(ToggleSkeleton) <SkeletonType>`
  .cds--toggle__skeleton-circle {
    ${skeltonStyle}
  }
  .cds--toggle__skeleton-rectangle {
    ${skeltonStyle}
  }
`

export const LoadingCheckbox = styled(CheckboxSkeleton) <SkeletonType>`
  .cds--checkbox-label-text {
    ${skeltonStyle}
    ${props => props.$width && css`
      width: ${props.$width};
      inline-size: 0;
  `};
  }
`

export const CustomIcon = styled.span<{ $size?: number }>`
  svg {
    width: ${props => props?.$size ?? 1}rem;
    height: ${props => props?.$size ?? 1}rem;
    fill: ${props => props.theme.text};
  }
`

export const TooltipStyle = styled(Tooltip) <{ $maxWidth?: string }>`
  button {
    border: none;
    background: inherit;
    cursor: pointer;
  }
  .cds--popover-content {
    background: #181818 !important;
    color: ${props => props.theme.white};
  }
  svg {
    width: 0.75rem;
    height: 0.75rem;
    fill: ${props => props.theme.grey60};
  }
  .cds--popover-content {
    max-inline-size: ${props => props.$maxWidth ?? "18rem"};
  }
`

export const TooltipButton = styled(Tooltip) <{ $hideLabel?: boolean; }>`
    button {
      padding: 0;
      border: none;
      background: inherit;
      cursor: pointer;
    }
    ${props => props.$hideLabel && css`
      .cds--popover {
        display: none;
      }
    `}
`