import {
  Outlet,
  createBrowserRouter,
} from "react-router-dom";
import { Navigation, Sidebar,Footer, NavAuth } from "../layout";
import {Home,RegisterDriver,RegisterUser,Login, Forgot, ResetPassword, UserInformation, ChangePassword, DriverProduct, DriverProductDetail, EmailCheck, Homepage, Order, OrderDetail, OrderProcessDetail, SenderDashBoard, SenderProduct, SenderProductDetail} from '../pages';
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
    path: "resetPassword",
    element:<ResetPassword></ResetPassword>
  },
  {
    path: "homepage",
    element:<Sidebar></Sidebar>
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

export const router = createBrowserRouter([
  {
    path: "",
    element: <>
      <NavAuth />
      <Outlet />
      <Footer/>
    </>,
    children: [
      {
        path: "",
        element: <Home></Home>
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
        element: <>
          <Outlet></Outlet>
        </>,
        children: [
          {
            path: '',
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
            children:[{
              path:"",
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
            path: 'sender',
            element: <>
              <Outlet></Outlet>
            </>,
            children:[{
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
          ]
          }
        ]
      }
    ],
  },
  {
    path: "/driver",
    element: <>
      <Navigation />
      <Outlet></Outlet>
    </>,
    children: [
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
    ],
  }
]);

