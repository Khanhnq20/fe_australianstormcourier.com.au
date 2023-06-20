import { Container } from "react-bootstrap";
import { ErrorPages } from "../pages";
import { NotFound } from "../pages/errors";

export const errorChildrens = [
  {
    path: "400",
    element: <ErrorPages.BadRequest></ErrorPages.BadRequest>,
  },
  {
    path: "404",
    element: <ErrorPages.NotFound></ErrorPages.NotFound>,
  },
  {
    path: "500",
    element: <ErrorPages.BrokenServer></ErrorPages.BrokenServer>,
  },
  {
    path: "forbiden",
    element: (
      <Container>
        <h2>Your account is queuing for inspecting. Please wait</h2>
      </Container>
    ),
  },
  {
    path: "*",
    element: (
      <>
        <NotFound></NotFound>
      </>
    ),
  },
];
