import { SkeletonText } from '@carbon/react';
import { SchoolListItem } from './dublicate-school-popup.style';

function DublicateSchoolLoader() {
  return (
    <SchoolListItem>
      <SkeletonText
        lineCount={5}
        width="100%"
      />
      <SkeletonText
        lineCount={5}
        width="100%"
      />

      <SkeletonText
        lineCount={5}
        width="70%"
      />
    </SchoolListItem>
  )
}

export default DublicateSchoolLoader