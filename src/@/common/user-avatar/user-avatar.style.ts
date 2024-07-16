import { styled } from "styled-components";

export const UserAvatarWrapper = styled.div`
  display: flex;
  align-items: center;
`

export const UserAvatarIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.375rem;
  height: 2.375rem;
  border-radius: 50%;
  background: #277AFF;
  color: #fff;
`

export const UserNameWrapper = styled.div`
    margin-left: 0.5rem;
  > span {
  color: var(--text - text - primary, #222);
  font-family: Open Sans;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1.375rem;
  }
`