import { createEvent, createStore, restore } from 'effector';
import { useStore } from 'effector-react';
import { FormEvent } from 'react';

import { InlineToast } from '~/@/common/style/styled-component-style';
import { roleCreateRoute, userRoles } from '~/core/routes'
import { setPayload, timeoutStore } from '~/lib/effector-kit';

import { createRoleFx } from '../../effects/user-management-fx';
import { $duplicateRecordWarning, setShowduplicateRecordWarning } from '../../models/roles-management.model';
import PageTitleComponent from '../common-components/page-title-component'
import { InlineToastWrapper } from '../styles/admin-styles';
import RoleForm from './role.form.view';

export const setRoleName = createEvent<string>()
const $roleName = restore(setRoleName, '');
export const setRoleDescription = createEvent<string>()
const $roleDescription = restore(setRoleDescription, '');



// reset store after 4 secs
timeoutStore({
  clock: setShowduplicateRecordWarning,
  target: setShowduplicateRecordWarning,
  resetState: false,
  timeout: 4000
})

const updateFormData = createEvent();
const $formData = createStore({
  name: "",
  description: "",
  permission_slugs: []
})
$formData.on(updateFormData, setPayload);
$formData.reset(roleCreateRoute.visible)
const CreateRole = () => {
  const showMessage = useStore($duplicateRecordWarning);

  const formData = useStore($formData);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await createRoleFx({
        body: {
          ...formData,
          permission_slugs: formData.permission_slugs.map((item) => item.key)
        }
      })
      userRoles.navigate();
    } catch (e) {

      if (e?.response?.non_field_errors?.[0] === `Role with '${formData.name}' already exists.`) {
        setShowduplicateRecordWarning(true)
      }
      console.error(e)
    }
  }

  return (
    <>
      <PageTitleComponent
        title={"Create Role"}
        subTitle={""}
        recentlyView={true} />

      {showMessage &&
        <InlineToastWrapper>
          <InlineToast
            role='alert'
            kind='warning-alt'
            onCloseButtonClick={() => setShowduplicateRecordWarning(false)}
            title={`duplicate not allowed`}
            lowContrast
            hideCloseButton
          />
        </InlineToastWrapper>
      }
      <RoleForm
        formData={formData}
        onSubmit={onSubmit}
        updateFormData={(props) => {
          updateFormData({
            ...formData,
            ...props
          })
        }}
      />
    </>
  )
}

export default CreateRole