import { fireEvent, render, screen } from "@testing-library/react"
import { createEvent } from "effector"

import { aboutUsImageList } from "~/tests/data/admin-about-us-image-list";
import { testWrapper } from "~/tests/jest-wrapper"

import { $imageList } from "../../models/about-us-model";
import ListImage from "../about-us/about-us-image-upload/list-image"
import ModalUploadImageContent from "../about-us/about-us-image-upload/modal-upload-image-content";

const setImageList = createEvent();
$imageList.on(setImageList, (_, payload) => payload)

describe("About Us image upload", () => {

  test("Render MainAboutUsView", () => {
    setImageList(aboutUsImageList)
    const { asFragment } = render(testWrapper(<ListImage />))
    expect(asFragment()).toMatchSnapshot();
  })

  test("Click on delete icon", () => {
    const handleClick = jest.fn();
    const { getByTestId } = render(testWrapper(<ListImage onClick={handleClick} />));
    const button = getByTestId(`delete-about-us-image${aboutUsImageList?.results[0].id}`);
    fireEvent.click(button);
    expect(screen.getByText('Delete role -')).toBeInTheDocument();
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    const parentElement = getByTestId(`admin-about-us-delete-image`);
  })

  test("Click on yes to delete image", () => {
    const handleClick = jest.fn();
    const { getByTestId } = render(testWrapper(<ListImage onClick={handleClick} />));
    const button = getByTestId(`delete-about-us-image${aboutUsImageList?.results[0].id}`);
    fireEvent.click(button);
    render(<ListImage />)
    const parentElement = getByTestId(`admin-about-us-delete-image`);
    const childElement = parentElement.getElementsByClassName('cds--actionable-notification__action-button')
    const buttonArray = Array.from(childElement);
    expect(buttonArray.length).toBeGreaterThan(0);
    buttonArray.forEach(button => {
      fireEvent.click(button);
    });
  })

  test("Render ModalUploadImageContent", () => {
    render(<ModalUploadImageContent setOpen={true} />)
  })

  test("Click submit", () => {
    const handleClick = jest.fn();
    const { getByTestId } = render(<ModalUploadImageContent setOpen={handleClick} />)
    // const nameInput = getByTestId('image-upload-name');
    // fireEvent.change(nameInput, { target: { value: 'Test Name' } });
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const fileInput = getByTestId('image-uploader').querySelector('input[type="file"]');
    fireEvent.change(fileInput, { target: { files: [file] } });
    fireEvent.submit(getByTestId('form-image-uplaod'));
  })
})
