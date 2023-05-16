import { Outlet } from "react-router";

import { ChangePassword, CreateProduct, Order, SenderProductDetail, UserInformation, UserProductHistory, UserProductHistoryDetails } from "../pages";

export const userChildrens = [
    {
      path: 'info',
      element: <>
        <UserInformation></UserInformation>
      </>
    },  
    {
      path:"product",
      element: <Outlet></Outlet>,
      children:[    
        {
          path: "post",
          element: <CreateProduct></CreateProduct>
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
          path: "list",
          element: <Order></Order>
        },
        {
          path: "detail",
          element: <SenderProductDetail></SenderProductDetail>
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