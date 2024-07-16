import { describe, test, } from '@jest/globals';
import { fireEvent, render, waitFor, } from '@testing-library/react';

import Acknowledgement from '../Sections/acknowledgement';
import FooterLinks from '../Sections/footer-links';
import FrequentlyAskedQuestions from '../Sections/frequently-asked-questions';
import GetInTouch from '../Sections/get-in-touch';
import aboutusData from '~/tests/data/aboutus-data';
import LiveMap from '../Sections/live-map';

describe('CaseStudyCard', () => {

  test('renders CaseStudyCard and take a snapshop', () => {
    const { asFragment } = render(<Acknowledgement data={aboutusData.find((data) => data.type === 'eleventh')} />);;
    expect(asFragment()).toMatchSnapshot();
  });
  test('renders FooterLinks and take a snapshop', () => {
    const { asFragment } = render(<FooterLinks data={aboutusData.find((data) => data.type === 'footer')} />);
    expect(asFragment()).toMatchSnapshot();
  });

  test('renders FrequentlyAskedQuestions and take a snapshop', () => {
    const { asFragment } = render(<FrequentlyAskedQuestions data={aboutusData.find((data) => data.type === 'faqs')} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders LiveMap and take a snapshop', () => {
    const { asFragment } = render(<LiveMap data={aboutusData.find((data) => data.type === 'live-map')} />)
    expect(asFragment()).toMatchSnapshot();
  })

  it('renders LiveMap and take a snapshop', () => {
    const data = { ...aboutusData.find(data => data.type === 'live-map'), title: null };
    const { asFragment } = render(<LiveMap data={data} />)
    expect(asFragment()).toMatchSnapshot();
  })

  test('renders GetInTouch and take a snapshop', () => {
    const { asFragment } = render(<GetInTouch data={aboutusData.find((data) => data.type === 'live-map-get-in-touch')} />);
    expect(asFragment()).toMatchSnapshot();
  });

})