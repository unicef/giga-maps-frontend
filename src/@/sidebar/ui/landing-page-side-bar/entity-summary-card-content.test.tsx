import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeAll, describe, expect, it } from 'vitest';

import { testWrapper } from '~/tests/test-wrapper';
import EntitySummaryCardContent from './entity-summary-card-content';

beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe('EntitySummaryCardContent InfoTooltip', () => {
  it('toggles tooltip on tap/click of info icon button', async () => {
    const card = {
      metrics: [
        {
          detail: 'Detail text',
          label: 'Test Metric',
          tooltip: 'Test Tooltip Content',
          value: 100,
        },
      ],
    };

    render(
      testWrapper(
        <EntitySummaryCardContent
          card={card}
          lng="en"
          t={((key: string) => key) as any}
        />,
      ),
    );

    const button = screen.getByRole('button', { name: 'Test Tooltip Content' });
    expect(button).toBeInTheDocument();

    // Click/tap the info icon button to open tooltip
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    // Click/tap again to close tooltip
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });
});
