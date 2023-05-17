import { Outlet } from "react-router";
import { DriverActiveOrder, DriverHistory, DriverInfo, DriverOrderDetail, DriverOrderProcessDetail, DriverProduct } from "../pages";

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
            <DriverActiveOrder></DriverActiveOrder>
          </>
        },
        {
          path: "detail",
          element: <>
            <Outlet></Outlet>
          </>,
          children:[
            {
              path: ":id",
              element: <>
                <DriverOrderDetail></DriverOrderDetail>
              </>
            },
            {
              path: "process",
              element: <>
                <DriverOrderProcessDetail></DriverOrderProcessDetail>
              </>
            },
          ]
        },
      ]
    },
  ];