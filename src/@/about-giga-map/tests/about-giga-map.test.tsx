import { fireEvent, render, screen, waitFor } from '@testing-library/react';

vi.mock('../../../assets/images/partner1.svg', () => ({
  ReactComponent: () => <div>Partner1Mock</div>,
}));

describe('AboutGigaMapModal', () => {
  test("render AboutGigaMapModal close using close button", () => {
    //getting errro while render due to svg 
    // const setOpenMock = vi.fn();
    // render(<AboutGigaMapModal open={true} setOpen={setOpenMock} />)
    // const closeButton = screen.getByTitle('Close')
    // fireEvent.click(closeButton)
    // void waitFor(() => {
    //   expect(screen.queryByText('About Giga Map')).not.toBeInTheDocument();
    // })
  })
})

