import { useStore } from 'effector-react';
import { useEffect, useMemo, useRef } from 'react';

import { $activeApiKeyData, $currentApiKey, $currentSelectedApiData } from '~/@/api-docs/models/explore-api.model';
import { docsExporeApi } from '~/core/routes';

import ApiBreadcrumb from '../common/api-breadcrumb';
import { HeaderContainer } from '../common/right-section-header/right-section.header.style';

const ApiInfo = () => {
  const exploreApiData = useStore($currentSelectedApiData);
  const currentApiKey = useStore($currentApiKey);
  const activeApiKeyData = useStore($activeApiKeyData)
  const iframeRef = useRef<null | HTMLIFrameElement>(null);
  const documentationURL = useMemo(() => {
    if (exploreApiData?.code === 'DAILY_CHECK_APP' && activeApiKeyData?.length > 0) {
      const category = activeApiKeyData[0]?.api_category_code || 'public';
      const url = new URL(exploreApiData?.documentation_url?.includes('.html') ? 'https://uni-ooi-giga-meter-backend-dev.azurewebsites.net/api?gigaUI=true' : exploreApiData?.documentation_url) // TEMP setup documentation URL
      const token = currentApiKey;
      url.pathname += `/${category}`;
      url.searchParams.append('token', token);
      return url.href;
    }
    return exploreApiData?.documentation_url
  }, [exploreApiData, activeApiKeyData])
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
      <iframe ref={iframeRef} src={documentationURL} style={{ height: '100vh' }} height="100vh" width="100%">
      </iframe>
    </>
  )
}

export default ApiInfo;