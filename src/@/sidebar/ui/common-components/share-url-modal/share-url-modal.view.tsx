import { Email, LogoTwitter, LogoWechat } from '@carbon/icons-react';
import { CopyButton, IconButton, Link, TextInput } from '@carbon/react';

import { Modal, ModalBody, ModalHeader } from '~/@/common/modal';

import { Scroll } from '@/scroll';

import Twitter from '../../../../../assets/images/twitter.svg'
import WhatsApp from '../../../../../assets/images/whatsapp.svg'
import { $layerFilterHeadingStyle } from '../styles/layer-filter-modal.style';
import { ShareModalStyle, ShareUrlStyle } from './share-url.style';

const ShareURLModal = ({ shareModalOpen, setshareModalOpen, currentLink }:
  { shareModalOpen: boolean, setshareModalOpen: React.Dispatch<React.SetStateAction<boolean>>, currentLink: string }) => {

  const copyToClipboard = () => {
    void navigator.clipboard.writeText(currentLink);
  }

  return (
    <Modal
      open={shareModalOpen}
      onClose={() => {
        setshareModalOpen(false);
      }}
      $containerStyle={ShareModalStyle}
      preventCloseOnClickOutside
    >
      <ModalHeader title="Share" $headingStyle={$layerFilterHeadingStyle} closeModal={() => setshareModalOpen(false)} />
      <Scroll>
        <ModalBody $style={ShareUrlStyle}>
          <div className='field-wrapper'>
            <span>Copy URL</span>
            <div className='text-input-container'>
              <TextInput labelText="" id="text-input-1" type="text" value={currentLink} readOnly />
              <CopyButton align="bottom" className='copy-button' iconDescription="Copy" onClick={copyToClipboard} />
            </div>
          </div>
          <div className='share-icons-container'>
            <span>Or share using</span>
            <div className='social-share-icons'>
              <Link target="_blank"
                href={`https://twitter.com/intent/tweet?text=Giga Maps&url=https://twitter.com/intent/tweet?text=giga-maps&url=${encodeURIComponent(`${currentLink}`)}`}>
                <IconButton
                  size="lg"
                  label='Twitter'
                  kind="ghost"
                  align={'bottom'}
                >
                  {/* <LogoTwitter size={32} className="twitter-icon" /> */}
                  <Twitter className="twitter-icon" />
                </IconButton>
              </Link>
              <Link target="_blank"
                href={`mailto:?subject=Giga Maps – Navigation Link&body=${encodeURIComponent(`Dear User,
                I hope this email finds you well. I'd like to share the GIGA Maps URL with you:
                Application URL - ${currentLink}
                This link will take you to the GIGA Maps application, allowing you to navigate through it.
                
                Regards,
                gigamaps
                Support Mail Id: giga@mail.unicef.org
                ©2023-2024 All rights reserved`)}`}
              >
                <IconButton
                  size="lg"
                  label='Email'
                  kind="ghost"
                  align={'bottom'}
                >
                  <Email size={32} />
                </IconButton>
              </Link>
              <Link href={`https://api.whatsapp.com/send?text=Giga%20Maps%20${encodeURIComponent(`${currentLink}`)}`}
                target="_blank"
              >
                <IconButton
                  size="lg"
                  label='WhatsApp'
                  kind="ghost"
                  align={'bottom'}
                >
                  {/* <LogoWechat size={32} /> */}
                  <WhatsApp />
                </IconButton>
              </Link>
            </div>
          </div>
        </ModalBody>
      </Scroll>
    </Modal>
  )
}

export default ShareURLModal
