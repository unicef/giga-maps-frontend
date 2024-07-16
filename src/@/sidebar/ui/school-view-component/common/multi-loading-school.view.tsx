import { Div, LoadingText } from "~/@/common/style/styled-component-style";
import { MultischoolBottomInfo, SchoolInfoContainer, SingleInfoContainer } from "../styles/school-view-style";
import { Hashtag, Location } from '@carbon/icons-react';

export default function MultiLoadingSchool({ count }: { count: number; }) {
  return Array(count).fill(0).map((_, index) => (
    <Div $margin='0.8rem 0' key={index}>
      <MultischoolBottomInfo>
        <LoadingText width="92%" />
      </MultischoolBottomInfo>
      <MultischoolBottomInfo>
        <SchoolInfoContainer>
          <SingleInfoContainer>
            <Hashtag />
            <LoadingText $marginEnd='0' width="60%" />
          </SingleInfoContainer>
          <SingleInfoContainer>
            <Location />
            <LoadingText $marginEnd='0' width="80%" />
          </SingleInfoContainer>
          <SingleInfoContainer>
            <Hashtag />
            <LoadingText $marginEnd='0' />
          </SingleInfoContainer>
        </SchoolInfoContainer>
        <SchoolInfoContainer>
          <SingleInfoContainer>
            <LoadingText $marginEnd='0' width="80%" />
          </SingleInfoContainer>
          <SingleInfoContainer>
            <LoadingText $marginEnd='0' width="80%" />
          </SingleInfoContainer>
        </SchoolInfoContainer>
      </MultischoolBottomInfo>
    </Div>))
}