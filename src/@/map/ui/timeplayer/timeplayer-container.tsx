import styled from "styled-components"
import { IconButton, Loading } from '@carbon/react'
import { Close, Play, Pause } from '@carbon/icons-react'
import { $isLoadingTimeplayer, $isPauseTimeplayer, $timePlayerCurrentYear, onPausePlayTimeplayer, onToggleTimeplayer } from "~/@/sidebar/sidebar.model"
import { ShowCurrentYear } from "./timeplayer-button.style"
import { useStore } from "effector-react"
import { $country } from "~/@/country/country.model"
import { $isMobile } from "~/core/media-query"
const Container = styled.div`
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 2;
`
const CloseButtonWrapper = styled.div<{ $isMobile: boolean }>`
  position: absolute;
  right: 0.5rem;
  top: ${props => props.$isMobile ? 3.4 : 1}rem;
  z-index: 6000;
`
export const TimeplayerContainer = () => {
  const timePlayerCurrentYear = useStore($timePlayerCurrentYear);
  const isPauseTimeplayer = useStore($isPauseTimeplayer);
  const isLoading = useStore($isLoadingTimeplayer);
  const country = useStore($country)
  const isMobile = useStore($isMobile);
  return <Container>
    {isLoading && <Loading withOverlay active />}
    {!!timePlayerCurrentYear && <ShowCurrentYear $isMobile={isMobile}>
      <div>
        <p>Real-time connectivity time player:</p>
        <p>{country?.name}</p>
        <p>{timePlayerCurrentYear}</p>
      </div>
      <div>
        <IconButton
          align="top"
          style={{ marginBottom: '0.1rem' }}
          size="sm"
          label={'...'}
          kind="secondry">
          <Loading small active withOverlay={false} />
        </IconButton>
        <IconButton
          align="bottom"
          size="sm"
          label={isPauseTimeplayer ? 'Play' : 'Pause'}
          kind="secondry"
          onClick={() => onPausePlayTimeplayer(!isPauseTimeplayer)}>
          {isPauseTimeplayer ? <Play /> : <Pause />}
        </IconButton>
      </div>
    </ShowCurrentYear>
    }
    <CloseButtonWrapper $isMobile={isMobile}>
      <IconButton
        size="sm"
        title="Close timeplayer"
        data-testid="time-player-close"
        label='Close'
        align="left"
        kind="secondry"
        onClick={() => {
          onToggleTimeplayer(false);
        }}><Close size={16} />
      </IconButton>
    </CloseButtonWrapper>
  </Container >
}