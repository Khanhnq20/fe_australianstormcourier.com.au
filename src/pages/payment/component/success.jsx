import { useStripe } from '@stripe/react-stripe-js';
import React from 'react'
import { Container } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';

function SuccessPayment() {
  const [searchParams] = useSearchParams();
  const keyParams = ["payment_intent", "payment_intent_client_secret", "redirect_status"];
  
  React.useEffect(() =>{
  },[]);

  if(!keyParams.every(key => searchParams.has(key)))
    return <Container>
      <h2>Failed</h2>
    </Container>

  return (
    <Container>
      <h2>
        Success
      </h2>
    </Container>
  )
}

export default SuccessPayment