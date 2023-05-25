import { Outlet } from "react-router-dom";
import { EmailCheck, EmailForgot, Forgot, Login, RegisterDriver, RegisterUser, ResetPassword, UserInformation, Verify } from "../pages";
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
        },
        {
          path:"verify",
          element:<>
            <Verify></Verify>
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
        <Outlet></Outlet>
        <Footer.Custom></Footer.Custom>
      </>,
      children:[{
        path:'',
        element:<>
          <Forgot></Forgot>
        </>
      },
      {
        path:'email',
        element:<>
          <EmailForgot></EmailForgot>
        </>
      }
    ]
    },
    {
      path:"reset",
      element: <>
        <ResetPassword></ResetPassword>
        <Footer.Custom></Footer.Custom>
      </>
    },
    {
      path:"verify",
      element:<>
        <Verify></Verify>
      </>
    }
  ]