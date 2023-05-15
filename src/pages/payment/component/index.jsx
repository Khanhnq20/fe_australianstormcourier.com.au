import React, { useState } from 'react'
import { Container } from 'react-bootstrap'
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './checkoutform';
import { config } from '../../../api';
import { Navigate } from 'react-router-dom';

function Index({clientSecret, ...props}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const stripePromise = loadStripe(config.StripePublicKey);
  if(!clientSecret){
    return (<Navigate to="/error/404">
    </Navigate>)
  }

  return (
    <Container>
      <Elements
        stripe={stripePromise} 
        options={{
          clientSecret: clientSecret,
        }}
      >
        <CheckoutForm clientSecret={clientSecret}/>
      </Elements>
    </Container>
  )
}

export { default as SuccessPayment } from './success';
export { default as FailurePayment } from './failed';
export default Index;