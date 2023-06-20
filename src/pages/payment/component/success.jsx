import { useStripe } from "@stripe/react-stripe-js";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { BsClipboard2Check } from "react-icons/bs";
import "../style/index.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CustomSpinner } from "../../../layout";
import moment from "moment";

// const a = {
//   "id": "pi_3NFZCcKfaw4OxeNd0fF9Wast",
//   "object": "payment_intent",
//   "amount": 36300,
//   "amount_details": {
//     "tip": {}
//   },
//   "automatic_payment_methods": {
//     "enabled": true
//   },
//   "canceled_at": null,
//   "cancellation_reason": null,
//   "capture_method": "automatic",
//   "client_secret": "pi_3NFZCcKfaw4OxeNd0fF9Wast_secret_742MknC19wE4ZZAv4eorL7vkc",
//   "confirmation_method": "automatic",
//   "created": 1685955350,
//   "currency": "aud",
//   "description": null,
//   "last_payment_error": null,
//   "livemode": false,
//   "next_action": null,
//   "payment_method": "pm_1NFZCnKfaw4OxeNdLv3TEdNo",
//   "payment_method_types": [
//     "card",
//     "link"
//   ],
//   "processing": null,
//   "receipt_email": "nttinh.catmedia@gmail.com",
//   "setup_future_usage": null,
//   "shipping": null,
//   "source": null,
//   "status": "succeeded"
// };
function SuccessPayment({ result }) {
  const navigate = useNavigate();
  const stripe = useStripe();
  const [intent, setIntent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    console.log(result);
    console.log(result.client_secret);
    if (stripe) {
      stripe
        .retrievePaymentIntent(result.client_secret)
        .then((response) => {
          console.log(response);
          if (response.data?.id) {
            setIntent(intent);
          }
          setLoading(false);
        })
        .catch((err) => {
          toast.error(err?.message);
          setLoading(false);
        });
    }
  }, [result]);

  if (loading)
    return (
      <Container>
        <CustomSpinner></CustomSpinner>
      </Container>
    );

  return (
    <Container className="p-success-root">
      <div className="p-success-icon-form">
        <BsClipboard2Check className="p-success-icon"></BsClipboard2Check>
      </div>
      <div className="w-100">
        <h2 className="txt-center">Transaction Completed Successfully</h2>
        <p className="p-txt-grey txt-center">Thanks for your billing</p>
        <div className="txt-center">
          <Button
            className="my-btn-yellow mx-2"
            onClick={() => {
              if (result.status === "succeeded")
                navigate(`/payment/checkout/return/invoice?id=${result?.id}`);
              else toast.error("Please");
            }}
          >
            Invoice View
          </Button>
        </div>
        <SuccessPayment.Intent intent={result}></SuccessPayment.Intent>
      </div>
    </Container>
  );
}

// {
//   "id": "pi_3NFVKGKfaw4OxeNd1WU3Hvc5",
//   "object": "payment_intent",
//   "amount": 72600,
//   "amount_details": {
//     "tip": {}
//   },
//   "automatic_payment_methods": {
//     "enabled": true
//   },
//   "canceled_at": null,
//   "cancellation_reason": null,
//   "capture_method": "automatic",
//   "client_secret": "pi_3NFVKGKfaw4OxeNd1WU3Hvc5_secret_fi7LNqpc83CCw22QDZtHCbeL3",
//   "confirmation_method": "automatic",
//   "created": 1685940448,
//   "currency": "aud",
//   "description": null,
//   "last_payment_error": null,
//   "livemode": false,
//   "next_action": null,
//   "payment_method": "pm_1NFVKUKfaw4OxeNdsaump1cW",
//   "payment_method_types": [
//     "card",
//     "link"
//   ],
//   "processing": null,
//   "receipt_email": "nttinh.catmedia@gmail.com",
//   "setup_future_usage": null,
//   "shipping": null,
//   "source": null,
//   "status": "succeeded"
// }

SuccessPayment.Intent = function ({ intent }) {
  return (
    <div className="w-100 pt-2">
      <Row>
        <Col sm="4">
          <b>Id</b>
        </Col>
        <Col sm="8">{intent?.id}</Col>
      </Row>
      <Row>
        <Col sm="4">
          <b>Amount</b>
        </Col>
        <Col sm="8">{intent?.amount / 100}$</Col>
      </Row>
      {/* <Row>
      <Col sm="4">Created</Col>
      <Col sm="8">{moment(intent?.created).format("hh:mm DD/MM/YYYY")}</Col>
    </Row> */}
      <Row>
        <Col sm="4">
          <b>Currency</b>
        </Col>
        <Col sm="8">{intent?.currency}</Col>
      </Row>
      <Row>
        <Col sm="4">
          <b>Status</b>
        </Col>
        <Col sm="8">{intent?.status}</Col>
      </Row>
      <Row>
        <Col sm="4">
          <b>Receipt Email</b>
        </Col>
        <Col sm="8">{intent?.receipt_email}</Col>
      </Row>
    </div>
  );
};

export default SuccessPayment;
