import {
  Outlet,
  createBrowserRouter,
} from "react-router-dom";
import { Navigation, Sidebar,Footer } from "../layout";
import {Home,RegisterDriver,RegisterUser,Login, Forgot, ResetPassword, UserInformation, ChangePassword, Product, ProductDetail, Homepage} from '../pages';
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
          <RegisterUser></RegisterUser>
        </>
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
      <Navigation />
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
        element: <AuthValidator>
          <Outlet></Outlet>
        </AuthValidator>,
        children: [
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
            children:[{
              path:"",
              element: <Product></Product> 
            },
            {
              path: 'detail',
              element: <>
                <ProductDetail></ProductDetail>
              </>
              
            }]
          }
        ]
      }
    ],
  },
  {
    path: "/registerDriver",
    element: <>
      <Navigation />
      <RegisterDriver />
    </>,
    
    children: [
      {
        path: "",
        element: <>
          <Navigation />
          <Home />
        </>
      },
    ],
  }
]);

