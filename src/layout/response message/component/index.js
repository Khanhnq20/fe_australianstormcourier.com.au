import React from 'react';
import '../style/resMessage.css';
import {IoIosCheckmarkCircleOutline} from 'react-icons/io';
import {BsExclamationCircle} from 'react-icons/bs'

export default function Message({children,...rest}) {
  return (
    <div className='mes-root' {...rest}>
        {children}
    </div>
  )
}

Message.Success = function ({children,...rest}){
    return(
        <div className='mes-success' {...rest}>
            <IoIosCheckmarkCircleOutline style={{fontSize:'20px'}}></IoIosCheckmarkCircleOutline>
            <div>
                {children}
            </div>
        </div>
    )
}

Message.Error = function ({children,...rest}){
    return(
        <div className='mes-error' {...rest}>
            <BsExclamationCircle></BsExclamationCircle>
            <div>
                {children}
            </div>
        </div>
    )
}

