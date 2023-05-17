import { Outlet } from "react-router";
import { AcceptDriver, AdminInformation, AdminOrderDetail, ChangePassword, DriverDetail, DriverInfo, TotalOrder, UserInformation, UserManagement, UserProductHistory, UserProductHistoryDetails } from "../pages";

export const adminChildrens = [
  {
    path: 'accept',
    element: <>
      <Outlet></Outlet>
    </>,
    children:[
    {
      path:'',
      element: <AcceptDriver></AcceptDriver>
    }
    , 
    {
      path: "detail",
      element: <DriverDetail></DriverDetail>
    }]
  },
    {
      path: 'user',
      element: <>
        <Outlet></Outlet>
      </>,
      children:[
      {
        path:'',
        element: <UserManagement></UserManagement>
      }
      , 
      {
        path: "detail/{id}",
        element: <UserInformation></UserInformation>
      }]
    },
    {
      path: 'orders',
      element: <>
        <Outlet></Outlet>
      </>,
      children:[
      {
        path:'',
        element: <TotalOrder></TotalOrder>
      }
      , 
      {
        path: "detail",
        element: <AdminOrderDetail></AdminOrderDetail>
      }]
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
          element: <></>
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