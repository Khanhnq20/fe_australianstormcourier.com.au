import React from 'react';
import '../style/footer.css'

export default function Footer() {
  return (
    <div className='ft-root'>
        <div className='container'>
            <div className='ft-content'>
                <p className='m-0'>© 2020 Australianstormcourier. All Rights Reserved.</p>
            </div>
        </div>
    </div>
  )
}

Footer.Custom = function(){
  return (
    <div className='ft-root-cus'>
        <div className='container'>
            <div className='ft-content'>
                <p className='m-0'>© 2020 Australianstormcourier. All Rights Reserved.</p>
            </div>
        </div>
    </div>
  )
}
