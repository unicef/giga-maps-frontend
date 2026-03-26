import { Education, Hospital } from '@carbon/icons-react';
import type { ComponentType } from 'react';

type EntityIconProps = {
  className?: string;
  size?: number;
};

const EducationIcon = Education as unknown as ComponentType<EntityIconProps>;
const HospitalIcon = Hospital as unknown as ComponentType<EntityIconProps>;

export const getEntityIconComponent = (iconName?: string): ComponentType<EntityIconProps> | undefined => {
  switch (iconName) {
    case 'Education':
      return EducationIcon;
    case 'Hospital':
      return HospitalIcon;
    default:
      return undefined;
  }
};
