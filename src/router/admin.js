import { Outlet } from "react-router";
import { AcceptDriver, AdminInformation, ChangePassword, CreateProduct, Order, UserInformation, UserProductHistory, UserProductHistoryDetails } from "../pages";

export const adminChildrens = [
    {
      path: 'accept',
      element: <>
        <AcceptDriver></AcceptDriver>
      </>
    },  
    {
      path:"info",
      element: <AdminInformation></AdminInformation>,
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