import { editAdminFilter } from '~/core/routes';
import { AddFilterContainer, AddFilterWrapper } from '../styles/admin-styles';
import AddEditFilterListForm from './form-filter';
import { useStore } from 'effector-react';
import { useEffect } from 'react';
import { getFilterListIdFx } from '../../effects/filter-fx';

const EditFilterList = ({ openFilterSidebar }: { openFilterSidebar?: () => void }) => {
  const { id } = useStore(editAdminFilter.params) as { id: number };

  useEffect(() => {
    if (id) {
      void getFilterListIdFx({ id });
    }
  }, [id])

  return (
    <AddFilterWrapper>
      <AddFilterContainer>
        <AddEditFilterListForm openFilterSidebar={openFilterSidebar} filterItemId={id} isEditMode={true} />
      </AddFilterContainer>
    </AddFilterWrapper>
  )
}

export default EditFilterList