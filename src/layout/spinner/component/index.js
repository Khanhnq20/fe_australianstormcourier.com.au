import { ThreeDots } from 'react-loader-spinner';
import React from 'react';
import { Logo } from '../..';
import '../style/spinner.css'

export default function Index() {
  return (
    <div className='spinner-root'>  
        <div className='spinner'>
            <Logo className='spinner-logo'></Logo>
            <ThreeDots
            height="80"
            width="80"
            radius="9"
            color="var(--clr-primary)"
            ariaLabel="loading"
            wrapperStyle
            wrapperClass
            />
        </div>
    </div>
  )
}
