import { createEvent, restore } from 'effector';
import { useStore } from 'effector-react'

import { InlineToast } from '~/@/common/style/styled-component-style';
import { timeoutStore } from '~/lib/effector-kit';

import { MAX_SCHOOL_SELECTED } from '../container/search-result.constant';
import { $searchSchoolIds, setSchoolSelection } from '../container/search-result.model';
import { SearchResultApi } from '../container/search-result.type';
import { SchoolBody, SchoolCheckbox, SchoolItem, SchoolName } from '../styles/search-result-style'
import { useTranslation } from 'react-i18next';

export const setShowMessage = createEvent<number>()
const $showMessage = restore(setShowMessage, 0);

// reset store after 4 secs
timeoutStore({
  clock: setShowMessage,
  target: setShowMessage,
  resetState: 0,
  timeout: 4000
})

export const SearchSchool = ({ school }: { school: SearchResultApi }) => {
  const { id, external_id: externalId, name } = school;
  const showMessage = useStore($showMessage) === id;
  const selectedSchool = useStore($searchSchoolIds);
  const schoolId = id.toString();
  const isChecked = selectedSchool.has(schoolId);
  const maxSchoolSelected = selectedSchool.size >= MAX_SCHOOL_SELECTED;
  const { t } = useTranslation();
  return (<>
    <SchoolItem onClick={event => {
      if (maxSchoolSelected && !isChecked) {
        setShowMessage(id);
        return
      };
      setShowMessage(0);
      event.preventDefault();
      setSchoolSelection([school, isChecked]);
    }}>
      <SchoolCheckbox
        data-testid="single-school"
        id={schoolId}
        value={schoolId}
        labelText=""
        name="schools"
        checked={isChecked}
      />
      <div>
        <SchoolName>{name?.toLowerCase()}</SchoolName>
        <SchoolBody>{externalId}</SchoolBody>
      </div>
    </SchoolItem >
    {showMessage && <InlineToast
      role='alert'
      kind='warning-alt'
      onCloseButtonClick={() => setShowMessage(0)}
      title={t("maximum-school-selection-allowed", { maxSchools: MAX_SCHOOL_SELECTED })}
      lowContrast
      hideCloseButton
    />
    }
  </>)
}