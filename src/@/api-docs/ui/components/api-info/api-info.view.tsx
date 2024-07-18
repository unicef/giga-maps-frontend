import { useStore } from 'effector-react';
import { useEffect, useRef } from 'react';

import { $currentSelectedApiData } from '~/@/api-docs/models/explore-api.model';
import { docsExporeApi } from '~/core/routes';

import ApiBreadcrumb from '../common/api-breadcrumb';
import { HeaderContainer } from '../common/right-section-header/right-section.header.style';

const ApiInfo = () => {
  const exploreApiData = useStore($currentSelectedApiData);
  const iframeRef = useRef<null | HTMLIFrameElement>(null);
  useEffect(() => {
    if (!exploreApiData) {
      docsExporeApi.navigate()
    }
  }, [exploreApiData])

  return (
    <>
      <HeaderContainer>
        <ApiBreadcrumb />
      </HeaderContainer>
      <iframe ref={iframeRef} src={exploreApiData?.documentation_url} style={{ height: '100vh' }} height="100vh" width="100%">
      </iframe>
    </>
  )
}

export default ApiInfo;