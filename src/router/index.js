import {
  Outlet,
  createBrowserRouter,
} from "react-router-dom";
import { Navigation, Footer, DriverSideBar, UserSideBar, AdminSideBar } from "../layout";
import {Home,RegisterDriver,RegisterUser,Login, Forgot, ResetPassword, UserInformation, EmailCheck, CreateProduct, PaymentComponents} from '../pages';
import { AuthValidator, OrderContextComponent } from '../stores'
import React from 'react';
import { userChildrens } from "./user";
import { driverChildrens } from "./driver";
import { adminChildrens } from "./admin";


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
        element: <>
          <Home></Home>
        </>
      },
      {
        path: "auth",
        element: <>
          <Outlet></Outlet>
        </>,
        children: authChildrens
      },
      {
        path: "user",
        element: <>
          <OrderContextComponent>
            <UserSideBar>
              <Outlet></Outlet>
            </UserSideBar>
          </OrderContextComponent>
        </>,
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
        path: "admin",
        element: <>
          <OrderContextComponent>
            <AdminSideBar>
              <Outlet></Outlet>
            </AdminSideBar>
          </OrderContextComponent>
        </>,
        children: adminChildrens
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
      }
    ]
  }
]);

