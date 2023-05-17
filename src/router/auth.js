import { Outlet } from "react-router-dom";
import { EmailCheck, Forgot, Login, RegisterDriver, RegisterUser, ResetPassword, UserInformation } from "../pages";

export const authChildrens = [
    {
      path: "register",
      element: <Outlet></Outlet>,
      children: [
        {
          path: "user",
          element: <>
            <Outlet></Outlet>
          </>,
          children:[
            {
              path: "",
              element: <>
                <RegisterUser></RegisterUser>
              </>
            },
            {
              path: "confirm",
              element: <>
                <EmailCheck></EmailCheck>
              </>
            }
          ]
        },
        {
          path: "driver",
          element: <>
            <RegisterDriver />
          </>
        }
      ]
    },
    {
      path: "login",
      element:<Login></Login>,
    },
    {
      path:"forgot",
      element:<Forgot></Forgot>
    },
    {
      path: "password",
      element:<ResetPassword></ResetPassword>
    },
    {
      path:"information",
      element: <UserInformation></UserInformation>
    },
    {
      path:"reset",
      element: <ResetPassword></ResetPassword>
    },
  ]