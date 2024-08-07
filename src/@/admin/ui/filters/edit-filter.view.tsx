import { adminFilterRoute, editAdminFilter } from '~/core/routes';
import { AddFilterContainer } from '../styles/admin-styles';
import AddEditFilterListForm from './common/form-filter';
import { useStore } from 'effector-react';
import { useEffect } from 'react';
import { getFilterListIdFx } from '../../effects/filter-fx';

const EditFilterList = () => {
  const { id } = useStore(editAdminFilter.params) as { id: number };

  useEffect(() => {
    if (id) {
      getFilterListIdFx({ id });
    } else {
      adminFilterRoute.navigate();
    }
  }, [id])
  return (
    <AddFilterContainer>
      <AddEditFilterListForm id={id} isEditMode={true} />
    </AddFilterContainer>
  )
}

export default EditFilterList