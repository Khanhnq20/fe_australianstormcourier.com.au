import {
  Outlet,
  createBrowserRouter,
} from "react-router-dom";


import { Navigation, Footer, DriverSideBar, UserSideBar } from "../layout";
import {Home,RegisterDriver,RegisterUser,Login, Forgot, ResetPassword, UserInformation, ChangePassword, DriverProduct, DriverProductDetail, EmailCheck, Order, OrderDetail, OrderProcessDetail, SenderDashBoard, SenderProduct, SenderProductDetail, User, SenderInfo, CreateProduct, DriverInfo, PaymentComponents, ErrorPages} from '../pages';
import { AuthValidator, OrderContextComponent } from '../stores'
import React from 'react';


export const authChildrens = [
  {
    path: "register",
    element: <Outlet></Outlet>,
    children: [
      {
        path: "user",
        element: <>
          <Outlet></Outlet>
        </>,
        children:[
          {
            path: "",
            element: <>
              <RegisterUser></RegisterUser>
            </>
          },
          {
            path: "confirm",
            element: <>
              <EmailCheck></EmailCheck>
            </>
          }
        ]
      },
      {
        path: "driver",
        element: <>
          <RegisterDriver />
        </>
      }
    ]
  },
  {
    path: "login",
    element:<Login></Login>,
  },
  {
    path:"forgot",
    element:<Forgot></Forgot>
  },
  {
    path: "password",
    element:<ResetPassword></ResetPassword>
  },
  {
    path:"information",
    element: <UserInformation></UserInformation>
  },
  {
    path:"reset",
    element: <ResetPassword></ResetPassword>
  },
]

export const userChildrens = [
  {
    path: 'info',
    element: <>
      <UserInformation></UserInformation>
    </>
  },  
  {
    path:"product",
    element: <Outlet></Outlet>,
    children:[
      {
        path: "",
        element: <DriverProduct></DriverProduct> 
      },
      {
        path: 'detail',
        element: <>
          <DriverProductDetail></DriverProductDetail>
        </>
      },      
      {
        path: "post",
        element: <CreateProduct></CreateProduct>
      }
    ]
  },
  {
    path: "password",
    element: <ChangePassword></ChangePassword>
  },
  {
    path: "order",
    element: <Outlet></Outlet>,
    children: [
      {
        path: "list",
        element: <Order></Order>
      },
    ]
  },
  {
    path: "history",
    element: <>
      <h1>Order History Pages</h1>
    </>
  }
];

export const driverChildrens = [
  {
    path: "offer",
    element: <DriverProduct></DriverProduct>
  },
  {
    path:"info",
    element:<>
      <DriverInfo></DriverInfo>
    </>
  },
  {
    path: "order",
    element: <>
      <Outlet></Outlet>
    </>,
    children:[
      {
        path: "",
        element: <>
          <Order></Order>
        </>
      },
      {
        path: "detail/{id}",
        element: <>
          <Outlet></Outlet>
        </>,
        children:[
          {
            path: "",
            element: <>
              <OrderDetail></OrderDetail>
            </>
          },
          {
            path: "process",
            element: <>
              <OrderProcessDetail></OrderProcessDetail>
            </>
          },
        ]
      },
    ]
  },
];

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

export const errorChildrens = [
  {
    path: "400",
    element: <ErrorPages.BadRequest></ErrorPages.BadRequest>
  },
  {
    path: "404",
    element: <ErrorPages.NotFound></ErrorPages.NotFound>
  },
  {
    path: "500",
    element: <ErrorPages.BrokenServer></ErrorPages.BrokenServer>
  }
]

export const router = createBrowserRouter([
  {
    path: "",
    element: <>
      <Navigation />
      <Outlet />
      <Footer/>
    </>,
    children: [
      {
        path: "",
        element: <AuthValidator.LoggedContainer>
          <Home></Home>
        </AuthValidator.LoggedContainer>
      },
      {
        path: "auth",
        element: <AuthValidator.LoggedContainer>
          <Outlet></Outlet>
        </AuthValidator.LoggedContainer>,
        children: authChildrens
      },
      {
        path: "user",
        element: <AuthValidator roles={["User"]}>
          <OrderContextComponent>
            <UserSideBar>
              <Outlet></Outlet>
            </UserSideBar>
          </OrderContextComponent>
        </AuthValidator>,
        children: userChildrens
      },
      {
        path: "driver",
        element: <AuthValidator roles={["Driver"]}>
          <OrderContextComponent>
            <DriverSideBar>
              <Outlet></Outlet>
            </DriverSideBar>
          </OrderContextComponent>
        </AuthValidator>,
        children: driverChildrens
      },
      {
        path: "anonymous",
        element: <>
          <Outlet></Outlet>
        </>,
        children: [
          {
            path: "order",
            element: <CreateProduct></CreateProduct>
          }
        ]
      },
      {
        path: 'payment',
        element: <Outlet></Outlet>,
        children: paymentChildrens,
      },
      {
        path: 'error',
        element: <Outlet></Outlet>,
        children: errorChildrens
      }
    ]
  }
]);

