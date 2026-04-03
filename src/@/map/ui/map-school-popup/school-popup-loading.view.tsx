import { ButtonSkeleton } from "@carbon/react"
import { LiveContainer, LiveContent, LiveStatusRow, PopupTemplate, SchoolInfoWrapper, SchoolNameWrapper, SkeletonHeading, SkeletonLabel } from "./school-popup.style"
import { Div } from "~/@/common/style/styled-component-style"

export const SchoolPopupLoading = () => {
  return (
    <div className="popup-template-loading">
      <PopupTemplate>
        <SchoolNameWrapper>
          <SkeletonHeading />
        </SchoolNameWrapper>
        <SchoolInfoWrapper>
          <SkeletonLabel width="85%" />
          <LiveContainer>
            <LiveContent>
              <LiveStatusRow>
              </LiveStatusRow>
            </LiveContent>
          </LiveContainer>
          <SkeletonLabel width="50%" />
        </SchoolInfoWrapper>
      </PopupTemplate>
      <ButtonSkeleton style={{ width: '100%' }} />
    </div>
  )
}