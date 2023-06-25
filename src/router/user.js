import { Outlet } from 'react-router';

import {
    ChangePassword,
    UserCreateProduct,
    UserInformation,
    UserOrder,
    UserProductDetail,
    UserProductHistory,
    UserProductHistoryDetails,
    UserUpdateProduct,
} from '../pages';
import { Container } from 'react-bootstrap';
import { NotFound } from '../pages/errors';
import TotalInvoice from '../pages/user create product/component/totalInvoice';

export const userChildrens = [
    {
        path: 'order',
        element: <Outlet></Outlet>,
        children: [
            {
                path: 'me',
                element: <UserOrder></UserOrder>,
            },
            {
                path: 'create',
                element: <UserCreateProduct></UserCreateProduct>,
            },
            {
                path: 'detail',
                element: <UserProductDetail></UserProductDetail>,
            },
            {
                path: 'update',
                element: <UserUpdateProduct></UserUpdateProduct>,
            },
            {
                path: 'label',
                element: <TotalInvoice></TotalInvoice>,
            },
        ],
    },
    {
        path: 'info',
        element: (
            <>
                <UserInformation></UserInformation>
            </>
        ),
    },
    {
        path: 'password',
        element: <ChangePassword></ChangePassword>,
    },
    {
        path: 'history',
        element: (
            <>
                <Outlet></Outlet>
            </>
        ),
        children: [
            {
                path: '',
                element: <UserProductHistory></UserProductHistory>,
            },
            {
                path: 'detail',
                element: <UserProductHistoryDetails></UserProductHistoryDetails>,
            },
        ],
    },
    {
        path: '*',
        element: (
            <>
                <NotFound></NotFound>
            </>
        ),
    },
];
