import { Button, Form, Select, SelectItem, TextInput } from '@carbon/react'
import { createEvent, createStore, sample } from 'effector';
import { useStore } from 'effector-react';
import { FormEvent, useEffect } from 'react';

import { router, userDetails, userList } from '~/core/routes'

import { getRolesListFx, getUserByIdFx, updateUserFx } from '../../effects/user-management-fx';
import { $roleListResponse, $userByIdResponse, reloadUserList } from '../../models/user-management.model';
import { checkForChangeFields } from '../../utils/common.util';
import PageTitleComponent from '../common-components/page-title-component'
import { BottomButtonWrapper, InputBoxWrapper, InputContainer, InputLabel, RowContainer } from '../styles/admin-styles'

const getUserDetailData = createEvent<{ userId: number }>();
const getFields = data => ({
  first_name: data?.first_name ?? "",
  last_name: data?.last_name ?? "",
  is_active: data?.is_active ?? false,
  role: data?.role.id ?? 0
})
sample({
  source: getUserDetailData,
  target: getUserByIdFx
});

const $userEditForm = createStore<Record<string, string | number | boolean>>({});
const updateUserForm = createEvent<[string, string | number | boolean]>();

$userEditForm.on(updateUserForm, (state, payload) => {
  state[payload[0]] = payload[1];
  return { ...state };
})

sample({
  source: $userByIdResponse,
  fn: (data) => {
    return getFields(data)
  },
  target: $userEditForm,
})

const UserDetailsComponent = () => {
  const oldFormData = useStore($userByIdResponse);
  const formData = useStore($userEditForm);
  const { userId: id } = useStore(userDetails.params) as { userId: number };
  const { results: roleList } = useStore($roleListResponse) ?? {};

  useEffect(() => {
    getUserDetailData({ userId: id });
    void getRolesListFx({ page: 1, pageSize: 500 });
  }, [id])


  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await updateUserFx({
        userId: id,
        body: checkForChangeFields(formData, getFields(oldFormData))
      })
      reloadUserList();
      userList.navigate();
    } catch (e) { console.error(e) }
  }

  return (
    <>
      <PageTitleComponent
        title={"User details"}
        subTitle={"Details for user"}
        recentlyView={true} />
      <Form onSubmit={onSubmit}>
        <RowContainer>
          <InputContainer>
            <InputLabel>
              First Name
            </InputLabel>
            <InputBoxWrapper>
              <TextInput id='username' labelText="" type="text"
                placeholder='Enter Username' required value={formData?.first_name as string} onChange={(e) => updateUserForm(['first_name', e.target.value])} />
            </InputBoxWrapper>
          </InputContainer>
          <InputContainer>
            <InputLabel>
              Last Name
            </InputLabel>
            <InputBoxWrapper>
              <TextInput id='username' labelText="" type="text"
                placeholder='Enter Username' required value={formData?.last_name as string} onChange={(e) => updateUserForm(['last_name', e.target.value])} />
            </InputBoxWrapper>
          </InputContainer>
          <InputContainer>
            <InputLabel>
              Email
            </InputLabel>
            <InputBoxWrapper>
              <TextInput id='email' labelText="" type="text"
                placeholder='Enter Email' disabled value={oldFormData?.email as string} />
            </InputBoxWrapper>
          </InputContainer>
          <InputContainer>
            <Select labelText="Role"
              id={`Role-select`}
              placeholder="Select Role"
              value={formData.role as number}
              onChange={(e) => updateUserForm(['role', Number(e.target.value)])}
            >
              <SelectItem value="" text="Select Role" />
              {roleList?.map((role) => (
                <SelectItem key={role.id} value={role.id} text={role.name} />
              ))}
            </Select>
          </InputContainer>
          <InputContainer>
            <Select labelText="Status"
              id={`Status-select`}
              placeholder="Select Status"
              value={formData.is_active ? 'active' : 'inactive'}
              onChange={(e) => updateUserForm(['is_active', e.target.value === 'active'])}
            >
              <SelectItem value="active" text="Active" />
              <SelectItem value="inactive" text="Inactive" />
            </Select>
          </InputContainer>
        </RowContainer>
        <BottomButtonWrapper>
          <Button
            kind="secondary"
            onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            data-testid="submit-admin-user-details"
            type='submit'
            kind="primary">
            Save
          </Button>
        </BottomButtonWrapper>
      </Form>
    </>
  )
}

export default UserDetailsComponent