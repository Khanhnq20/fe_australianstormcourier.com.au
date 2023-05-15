import React from 'react';
import {
  Outlet,
  createBrowserRouter,
} from "react-router-dom";
import { Navigation, Footer, DriverSideBar, UserSideBar, AdminSideBar } from "../layout";
import { Home, CreateProduct } from '../pages';

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
        path: "auth",
        element: <AuthValidator.LoggedContainer>
          <Outlet></Outlet>
        </AuthValidator.LoggedContainer>,
        children: authChildrens
      },
      {
        path: "user",
        element: <AuthValidator roles={['User']}>
          <OrderContextComponent>
            <UserSideBar>
              <Outlet></Outlet>
            </UserSideBar>
          </OrderContextComponent>
        </AuthValidator>,
        children: userChildrens
      },
      {
        path: "driver",
        element: <AuthValidator roles={["Driver"]}>
          <OrderContextComponent>
            <DriverSideBar>
              <Outlet></Outlet>
            </DriverSideBar>
          </OrderContextComponent>
        </AuthValidator>,
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

