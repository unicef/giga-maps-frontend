import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { getRoleByIdFx, updateRoleFx } from '~/@/admin/effects/user-management-fx';
import { $formData } from '~/@/admin/models/giga-layer.model';
import { $roleByIdResponse, reloadRolesList } from '~/@/admin/models/user-management.model';
import { editRoles, userRoles } from '~/core/routes';
import { testWrapper } from '~/tests/jest-wrapper';
import EditRole from '../edit-role.view';
import { fetchMockResponse } from '~/tests/fetchMock';

describe('EditRole', () => {
  beforeEach(() => {
    fetchMock.mockResponse((req: any) => {
      if (req.url.includes('api/auth/roles/5')) {
        return Promise.resolve(JSON.stringify({
          "id": 5,
          "name": "Filter Management",
          "category": "custom",
          "description": "Test",
          "created": "29-08-2024 10:47:10",
          "last_modified_at": "29-08-2024 10:47:10",
          "permission_slugs": []
        }))
      }
    })

  });

  it('should render null when editData is not available', () => {
    editRoles.navigate({ id: 0 });
    const { container } = render(testWrapper(<EditRole />));
    expect(container.firstChild).toBeNull();
  });

  it('should render edit role form when data is available', async () => {
    await editRoles.navigate({ id: 5 });
    await getRoleByIdFx({ roleId: 5 })
    render(testWrapper(<EditRole />));
    expect(screen.getByText('Edit Role')).toBeInTheDocument();
  });

  it('should handle form submission successfully', async () => {
    await editRoles.navigate({ id: 5 });
    await getRoleByIdFx({ roleId: 5 })
    const { container } = render(testWrapper(<EditRole />));

    const form = container.querySelector('form');
    await fireEvent.submit(form as HTMLFormElement);
  });

  it('should handle duplicate role error', async () => {
    fetchMock.mockResponse((req) => fetchMockResponse(req), (req) => {
      console.log('loge errrr.......')
      return Promise.reject(JSON.stringify({ non_field_errors: ['Role with \'Filter Management\' already exists.'] }))
    })
    await editRoles.navigate({ id: 5 });
    await getRoleByIdFx({ roleId: 5 })
    const { container } = render(testWrapper(<EditRole />));

    const form = container.querySelector('form');
    await fireEvent.submit(form as HTMLFormElement);
    expect(editRoles.visible.getState()).toBe(true)
  });
});
