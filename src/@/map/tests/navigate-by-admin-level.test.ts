import { getNavigateByAdminLevelDefault } from '../map.model';

describe('getNavigateByAdminLevelDefault', () => {
  it('defaults to off on mobile', () => {
    expect(getNavigateByAdminLevelDefault(undefined, true)).toBe(false);
  });

  it('defaults to on outside mobile', () => {
    expect(getNavigateByAdminLevelDefault(undefined, false)).toBe(true);
  });

  it('prefers an explicit stored choice over the viewport default', () => {
    expect(getNavigateByAdminLevelDefault(true, true)).toBe(true);
    expect(getNavigateByAdminLevelDefault(false, false)).toBe(false);
  });

  it('ignores a stored value that is not a boolean', () => {
    expect(getNavigateByAdminLevelDefault(null, true)).toBe(false);
    expect(getNavigateByAdminLevelDefault('true', true)).toBe(false);
  });
});
