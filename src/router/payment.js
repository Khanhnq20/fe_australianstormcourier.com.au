import { Outlet } from "react-router-dom";
import { PaymentComponents } from "../pages";
import { Container } from "react-bootstrap";

export const paymentChildrens = [
    {
      path: "checkout",
      element: <Outlet></Outlet>,
      children: [
        {path: "return", element: <PaymentComponents.SuccessPayment></PaymentComponents.SuccessPayment>},
        {path: "failed", element: <PaymentComponents.FailurePayment></PaymentComponents.FailurePayment>}
      ]
    },
    {
      path: "*",
      element: <Container>
        <h2>This page are in modified</h2>
      </Container>
    }
  ]