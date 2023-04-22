import {
  Outlet,
  createBrowserRouter,
} from "react-router-dom";
import { Navigation } from "../layout";
import { Footer } from "../layout";
import {Home} from '../pages';
import React from 'react';
import RegisterDriver from "../pages/register driver/component";
import RegisterUser from "../pages/register user/component";
import Login from "../pages/login/component";

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
        element:<Login></Login>
      },
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

