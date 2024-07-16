import { apiInfo, docsApiKeys, docsExporeApi } from '~/core/routes'
import { useRoute } from '~/lib/router'

import ApiInfo from '../components/api-info/api-info.view';
import ApiKeysRightSection from '../components/api-keys-right-section';
import ExploreApiRightSection from '../components/explore-api-right-section';
import Modals from '../components/modals';
import SideMenuPanel from '../components/side-menu-panel';
import { ApiRoot, RightSectonPanel } from './api-docs-main.style';


const ApiDocsMain = () => {
  return (<>
    <ApiRoot>
      <SideMenuPanel />
      <RightSectonPanel>
        {useRoute(docsExporeApi) && <ExploreApiRightSection />}
        {useRoute(docsApiKeys) && <ApiKeysRightSection />}
        {useRoute(apiInfo) && <ApiInfo />}
      </RightSectonPanel>
    </ApiRoot>
    <Modals />
  </>)
}

export default ApiDocsMain;