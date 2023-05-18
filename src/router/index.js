import React from 'react';
import {
  Outlet,
  createBrowserRouter,
} from "react-router-dom";
import { Navigation, Footer, UserSideBar, DriverSideBar, AdminSideBar } from "../layout";
import { Home, CreateProduct, PreventDriver } from '../pages';

import { AuthValidator, OrderContextComponent } from '../stores'

import { authChildrens } from './auth';
import { userChildrens } from "./user";
import { driverChildrens } from "./driver";
import { errorChildrens } from './error';
import { paymentChildrens } from './payment';
import { adminChildrens } from "./admin";


export const router = createBrowserRouter([
  {
    path: "",
    element: <>
      <Navigation />
      <Outlet />
    </>,
    children: [
      {
        path: "",
        element: <>
          <Home></Home>
          <Footer/>
        </>
      },
      {
        path: "prevent",
        element:<>
          <PreventDriver></PreventDriver>
          <Footer.Custom></Footer.Custom>
        </>
      }
      ,
      {
        path: "auth",
        element: <AuthValidator.LoggedContainer>
          <Outlet></Outlet>
          <Footer.Custom></Footer.Custom>
        </AuthValidator.LoggedContainer>,
        children: authChildrens
      },
      {
        path: "user",
        element: <>
          <OrderContextComponent>
            <UserSideBar>
              <Outlet></Outlet>
            </UserSideBar>
          </OrderContextComponent>
          <Footer.Custom></Footer.Custom>
        </>,
        children: userChildrens
      },
      {
        path: "driver",
        element: <>
          <OrderContextComponent>
            <DriverSideBar>
              <Outlet></Outlet>
            </DriverSideBar>
          </OrderContextComponent>
          <Footer.Custom></Footer.Custom>
        </>,
        children: driverChildrens
      },
      {
        path: "admin",
        element: <>
          <OrderContextComponent>
            <AdminSideBar>
              <Outlet></Outlet>
            </AdminSideBar>
          </OrderContextComponent>
          <Footer.Custom></Footer.Custom>
        </>,
        children: adminChildrens
      },
      {
        path: 'payment',
        element: <>
        <Outlet></Outlet>
        <Footer.Custom></Footer.Custom>
        </>,
        
        children: paymentChildrens,
      },
      {
        path: 'error',
        element: <>
        <Outlet></Outlet>
        <Footer.Custom></Footer.Custom>
        </>,
        children: errorChildrens
      }
    ]
  }
]);

