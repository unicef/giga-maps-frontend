import { Minus, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { zoomIn, zoomOut } from '../../map.model';
import MapControlButton from './map-control-button';

const ZoomButtons = () => {
  const { t } = useTranslation();

  return (
    <div className="mb-0! flex! flex-col! items-center! overflow-visible!">
      <MapControlButton
        aria-label={t('zoom-in')}
        buttonClassName="rounded-b-none! rounded-t-[1rem]! border-0! border-b! border-b-[#262626]!"
        containerClassName="mt-0!"
        label={t('zoom-in')}
        onClick={() => zoomIn()}
      >
        <Plus className="size-4" />
      </MapControlButton>
      <MapControlButton
        aria-label={t('zoom-out')}
        buttonClassName="!mt-0 !rounded-t-none !rounded-b-[1rem] !border-0"
        containerClassName="!mt-0"
        label={t('zoom-out')}
        onClick={() => zoomOut()}
      >
        <Minus className="size-4" />
      </MapControlButton>
    </div>
  )
}

export default ZoomButtons
