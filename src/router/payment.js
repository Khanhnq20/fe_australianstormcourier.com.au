import { Outlet } from "react-router-dom";
import { PaymentComponents } from "../pages";

export const paymentChildrens = [
    {
      path: "checkout",
      element: <Outlet></Outlet>,
      children: [
        {path: "return", element: <PaymentComponents.SuccessPayment></PaymentComponents.SuccessPayment>},
        {path: "failed", element: <PaymentComponents.FailurePayment></PaymentComponents.FailurePayment>}
      ]
    }
  ]