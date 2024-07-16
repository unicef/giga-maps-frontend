import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SideMenuPanel from '../components/side-menu-panel';
import userDetail from '~/tests/data/user-detail';
import { getUserDetailFx } from '~/core/auth/effects/auth-api-fx';


describe('SideMenuPanel', () => {

  beforeEach(() => {
    fetchMock.mockResponse((req) => {
      if (req.url.includes('auth/user_details/')) {
        return Promise.resolve(JSON.stringify(userDetail));
      }
      return Promise.resolve(JSON.stringify({}));
    })
  })
  test('renders login button when user is not logged in', async () => {
    render(<SideMenuPanel />);

    const loginButton = screen.getByRole('button', { name: /login\/signup/i });
    await userEvent.click(loginButton);
    expect(loginButton).toBeInTheDocument();
  });

  test('renders user shortname when user is logged in', async () => {
    document.body.innerHTML = '<div id="root"></div>';
    await getUserDetailFx()
    render(<SideMenuPanel />);

    const shortname = screen.getAllByText('aB', { exact: false });
    expect(shortname[0]).toBeInTheDocument();
  });

  test('navigates to explore api page when clicked', async () => {
    render(<SideMenuPanel />);

    const exploreApiLink = screen.getByRole('link', { name: /explore api’s/i });
    await userEvent.click(exploreApiLink);

    expect(window.location.pathname).toBe('/docs/explore-api');
  });

  test('navigates to api keys page when clicked and user is logged in', async () => {
    document.body.innerHTML = '<div id="root"></div>';
    await getUserDetailFx()

    render(<SideMenuPanel />);

    const apiKeysLink = screen.getByRole('link', { name: /api keys/i });
    await userEvent.click(apiKeysLink);

    expect(window.location.pathname).toBe('/docs/api-keys');
  });


  test('logs user out when logout button clicked', async () => {
    document.body.innerHTML = '<div id="root"></div>';
    await getUserDetailFx()

    render(<SideMenuPanel />);

    const logoutButton = screen.getByRole('button', { name: /logout/i });
    await userEvent.click(logoutButton);

    expect(logoutButton).toBeInTheDocument();
  });

});
