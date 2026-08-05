import { shouldOpenLegendPopup } from '../ui/legend-info/legend-popup';

describe('legend popup visibility', () => {
  test('hides for country and search lists only on mobile', () => {
    expect(
      shouldOpenLegendPopup({
        open: true,
        isMobile: true,
        isCountryListOpen: true,
        isSearchListOpen: false,
      }),
    ).toBe(false);
    expect(
      shouldOpenLegendPopup({
        open: true,
        isMobile: true,
        isCountryListOpen: false,
        isSearchListOpen: true,
      }),
    ).toBe(false);
    expect(
      shouldOpenLegendPopup({
        open: true,
        isMobile: false,
        isCountryListOpen: true,
        isSearchListOpen: true,
      }),
    ).toBe(true);
  });

  test('hides when sidebar menu is open', () => {
    expect(
      shouldOpenLegendPopup({
        open: true,
        isMobile: false,
        isCountryListOpen: false,
        isSearchListOpen: false,
        isMenuOpen: true,
      }),
    ).toBe(false);
    expect(
      shouldOpenLegendPopup({
        open: true,
        isMobile: true,
        isCountryListOpen: false,
        isSearchListOpen: false,
        isMenuOpen: true,
      }),
    ).toBe(false);
  });
});
