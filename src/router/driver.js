import { Outlet } from "react-router";
import { DriverHistory, DriverInfo, DriverProduct, Order, OrderDetail, OrderProcessDetail } from "../pages";

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
      path: "history",
      element: <>
        <DriverHistory></DriverHistory>
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
          path: "detail",
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