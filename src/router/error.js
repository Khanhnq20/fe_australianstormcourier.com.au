import { ErrorPages } from "../pages";

export const errorChildrens = [
    {
      path: "400",
      element: <ErrorPages.BadRequest></ErrorPages.BadRequest>
    },
    {
      path: "404",
      element: <ErrorPages.NotFound></ErrorPages.NotFound>
    },
    {
      path: "500",
      element: <ErrorPages.BrokenServer></ErrorPages.BrokenServer>
    }
  ]