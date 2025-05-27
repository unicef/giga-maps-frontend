import { useStore } from 'effector-react';
import styled from 'styled-components';

import ProductTour from '~/@/product-tour/ui/product-tour.view';
import { mapCountry } from '~/core/routes';
import { Layout, Main } from '~/ui';

import Sidebar from '@/sidebar/ui';

import { Popup } from '../popup/ui';
import Footer from './footer';
import Map from './map';
import Underlay from './underlay';
import { $isProductTour, $isTimeplayer } from '~/@/sidebar/sidebar.model';
import { useEffect } from 'react';
import { changeCountryCode } from '~/@/country/country.model';
import { TimeplayerContainer } from './timeplayer/timeplayer-container';
import '~/core/i18n/instance';
import TopLoader from './top-loader';

const PopupContainer = styled.div`
  display: none;
`;

const MapPage = () => {
  const { code = '' } = useStore(mapCountry.params) ?? {};
  const isProductTour = useStore($isProductTour);
  const isTimeplayer = useStore($isTimeplayer)
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
      <TopLoader />
      <Footer />
      {isProductTour && <ProductTour />}
      {isTimeplayer && <TimeplayerContainer />}
    </Layout >
  )
};

export default MapPage;
