import { fireEvent, render, screen } from '@testing-library/react';

import { testWrapper } from '~/tests/test-wrapper';

import { fetchLandingContentFx } from '../landing.model';
import { SuccessStoriesSection } from '../ui/success-stories-section';

const body =
  'Acknowledging its critical importance in promoting transparency and accountability, the Ministry of ICT and Innovation has advocated for the adoption of the Daily Check App.';

const sections = [
  {
    content: [
      {
        cta: { link: ['https://giga.global/stories/sao-tome'] },
        text: [body],
        title: 'Sao Tome and Principe',
      },
    ],
    id: 9,
    title: 'Success stories',
    type: 'slides',
  },
];

// The stores are global, so the section is fed the way the page feeds it.
const seed = async () => {
  fetchMock.mockResponseOnce(JSON.stringify(sections));
  await fetchLandingContentFx();
};

describe('SuccessStoriesSection', () => {
  beforeEach(async () => {
    await seed();
  });

  it('shows the story dialog only after the card is clicked', () => {
    render(testWrapper(<SuccessStoriesSection />));

    expect(screen.queryByRole('dialog')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: /Sao Tome/ }));

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveTextContent(body);
  });

  it('moves the CMS link inside the dialog, so the card stays a single control', () => {
    render(testWrapper(<SuccessStoriesSection />));

    expect(screen.queryByRole('link')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: /Sao Tome/ }));

    expect(
      screen.getByRole('link', { name: 'Read Full Story' }),
    ).toHaveAttribute('href', 'https://giga.global/stories/sao-tome');
  });
});
