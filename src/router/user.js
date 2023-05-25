import { Outlet } from "react-router";

import { ChangePassword, UserCreateProduct, UserInformation, UserOrder, UserProductDetail, UserProductHistory, UserProductHistoryDetails } from "../pages";
import { Container } from "react-bootstrap";

export const userChildrens = [
  {
    path: "order",
    element: <Outlet></Outlet>,
    children: [
      {
        path: "me",
        element: <UserOrder></UserOrder>
      },
      {
        path: "create",
        element: <UserCreateProduct></UserCreateProduct>
      },
      {
        path: "detail",
        element: <UserProductDetail></UserProductDetail>
      }
    ]
  },
  {
    path: 'info',
    element: <>
      <UserInformation></UserInformation>
    </>
  },  
  {
    path: "password",
    element: <ChangePassword></ChangePassword>
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
  },
  {
    path: "*",
    element: <Container>
      <h2 className="m-2">This page are in modified</h2>
    </Container>
  }
];