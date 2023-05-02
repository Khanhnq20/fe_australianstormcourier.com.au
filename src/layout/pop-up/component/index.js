import React from 'react';
import '../style/popUp.css'

export default function Index({children,isShow}) {
    console.log(isShow);
  return (<>
    {isShow ?  (<div className='pop-up'>{children}</div>) : <></>}
  </>
  )
}
