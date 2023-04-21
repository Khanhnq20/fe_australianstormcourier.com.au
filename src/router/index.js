import {
  createBrowserRouter,
} from "react-router-dom";
import { Navigation } from "../layout";
import { Footer } from "../layout";
import {Home} from '../pages';
import React from 'react';
import Register from "../pages/register driver/component";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <>
      <Navigation />
      <Home />
      <Footer/>
    </>,
    children: [
      {
        path: "dash",
        element: <>
          <Navigation />
          <Home />
        </>
      },
    ],
  },
  {
    path: "/register",
    element: <>
      <Navigation />
      <Register />
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

