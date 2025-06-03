import { ButtonSkeleton } from "@carbon/react"
import { ConnectivityStatusCircle } from "~/@/sidebar/ui/school-view-component/styles/school-view-style"
import { LocationFilledIcon, PopupTemplate, SchoolInfoWrapper, SchoolNameWrapper, SkeletonHeading, SkeletonLabel } from "./school-popup.style"
import { Hashtag, TransmissionLte, Wifi } from '@carbon/icons-react'

export const SchoolPopupLoading = () => {
  return (
    <div className="popup-template-loading">
      <PopupTemplate>
        <SchoolNameWrapper>
          <SkeletonHeading />
          <ConnectivityStatusCircle $color={""}>
          </ConnectivityStatusCircle>
        </SchoolNameWrapper>
        <SchoolInfoWrapper>
          <Hashtag />
          <SkeletonLabel width="60%" />
        </SchoolInfoWrapper>
        <SchoolInfoWrapper>
          <LocationFilledIcon />
          <SkeletonLabel width="80%" />
        </SchoolInfoWrapper>
        <SchoolInfoWrapper>
          <Wifi />
          <SkeletonLabel width="40%" />
        </SchoolInfoWrapper>
        <SchoolInfoWrapper>
          <TransmissionLte />
          <SkeletonLabel width="40%" />
        </SchoolInfoWrapper>
      </PopupTemplate>
      <ButtonSkeleton style={{ width: '100%' }} />
    </div>
  )
}