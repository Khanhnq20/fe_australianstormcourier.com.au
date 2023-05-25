import { useStripe } from '@stripe/react-stripe-js';
import React, { useState } from 'react'
import { Button, Container } from 'react-bootstrap';
import {BsClipboard2Check} from 'react-icons/bs';
import '../style/index.css'

function SuccessPayment({result}) {
  const [showInvoice, setShowInvoice] = useState(false);

  return (
    <Container className='p-success-root'>
      <div className='p-success-icon-form'>
        <BsClipboard2Check className='p-success-icon'></BsClipboard2Check>
      </div>
      <div>
        <h2 className='txt-center'>
          Transaction Completed Successfully
        </h2>
        <p className='p-txt-grey txt-center'>Thanks for your billing</p>
        <div className='txt-center'>
          <Button className='my-btn-yellow mx-2'>Print Invoice</Button>
          <Button className='my-btn-yellow mx-2' onClick={() => setShowInvoice(i => !i)}>Invoice View</Button>
        </div>
        {showInvoice && <div>
          <pre>{JSON.stringify(result, 4, 4)}</pre>
        </div>}
      </div>
    </Container>
  )
}

export default SuccessPayment