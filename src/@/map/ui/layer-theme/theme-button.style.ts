import { styled } from "styled-components";

export const BroadcastButton = styled.div`
position:fixed;
z-index:10;
top:1rem;
display: flex;
align-items: center;
flex-direction: column;
right: 0.5rem;

@media (max-width:768px){
    top:6.5rem;
}
`
export const TakeTourWrapper = styled.div<{ $bottom: boolean }>`
z-index: 1;
position:fixed;
right:.5rem;
bottom:2.5rem;
display:flex;
flex-direction:column;
align-items:center;

 @media (max-width:768px){
     bottom:${props => props.$bottom ? "calc(60vh + 1rem)" : "calc(32vh + 0.5rem)"};
 }
`

export const TakeTour = styled.div`
width: 2rem;
height: 2rem;
border-radius: 1.25rem;
background:  #474747;
cursor: pointer;
display: flex;
    align-items: center;
    justify-content: center;

.takeTour{
    fill:#fff;
}
`
