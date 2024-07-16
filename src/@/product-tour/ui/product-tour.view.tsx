import { useStore } from 'effector-react';

import { $tourEndPopup, $tourStarted, $tourStartPopup, onChangeTourEndPopup, onChangeTourStartPopup } from '../models/product-tour.model';
import ProductTourEndPopup from './components/modal/product-tour-end-popup';
import ProductTourStartPopup from './components/modal/product-tour-start-popup';
import ProductTourMainView from './pages/product-tour-main.view';


const ProductTour = () => {
  const tourStartPopup = useStore($tourStartPopup)
  const tourEndPopup = useStore($tourEndPopup)
  const tourStarted = useStore($tourStarted)

  return (<>
    {tourStarted &&
      <ProductTourMainView />
    }
    <ProductTourStartPopup open={tourStartPopup} setOpen={onChangeTourStartPopup} />
    <ProductTourEndPopup open={tourEndPopup} setOpen={onChangeTourEndPopup} />
  </>)
};

export default ProductTour;
