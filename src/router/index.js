import {
  Outlet,
  createBrowserRouter,
} from "react-router-dom";
import { Navigation, Sidebar,Footer } from "../layout";
import {Home,RegisterUser,Login, Forgot, ResetPassword, UserInformation, ChangePassword} from '../pages';
import { AuthValidator } from '../stores'
import React from 'react';
import RegisterDriver from "../pages/register driver/component";

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
            path: '',
            element: <>
              <h2>This is dashboard of user</h2>
            </>
          },
          {
            path: 'info',
            element: <>
              <UserInformation></UserInformation>
            </>
          }
        ]
      }
    ],
  },
  {
    path: "/register",
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

