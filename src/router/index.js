import {
  Outlet,
  createBrowserRouter,
} from "react-router-dom";


import { Navigation, Footer, DriverSideBar, SenderSideBar, UserSideBar } from "../layout";
import {Home,RegisterDriver,RegisterUser,Login, Forgot, ResetPassword, UserInformation, ChangePassword, DriverProduct, DriverProductDetail, EmailCheck, Order, OrderDetail, OrderProcessDetail, SenderDashBoard, SenderProduct, SenderProductDetail, User, SenderInfo, CreateProduct} from '../pages';
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
    path:"reset",
    element: <ResetPassword></ResetPassword>
  },
]

export const userChildrens = [
  {
    path: 'dashboard',
    element: <>
      <User></User>
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
      },
      {
        path:"post",
        element: <CreateProduct></CreateProduct>
      }
    ]
  },
  {
    path:"info",
    element: <SenderInfo></SenderInfo>
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
    path: "product",
    element: <DriverProduct></DriverProduct>
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
          <UserSideBar>
            <Outlet></Outlet>
          </UserSideBar>
        </AuthValidator>,
        children: userChildrens
      },
      {
        path: "driver",
        element: <AuthValidator roles={["Driver"]}>
          <DriverSideBar>
            <Outlet></Outlet>
          </DriverSideBar>
        </AuthValidator>,
        children: driverChildrens
      },
      {
        path: 'sender',
        element: <AuthValidator roles={["Sender"]}>
          <SenderSideBar>
            <Outlet></Outlet>
          </SenderSideBar>
        </AuthValidator>,
        children: senderChildrens
      }
    ]
  }
]);

