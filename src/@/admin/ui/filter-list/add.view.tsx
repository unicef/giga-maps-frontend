import { AddFilterContainer, AddFilterWrapper } from '../styles/admin-styles'

import AddEditFilterListForm from './form-filter'

const AddFilterList = ({ openFilterSidebar }: { openFilterSidebar?: () => void }) => {
  return (
    <AddFilterWrapper>
      <AddFilterContainer>
        <AddEditFilterListForm isEditMode={false} openFilterSidebar={openFilterSidebar} />
      </AddFilterContainer>
    </AddFilterWrapper>
  )
}

export default AddFilterList