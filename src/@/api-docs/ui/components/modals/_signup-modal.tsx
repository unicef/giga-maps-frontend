
import { ArrowRight, } from '@carbon/icons-react';
import { Button, ComposedModal, Form, Link, ModalBody, ModalHeader, TextInput } from '@carbon/react';

import GigaMapLogo from '~/assets/images/giga-map-signUp.svg';
import ApiIcon from '~/assets/images/sign-page-logo.svg';

const DownloadApiSignUpModal = ({ modalOpen, setModalOpen, buttonRef }:
  { modalOpen: boolean, setModalOpen: React.Dispatch<React.SetStateAction<boolean>>, buttonRef: React.MutableRefObject<null> }) => {


  return (
    <>
      <ComposedModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
        launcherButtonRef={buttonRef}
        preventCloseOnClickOutside
        className='download-api-signUp-modal'
      >
        <ModalHeader className='download-api-signUp-modal-header' title="Sign Up" />
        <ModalBody className='download-api-signUp-modal-body'>
          <div className='download-api-signUp-modal-body-left'>
            <p>Lorem ipsum dolor sit lorem a amet, consectetur adipiscing elit</p>
            <Form aria-label="download-api-signUp-form">
              <TextInput id='' type="email" labelText="Email"
                className='download-api-signUp-form-field' />
              <div className='download-api-signUp-form-field'>
                <TextInput.PasswordInput type="password"
                  labelText="Password"
                  id='signPassword'
                  required pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}" />
              </div>
              <div className='download-api-signUp-form-field'>
                <TextInput.PasswordInput type="password"
                  id='signpasswordConfirm'
                  labelText="Confirm Password"
                  required pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}" />
              </div>
              <Button type="submit"
                className="download-api-signUp-button"
                renderIcon={ArrowRight} >
                Sign up
              </Button>
            </Form>
            <div className='download-api-signUpWith-sso'>
              <p>Or sign up using</p>
              <div style={{ display: "flex" }}>
                <Button
                  onClick={() => { }}
                  className='download-api-signUpWith-sso-button'
                  renderIcon={ArrowRight}
                  kind="tertiary" >
                  Microsoft SSO
                </Button>
              </div>
            </div>
          </div>
          <div className='download-api-signUp-modal-body-right'>
            <ApiIcon />
            <div className='download-api-signUp-modal-info'>
              <h5>Welcome to</h5>
              <GigaMapLogo />
              <h3>APIs and Download</h3>
              <h4>Discover the world of our APIs</h4>
              <p>Already have an account ?<Link href="#">Log In</Link> </p>
            </div>
          </div>
        </ModalBody>
      </ComposedModal >
    </>
  )
}

export default DownloadApiSignUpModal
