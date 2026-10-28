import { parseTextLinks, splitOutsideParens } from './data-source-utils';

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

describe('parseTextLinks', () => {
  it('turns markdown links into link segments', () => {
    expect(
      parseTextLinks(
        'Sourced from [OpenStreetMap](https://www.openstreetmap.org), please [contact us](mailto:gigamaps@unicef.org).',
      ),
    ).toEqual([
      { text: 'Sourced from ' },
      { text: 'OpenStreetMap', href: 'https://www.openstreetmap.org' },
      { text: ', please ' },
      { text: 'contact us', href: 'mailto:gigamaps@unicef.org' },
      { text: '.' },
    ]);
  });

  it('accepts a space between label and url and bare domains', () => {
    expect(parseTextLinks('[OSM] (openstreetmap.org)')).toEqual([
      { text: 'OSM', href: 'https://openstreetmap.org' },
    ]);
  });

  it('keeps unsafe schemes as plain text', () => {
    const segments = parseTextLinks('[click](javascript:alert(1))');
    expect(segments.some(({ href }) => href)).toBe(false);
    expect(segments.map(({ text }) => text).join('')).toBe(
      '[click](javascript:alert(1))',
    );
  });

  it('returns plain text untouched', () => {
    expect(parseTextLinks('No links here')).toEqual([
      { text: 'No links here' },
    ]);
  });
});
