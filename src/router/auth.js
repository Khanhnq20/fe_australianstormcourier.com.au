import { Outlet } from "react-router-dom";
import { EmailCheck, Forgot, Login, RegisterDriver, RegisterUser, ResetPassword, UserInformation } from "../pages";
import { Footer } from "../layout";

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
                <Footer></Footer>
              </>
            },
            {
              path: "confirm",
              element: <>
                <EmailCheck></EmailCheck>
                <Footer.Custom></Footer.Custom>
              </>
            }
          ]
        },
        {
          path: "driver",
          element: <>
            <RegisterDriver />
            <Footer></Footer>
          </>
        },
        {
          path: "confirm",
          element: <>
            <EmailCheck></EmailCheck>
            <Footer.Custom></Footer.Custom>
          </>
        }
      ]
    },
    {
      path: "login",
      element:<>
        <Login></Login>
        <Footer.Custom></Footer.Custom>
      </>
    },
    {
      path:"forgot",
      element:<>
        <Forgot></Forgot>
        <Footer.Custom></Footer.Custom>
      </>
    },
    {
      path:"reset",
      element: <>
        <ResetPassword></ResetPassword>
        <Footer.Custom></Footer.Custom>
      </>
    },
  ]