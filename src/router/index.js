import {
  Outlet,
  createBrowserRouter,
} from "react-router-dom";
import { Navigation,Footer, NavAuth, UserSideBar, SenderSideBar } from "../layout";
import {Home,RegisterDriver,RegisterUser,Login, Forgot, ResetPassword, UserInformation, ChangePassword, DriverProduct, DriverProductDetail, EmailCheck, Order, OrderDetail, OrderProcessDetail, SenderDashBoard, SenderProduct, SenderProductDetail, CreateProduct, User} from '../pages';
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
          <UserSideBar>
            <Outlet></Outlet>
          </UserSideBar>
        </>,
        children: [
          {
            path: '',
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
              <SenderSideBar>
                <Outlet></Outlet>
              </SenderSideBar>
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
                },
                {
                  path:"post",
                  element:<CreateProduct></CreateProduct>
                },
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

