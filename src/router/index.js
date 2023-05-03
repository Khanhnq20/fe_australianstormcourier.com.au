import {
  Outlet,
  createBrowserRouter,
} from "react-router-dom";


import { Navigation, Sidebar, Footer } from "../layout";
import {Home,RegisterDriver,RegisterUser,Login, Forgot, ResetPassword, UserInformation, ChangePassword, DriverProduct, DriverProductDetail, EmailCheck, Homepage, Order, OrderDetail, OrderProcessDetail, SenderDashBoard, SenderProduct, SenderProductDetail, CreateProduct} from '../pages';
import { AuthValidator } from '../stores'
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
    path:"changePassword",
    element: <ChangePassword></ChangePassword>
  },
]

export const userChildrens = [
  {
    path: 'dashboard',
    element: <>

      <Homepage></Homepage>
    </>
  },
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
      }
    ]
  },
  {
    path: "register",
    element: <Outlet />,
    children: [
      {
        path: "driver",
        element: <RegisterDriver></RegisterDriver>
      },
      {
        path: "sender",
        element: <SenderDashBoard></SenderDashBoard>
      }
    ]
  },
  {
    path: "password",
    element: <ChangePassword></ChangePassword>
  }
];

export const senderChildrens = [
  {
    path:"",
    element: <SenderDashBoard></SenderDashBoard>
  },
  {
    path:"product",
    element: <Outlet></Outlet>,
    children:[
      {
        path:"",
        element: <SenderProduct></SenderProduct>
      }
        ,
      {
        path:"detail",
        element: <SenderProductDetail></SenderProductDetail>
      }
    ]
  }
];

export const driverChildrens = [
  {
    path: "",
    element: <>
      <RegisterDriver />
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
        path: "detail",
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
          <Outlet></Outlet>
        </AuthValidator>,
        children: userChildrens
      },
      {
        path: "driver",
        element: <AuthValidator roles={["Driver"]}>
          <Outlet></Outlet>
        </AuthValidator>,
        children: driverChildrens
      },
      {
        path: 'sender',
        element: <AuthValidator roles={["Sender"]}>
          <Outlet></Outlet>
        </AuthValidator>,
        children: senderChildrens
      }
    ]
  }
]);

