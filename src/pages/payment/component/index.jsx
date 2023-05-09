import React, { useState, useRef } from 'react'
import { Container, Spinner } from 'react-bootstrap'
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './checkoutform';
import { authConstraints, authInstance } from '../../../api';
import { Navigate } from 'react-router-dom';

function Index() {
  const [loading, setLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState('');
  const [error, setError] = useState("");
  const loadTime = useRef(3);
  const stripePromise = loadStripe('pk_test_51N51n2Kfaw4OxeNdkCYEy1jHKnu75OPWTdJCe81kCggm0d6cfEj1IGBe9drdfpFrIjlxvR3p86sRloCxxwMPnOGd00PAqfO2dH');

  React.useEffect(() =>{
    function tryGettingClientSecret() {
      authInstance.post([authConstraints.paymentRoot, authConstraints.postStripeIntent].join("/"), null,{
        params: {
          amount: 45848,
          orderId: 1
        }
      }).then(response =>{
        if(!!response.data?.successed){
          setClientSecret(response.data?.clientSecrete);
          
        }
        else if(response?.data?.error){
          setError(response?.data?.error);
        }
      }).catch(error =>{
        if(loadTime.current > 0){
          loadTime.current--;
          tryGettingClientSecret();
        }
      }).finally(() =>{
        setLoading(false);
      });
    }

    tryGettingClientSecret();
  },[]);

  if(loading) return <Spinner></Spinner>

  if(!clientSecret){
    return (<Navigate to="/error/404">
    </Navigate>)
  }

  return (
    <Container>
      <h2 className="mb-2">Thanh toán tại đây</h2>

      <Elements 
        stripe={stripePromise} 
        options={{
          clientSecret: clientSecret
        }}>
        <CheckoutForm />
      </Elements>
    </Container>
  )
}

export { default as SuccessPayment } from './success';
export { default as FailurePayment } from './failed';
export default Index;