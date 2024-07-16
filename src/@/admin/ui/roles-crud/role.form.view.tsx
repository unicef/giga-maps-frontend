import { Button, Form, TextInput } from '@carbon/react'
import { useStore } from 'effector-react';
import { FormEvent, useMemo } from 'react';

import { router } from '~/core/routes';

import { $appConfigValues } from '../../models/admin-model';
import { BottomButtonWrapper, InputBoxWrapper, InputContainer, InputLabel, RowContainer, SelectRoles } from '../styles/admin-styles'

type RoleFormProps = {
  formData: {
    name: string;
    description: string;
    permission_slugs: string[];
  },
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isEdit?: boolean;
  updateFormData: (arg: Record<string, string | string[]>) => void;
}
type PermissionType = { key: string, text: string };
const $permissionDataList = $appConfigValues.map(config => Object.entries(config?.PERMISSION_CHOICES || []).map(([key, text]) => ({ key, text })));

const RoleForm = ({ formData, onSubmit, isEdit = false, updateFormData }: RoleFormProps) => {
  const permissionDataList = useStore($permissionDataList);
  const selectedPermission = useMemo(() => {
    if (permissionDataList.length && typeof formData.permission_slugs?.[0] === 'string') {
      return permissionDataList?.filter((item: PermissionType) => formData.permission_slugs?.includes(item.key));
    }
    return formData.permission_slugs;
  }, [formData.permission_slugs, permissionDataList])

  return (
    <>
      <Form onSubmit={onSubmit}>
        <RowContainer>
          <InputContainer>
            <InputLabel>
              Role Name
            </InputLabel>
            <InputBoxWrapper>
              <TextInput
                type="text"
                name="name"
                placeholder='Enter role name'
                required
                value={formData.name}
                onChange={e => updateFormData({ [e.target.name]: e.target.value })}
              />
            </InputBoxWrapper>
          </InputContainer>
          <InputContainer>
            <InputLabel>
              Role Description
            </InputLabel>
            <InputBoxWrapper>
              <TextInput
                type="text"
                name="description"
                placeholder='Enter role description'
                value={formData.description}
                onChange={e => updateFormData({ [e.target.name]: e.target.value })}
              />
            </InputBoxWrapper>
          </InputContainer>
        </RowContainer>
        <RowContainer>
          {!!permissionDataList?.length && <InputContainer>
            <SelectRoles
              required
              titleText="Select permission"
              id={`role-select`}
              name="school_ids"
              items={permissionDataList}
              itemToString={(item: PermissionType) => item?.text}
              itemToElement={(item: PermissionType) => (
                <span>
                  {item?.text}
                </span>
              )}
              initialSelectedItems={selectedPermission}
              onChange={({ selectedItems }: { selectedItems: PermissionType[] }) => updateFormData({ permission_slugs: selectedItems })}
              placeholder="Search Permissions" />
          </InputContainer>
          }
        </RowContainer>
        <BottomButtonWrapper>
          <Button
            kind="secondary"
            onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            type='submit'
            kind="primary">
            {isEdit ? 'Update' : 'Save'}
          </Button>
        </BottomButtonWrapper>
      </Form>
    </>
  )
}

export default RoleForm