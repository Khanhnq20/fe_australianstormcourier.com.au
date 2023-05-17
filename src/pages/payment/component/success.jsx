import { useStripe } from '@stripe/react-stripe-js';
import React from 'react'
import { Container } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';

function SuccessPayment() {
  const [searchParams] = useSearchParams();
  const keyParams = ["payment_intent", "payment_intent_client_secret", "redirect_status"];
  React.useEffect(() =>{

    // =2032
    // =pi_3N7xHWKfaw4OxeNd0w3bVqWW
    // =pi_3N7xHWKfaw4OxeNd0w3bVqWW_secret_e9uTtC37Byq4qJfimx6pjFEaf
    // =succeeded
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