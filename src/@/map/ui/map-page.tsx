import '~/core/i18n/instance';

import { useStore } from 'effector-react';
import { useEffect } from 'react';
import styled from 'styled-components';

import { changeCountryCode } from '~/@/country/country.model';
import EntityTypeSelector from '~/@/entities/ui/entity-selector';
import WelcomeToast from '~/@/entities/ui/welcome-toast';
import ProductTour from '~/@/product-tour/ui/product-tour.view';
import { $isProductTour, $isTimeplayer } from '~/@/sidebar/sidebar.model';
import { $isMobile } from '~/core/media-query';
import { $mapRoutes, mapCountry } from '~/core/routes';
import { Layout, Main } from '~/ui';

import Sidebar from '@/sidebar/ui';

import { Popup } from '../popup/ui';
import Footer from './footer';
import Map from './map';
import { TimeplayerContainer } from './timeplayer/timeplayer-container';
import TopLoader from './top-loader';
import Underlay from './underlay';
import ZoomLevelDisplay from './zoom-level-display';

const PopupContainer = styled.div`
  display: none;
`;

const MapPage = () => {
  const { code = '' } = useStore(mapCountry.params) ?? {};
  const isMobile = useStore($isMobile);

  const isProductTour = useStore($isProductTour);
  const isTimeplayer = useStore($isTimeplayer);
  const mapRoute = useStore($mapRoutes);
  useEffect(() => {
    if (code) {
      changeCountryCode(code);
    }
  }, []);

  return (
    <Layout>
      <Underlay>
        <Map />
      </Underlay>
      <Main>
        <Sidebar />
        <PopupContainer>
          <Popup />
        </PopupContainer>
      </Main>
      {!isMobile && !isTimeplayer && <EntityTypeSelector />}
      <TopLoader />
      <Footer />
      <WelcomeToast />
      {/* <ZoomLevelDisplay /> */}
      {isProductTour && <ProductTour />}
      {isTimeplayer && <TimeplayerContainer />}
    </Layout>
  );
};

export default MapPage;
