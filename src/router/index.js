import {
  Outlet,
  createBrowserRouter,
} from "react-router-dom";
import { Navigation } from "../layout";
import { Footer } from "../layout";
import {Home,RegisterUser,Login, Forgot, ResetPassword, Homepage} from '../pages';
import React from 'react';
import RegisterDriver from "../pages/register driver/component";

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
        element:<Homepage></Homepage>
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
  },
]);

