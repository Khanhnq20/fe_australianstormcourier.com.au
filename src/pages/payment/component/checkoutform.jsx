import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import { Spinner } from "react-bootstrap";
import { authConstraints } from "../../../api";
import { Message } from "../../../layout";
import { useNavigate } from "react-router-dom";

const CheckoutForm = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const stripe = useStripe();
    const elements = useElements();
  
    const handleSubmit = async (event) => {
      // We don't want to let default form submission happen here,
      // which would refresh the page.
        event.preventDefault();
  
        if (!stripe || !elements) {
            // Stripe.js hasn't yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }
  
        const result = await stripe.confirmPayment({
            //`Elements` instance that was used to create the Payment Element
            elements,
            confirmParams: {
                return_url: [authConstraints.paymentRoot, authConstraints.postCheckoutStripe].join("/"),
            },
        });
  
        if (result.error) {
          // Show error to your customer (for example, payment details incomplete)
          setError(result.error.message);
        } else {
          // Your customer will be redirected to your `return_url`. For some payment
          // methods like iDEAL, your customer will be redirected to an intermediate
          // site first to authorize the payment, then redirected to the `return_url`
          navigate("/payment/checkout/success");
          navigate("/payment/checkout/failed");
        }
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <Message.Error>{error}</Message.Error>
        <PaymentElement />
        <button disabled={!stripe}>Submit</button>
      </form>
    )
  };

export default CheckoutForm;