import { describe, test, } from '@jest/globals';
import { render, } from '@testing-library/react';

import SignUpAvatarComponent from '~/@/common/sign-up-avatar-component/sign-up-avatar-component';


describe('AboutGigaMapModal', () => {
  test('renders AboutGigaMapModal and take a snapshop', () => {
    render(<SignUpAvatarComponent UserLastname={"Test User"} designation={"Admin"} />)
  });
})