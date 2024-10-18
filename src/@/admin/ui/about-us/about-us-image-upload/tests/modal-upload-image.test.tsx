import { fireEvent, render, screen } from "@testing-library/react";
import ModalUploadImage from "../modal-upload-image";

describe('ModalUploadImage', () => {
  const setOpen = jest.fn();
  it('should render the modal when open is true', () => {
    render(<ModalUploadImage open={true} setOpen={setOpen} />)
    expect(screen.getByText('Image Upload')).toBeInTheDocument();
  });

  it('should close the modal when the close button is clicked', () => {
    render(<ModalUploadImage open={true} setOpen={setOpen} />)
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    expect(setOpen).toHaveBeenCalledWith(false);
  });

  it('should not render the modal when open is false', () => {
    render(<ModalUploadImage open={false} setOpen={setOpen} />)
    expect(screen.queryByText('Image Upload')).not.toBeInTheDocument();
  });
});