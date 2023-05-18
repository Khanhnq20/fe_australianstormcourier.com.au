import { useStripe } from '@stripe/react-stripe-js';
import React from 'react'
import { Button, Container } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import {BsClipboard2Check} from 'react-icons/bs';
import '../style/index.css'

function SuccessPayment() {
  const [searchParams] = useSearchParams();
  const keyParams = ["payment_intent", "payment_intent_client_secret", "redirect_status"];
  
  React.useEffect(() =>{
  },[]);

  // if(!keyParams.every(key => searchParams.has(key)))
  //   return <Container>
  //     <h2>Failed</h2>
  //   </Container>

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
          <Button className='my-btn-yellow mx-2'>Invoice View</Button>
        </div>
      </div>
    </Container>
  )
}

export default SuccessPayment