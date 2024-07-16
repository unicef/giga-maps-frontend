import { Button, } from '@carbon/react'
import { useStore } from 'effector-react';
import { useEffect } from 'react';

import { contactMessageView, router } from '~/core/routes';

import { getContactMessageIdFx } from '../../effects/contact-message-fx';
import { $formContactMessage } from '../../models/contact-message.model';
import PageTitleComponent from '../common-components/page-title-component'
import { BottomButtonWrapper, ContactMessageTextWrapper, InputBoxWrapper, InputContainer, InputLabel, RowContainer, } from '../styles/admin-styles'


const ViewContactMessage = () => {

  const formContactMessage = useStore($formContactMessage);
  const { id } = useStore(contactMessageView.params);
  useEffect(() => {
    if (id) {
      void getContactMessageIdFx({ id })
    }
  }, [id]);
  return (
    <>
      <PageTitleComponent
        title={"View Contact Messages"}
        recentlyView={false} />
      <RowContainer>
        <InputContainer>
          <InputLabel>
            Full Name
          </InputLabel>
          <InputBoxWrapper>
            <ContactMessageTextWrapper>
              {formContactMessage?.full_name}
            </ContactMessageTextWrapper>
          </InputBoxWrapper>
        </InputContainer>
        <InputContainer>
          <InputLabel>
            Purpose
          </InputLabel>
          <InputBoxWrapper>
            <ContactMessageTextWrapper>
              {formContactMessage?.purpose}
            </ContactMessageTextWrapper>

          </InputBoxWrapper>
        </InputContainer>
      </RowContainer>
      <RowContainer>
        <InputContainer>
          <InputLabel>
            Organization
          </InputLabel>
          <InputBoxWrapper>
            <ContactMessageTextWrapper>
              {formContactMessage?.organisation}
            </ContactMessageTextWrapper>
          </InputBoxWrapper>
        </InputContainer>
        <InputContainer>
          <InputLabel>
            Message
          </InputLabel>
          <InputBoxWrapper>
            <ContactMessageTextWrapper>
              {formContactMessage?.message}
            </ContactMessageTextWrapper>
          </InputBoxWrapper>
        </InputContainer>
      </RowContainer>
      <BottomButtonWrapper>
        <Button
          kind="secondary"
          onClick={() => {
            router.back();
          }}
        >
          Cancel
        </Button>
      </BottomButtonWrapper>
    </>
  )
}

export default ViewContactMessage