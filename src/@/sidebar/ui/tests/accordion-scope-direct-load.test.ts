// Imported lazily: the router reads the URL when it is created, so the URL has
// to be in place before any module that loads the routes.
describe('Sidecard scope on a direct country load', () => {
  it('starts in the country scope', async () => {
    window.history.replaceState(null, '', '/map/country/br');

    const { $accordionScope } = await import('../../sidebar.model');

    expect($accordionScope.getState()).toBe('country');
  });
});
