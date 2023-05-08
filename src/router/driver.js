import { Outlet } from "react-router";
import { DriverInfo, DriverProduct, Order, OrderDetail, OrderProcessDetail } from "../pages";

export const driverChildrens = [
    {
      path: "offer",
      element: <DriverProduct></DriverProduct>
    },
    {
      path:"info",
      element:<>
        <DriverInfo></DriverInfo>
      </>
    },
    {
      path: "order",
      element: <>
        <Outlet></Outlet>
      </>,
      children:[
        {
          path: "",
          element: <>
            <Order></Order>
          </>
        },
        {
          path: "detail/{id}",
          element: <>
            <Outlet></Outlet>
          </>,
          children:[
            {
              path: "",
              element: <>
                <OrderDetail></OrderDetail>
              </>
            },
            {
              path: "process",
              element: <>
                <OrderProcessDetail></OrderProcessDetail>
              </>
            },
          ]
        },
      ]
    },
  ];