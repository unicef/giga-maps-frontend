import { splitOutsideParens } from './data-source-utils';

describe('splitOutsideParens', () => {
  it('splits sources on commas and semicolons', () => {
    expect(splitOutsideParens('NIC.br, Government; Ericsson')).toEqual([
      'NIC.br',
      'Government',
      'Ericsson',
    ]);
  });

  it('does not split inside parentheses', () => {
    expect(splitOutsideParens('Ookla (speedtest.net, 2024), ITU')).toEqual([
      'Ookla (speedtest.net, 2024)',
      'ITU',
    ]);
  });

  it('keeps a year attached to the previous source', () => {
    expect(splitOutsideParens('Gambia Ministry of Health, 2026')).toEqual([
      'Gambia Ministry of Health, 2026',
    ]);
    expect(
      splitOutsideParens('EMIS, 2019-2020; Ministry of Education, 2023/24'),
    ).toEqual(['EMIS, 2019-2020', 'Ministry of Education, 2023/24']);
  });

  it('keeps a leading year as its own source', () => {
    expect(splitOutsideParens('2026, Government')).toEqual([
      '2026',
      'Government',
    ]);
  });
});
