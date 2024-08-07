import { editAdminFilter } from '~/core/routes';
import { AddFilterContainer } from '../styles/admin-styles';
import AddEditFilterListForm from './common/form-filter';
import { useStore } from 'effector-react';
import { useEffect } from 'react';
import { getFilterListIdFx } from '../../effects/filter-fx';

const EditFilterList = ({ openFilterSidebar }: { openFilterSidebar?: () => void }) => {
  const { id } = useStore(editAdminFilter.params) as { id: number };

  return (
    <AddFilterContainer>
      <AddEditFilterListForm id={id} isEditMode={true} />
    </AddFilterContainer>
  )
}

export default EditFilterList