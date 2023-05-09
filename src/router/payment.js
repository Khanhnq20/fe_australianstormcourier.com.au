import { PaymentComponents } from "../pages";

export const paymentChildrens = [
    {
      path: "checkout",
      element: <PaymentComponents.Payment></PaymentComponents.Payment>,
      children: [
        {path: "success", element: <PaymentComponents.SuccessPayment></PaymentComponents.SuccessPayment>},
        {path: "failed", element: <PaymentComponents.FailurePayment></PaymentComponents.FailurePayment>}
      ]
    }
  ]