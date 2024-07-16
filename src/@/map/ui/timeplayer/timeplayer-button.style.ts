import { css, styled } from "styled-components";

export const TimeplayerWrapper = styled.div`
    background: ${props => props.theme.main};
    margin-top:0.5rem;
    margin-bottom: 0.5rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content:center;
    height:2rem;
    width:2rem;
`

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