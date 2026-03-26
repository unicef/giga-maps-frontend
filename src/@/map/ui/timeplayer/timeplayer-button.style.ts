import { styled } from "styled-components";

export const ShowCurrentYear = styled.div<{ $isMobile: boolean }>`
    color: ${props => props.theme.text};
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    bottom: 9rem;
    right: 0.5rem;
    div {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        p {
            font-size: ${props => props.$isMobile ? 1 : 1.25}rem;
        }
    }
`
