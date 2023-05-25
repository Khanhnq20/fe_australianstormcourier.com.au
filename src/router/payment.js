import { Outlet } from "react-router-dom";
import { Invoice, PaymentComponents } from "../pages";
import { Container } from "react-bootstrap";
import { Footer } from "../layout";

export const paymentChildrens = [
    {
      path: "checkout",
      element: <Outlet></Outlet>,
      children: [
        {path: "return", 
        element: <Outlet></Outlet>,
        children:[{
          path:'',
          element:<>
            <PaymentComponents.SuccessPayment></PaymentComponents.SuccessPayment>
            <Footer.Custom></Footer.Custom>
          </>
        },
        {
          path:'invoice',
          element:<>
            <Invoice></Invoice>
            <Footer></Footer>
          </>
        }
      ]
        
      },
        {path: "failed", 
        element: <>
          <PaymentComponents.FailurePayment></PaymentComponents.FailurePayment>
          <Footer.Custom></Footer.Custom>
        </>
      }
      ]
    },
    {
      path: "*",
      element: <Container>
        <h2>This page are in modified</h2>
        <Footer.Custom></Footer.Custom>
      </Container>
    }
  ]