import '../style/common-component.scss'

import { ArrowRight, } from '@carbon/icons-react';
import { Button } from '@carbon/react';
import React from 'react'

const SignUpAvatarComponent = ({ UserLastname, designation }: { UserLastname: string, designation: string }) => {
  return (
    <>

      <div className='side-info-download-api-signup' >
        {/* <Button
          onClick={() => { }}
          renderIcon={ArrowRight}
          kind="tertiary" >
          Signup
        </Button> */}
        <div className='side-info-download-api-avatar-username'>
          <div className='side-info-download-api-avatar'>
            UL
          </div>
          <div className='side-info-download-api-username'>
            <span>{UserLastname}</span>
            {
              designation !== "" &&
              <p>{designation}</p>}
          </div>
        </div>
      </div >
      <div className='side-info-download-api-bottom-line'></div>
    </>
  )
}

export default SignUpAvatarComponent