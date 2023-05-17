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
      <Footer/>
    </>,
    children: [
      {
        path: "",
        element: <>
          <Home></Home>
        </>
      },
      {
        path: "prevent",
        element:<>
          <PreventDriver></PreventDriver>
        </>
      }
      ,
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
          <OrderContextComponent>
            <UserSideBar>
              <Outlet></Outlet>
            </UserSideBar>
          </OrderContextComponent>
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
        </>,
        children: adminChildrens
      },
      {
        path: 'payment',
        element: <Outlet></Outlet>,
        children: paymentChildrens,
      },
      {
        path: 'error',
        element: <Outlet></Outlet>,
        children: errorChildrens
      }
    ]
  }
]);

