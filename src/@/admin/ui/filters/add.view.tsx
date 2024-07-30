import { AddFilterContainer } from '../styles/admin-styles'

import AddEditFilterListForm from './form-filter'

const AddFilterList = () => {
  return (
    <AddFilterContainer>
      <AddEditFilterListForm isEditMode={false} id={0} />
    </AddFilterContainer>
  )
}

export default AddFilterList