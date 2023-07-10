import React from 'react';
import { Outlet, createBrowserRouter } from 'react-router-dom';
import { Navigation, Footer, UserSideBar, DriverSideBar, AdminSideBar } from '../layout';
import { DriverConfirmPhone, DriverReview, EmailCheck, Home, PreventDriver } from '../pages';

import { AuthValidator, OrderContextComponent, SocketContainer, SocketContext } from '../stores';

import { authChildrens } from './auth';
import { userChildrens } from './user';
import { driverChildrens } from './driver';
import { errorChildrens } from './error';
import { paymentChildrens } from './payment';
import { adminChildrens } from './admin';
import { NotFound } from '../pages/errors';

export const router = createBrowserRouter([
    {
        path: '',
        element: (
            <>
                <Navigation />
                <Outlet />
            </>
        ),
        children: [
            {
                path: '',
                element: (
                    <>
                        <Home></Home>
                        <Footer />
                    </>
                ),
            },
            {
                path: 'prevent',
                element: (
                    <>
                        <PreventDriver></PreventDriver>
                        <Footer.Custom></Footer.Custom>
                    </>
                ),
            },
            {
                path: 'auth',
                element: (
                    <AuthValidator.LoggedContainer>
                        <Outlet></Outlet>
                    </AuthValidator.LoggedContainer>
                ),
                children: authChildrens,
            },
            {
                path: 'user',
                element: (
                    <AuthValidator roles={['User']}>
                        <SocketContainer>
                            <OrderContextComponent>
                                <UserSideBar>
                                    <Outlet></Outlet>
                                </UserSideBar>
                                <Footer.Custom></Footer.Custom>
                            </OrderContextComponent>
                        </SocketContainer>
                    </AuthValidator>
                ),
                children: userChildrens,
            },
            {
                path: 'driver',
                element: (
                    <AuthValidator roles={['Driver']}>
                        <SocketContainer>
                            <OrderContextComponent>
                                <DriverSideBar>
                                    <Outlet></Outlet>
                                </DriverSideBar>
                                <Footer.Custom></Footer.Custom>
                            </OrderContextComponent>
                        </SocketContainer>
                    </AuthValidator>
                ),

                children: driverChildrens,
            },
            {
                path: 'admin',
                element: (
                    <AuthValidator roles={['SuperAdmin']}>
                        <SocketContainer>
                            <OrderContextComponent>
                                <AdminSideBar>
                                    <Outlet></Outlet>
                                </AdminSideBar>
                                <Footer.Custom></Footer.Custom>
                            </OrderContextComponent>
                        </SocketContainer>
                    </AuthValidator>
                ),
                children: adminChildrens,
            },
            {
                path: 'payment',
                element: (
                    <>
                        <Outlet></Outlet>
                    </>
                ),

                children: paymentChildrens,
            },
            {
                path: 'verify',
                element: <Outlet></Outlet>,
                children: [
                    {
                        path: 'phone',
                        element: <DriverConfirmPhone></DriverConfirmPhone>,
                    },
                ],
            },
            {
                path: 'error',
                element: (
                    <>
                        <Outlet></Outlet>
                        <Footer.Custom></Footer.Custom>
                    </>
                ),
                children: errorChildrens,
            },
            {
                path: '*',
                element: (
                    <>
                        <NotFound></NotFound>
                    </>
                ),
            },
        ],
    },
]);
