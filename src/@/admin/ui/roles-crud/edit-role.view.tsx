import { createEvent } from 'effector';
import { useStore } from 'effector-react';
import { FormEvent, useEffect } from 'react';

import { InlineToast } from '~/@/common/style/styled-component-style';
import { editRoles, userRoles } from '~/core/routes'
import { setPayload, timeoutStore } from '~/lib/effector-kit';

import { getRoleByIdFx, updateRoleFx } from '../../effects/user-management-fx';
import { $duplicateRecordWarning, setShowduplicateRecordWarning } from '../../models/roles-management.model';
import { $roleByIdResponse, reloadRolesList } from '../../models/user-management.model';
import PageTitleComponent from '../common-components/page-title-component'
import { InlineToastWrapper } from '../styles/admin-styles';
import RoleForm from './role.form.view';

timeoutStore({
  clock: setShowduplicateRecordWarning,
  target: setShowduplicateRecordWarning,
  resetState: false,
  timeout: 4000
})

const updateFormData = createEvent();
const $formData = $roleByIdResponse.map(data => ({
  name: data?.name ?? "",
  description: data?.description ?? "",
  permission_slugs: data?.permission_slugs ?? []
}))
$formData.on(updateFormData, setPayload);

const EditRole = () => {
  const showMessage = useStore($duplicateRecordWarning);
  const { id } = useStore(editRoles.params) as { id: number };
  const formData = useStore($formData);
  const editData = useStore($roleByIdResponse);
  useEffect(() => {
    if (id) {
      void getRoleByIdFx({ roleId: id })
    }
  }, [id]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await updateRoleFx({
        roleId: id,
        body: {
          ...formData,
          permission_slugs: formData.permission_slugs.map((item) => {
            if (typeof item === 'string') return item;
            return item.key;
          })
        }
      })
      reloadRolesList()
      userRoles.navigate();
    } catch (e) {
      if (e.response.non_field_errors?.[0] === `Role with '${formData.name}' already exists.`) {
        setShowduplicateRecordWarning(true)
      }
      console.error(e)
    }
  }
  if (!editData) return null;
  return (
    <>
      <PageTitleComponent
        title={"Edit Role"}
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
      {formData && <RoleForm
        formData={formData}
        onSubmit={onSubmit}
        updateFormData={(props) => {
          updateFormData({
            ...formData,
            ...props
          })
        }}
        isEdit={true}
      />}
    </>
  )
}

export default EditRole