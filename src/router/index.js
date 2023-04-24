import {
  Outlet,
  createBrowserRouter,
} from "react-router-dom";
import { Navigation, Sidebar } from "../layout";
import { Footer } from "../layout";
import {Home,RegisterUser,Login, Forgot, ResetPassword, UserInformation,User, ChangePassword, RegisterDriver} from '../pages';
import React from 'react';

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
        path: "registerUser",
        element:<RegisterUser></RegisterUser>
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
  },
]);

