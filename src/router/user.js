import { Outlet } from "react-router";

import { ChangePassword, UserCreateProduct, UserInformation, UserOrder, UserProductDetail, UserProductHistory, UserProductHistoryDetails } from "../pages";

export const userChildrens = [
    {
      path: 'info',
      element: <>
        <UserInformation></UserInformation>
      </>
    },  
    {
      path:"createProduct",
      element: <Outlet></Outlet>,
      children:[    
        {
          path: "",
          element: <UserCreateProduct></UserCreateProduct>
        }
      ]
    },
    {
      path: "password",
      element: <ChangePassword></ChangePassword>
    },
    {
      path: "order",
      element: <Outlet></Outlet>,
      children: [
        {
          path: "",
          element: <UserOrder></UserOrder>
        },
        {
          path: "detail",
          element: <UserProductDetail></UserProductDetail>
        }
      ]
    },
    {
      path: "history",
      element: <>
        <Outlet></Outlet>
      </>,
      children: [
        {
            path: "",
            element: <UserProductHistory></UserProductHistory>
        },
        {
            path: "detail",
            element: <UserProductHistoryDetails></UserProductHistoryDetails>
        }
      ]
    }
  ];