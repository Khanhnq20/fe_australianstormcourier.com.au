import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { Message } from "../../../layout";
import { Spinner } from "react-bootstrap";
import SuccessPayment from "./success";

const CheckoutForm = ({ clientSecret, checkoutServerAPI }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [amount, setAmount] = useState(0);
  const [success, setSuccess] = useState(false);
  const [resultJSON, setJSON] = useState({});

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setError(submitError?.message);
      setLoading(false);
      return;
    }

    stripe
      .confirmPayment({
        elements: elements,
        redirect: "if_required",
      })
      .then((result) => {
        if (!!result?.error) {
          if (result?.error?.payment_intent?.status === "succeeded") {
            checkoutServerAPI();
          }
          // Show error to your customer (for example, payment details incomplete);
          setError((i) => {
            return result?.error?.payment_intent?.status === "succeeded"
              ? "This payment has been resolved. Please select others"
              : result?.error?.message;
          });
        } else {
          setSuccess(true);
          setJSON(result.paymentIntent);
          checkoutServerAPI();
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (stripe && elements) {
      stripe
        .retrievePaymentIntent(clientSecret)
        .then((intent) => {
          if (intent.error) {
            setError(intent.error.message);
          } else {
            setAmount(intent.paymentIntent.amount);
          }
        })
        .catch((error) => {
          setError("Cannot connect to stripe server");
        });
    }
  }, [clientSecret, stripe, elements]);

  if (success) return <SuccessPayment result={resultJSON}></SuccessPayment>;

  return (
    <form className="container-fit p-3" onSubmit={handleSubmit}>
      {!!error && <Message.Error>{error}</Message.Error>}
      <PaymentElement
        options={{
          layout: "tabs",
        }}
      />
      <button
        type="submit"
        className="my-btn-yellow my-3"
        disabled={loading || !stripe || !elements}
      >
        {loading ? (
          <Spinner></Spinner>
        ) : (
          `Pay AUD \$${(amount / 100).toFixed(2)}`
        )}
      </button>
    </form>
  );
};

export default CheckoutForm;
