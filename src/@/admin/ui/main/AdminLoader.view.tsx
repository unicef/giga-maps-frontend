import { Loading } from '@carbon/react'
import { useStore } from 'effector-react'
import { $adminAllLoader } from './admin.model'
import styled from 'styled-components'

const Loader = styled(Loading)`
  .cds--loading-overlay {
    position: absolute;
  }
`
export default function AdminLoaderView() {
  const isLoading = useStore($adminAllLoader)
  return <Loading withOverlay={true} active={isLoading} />
}