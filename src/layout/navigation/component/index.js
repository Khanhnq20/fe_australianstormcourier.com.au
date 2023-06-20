import React from "react";
import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";
import { Navbar } from "react-bootstrap";
import { NavAuth } from "../../../layout";
import "../style/navigation.css";
import { useContext } from "react";
import { AuthContext } from "../../../stores";
import logo from "../../../image/as-logo.png";

export default function Index() {
  const [state] = useContext(AuthContext);

  if (state.isLogged) return <NavAuth></NavAuth>;

  return (
    <div className="nav-root">
      <Navbar bg="light" variant="light" expand="lg">
        <Container className="nav-ctn-1">
          <Navbar.Brand className="nav-logo-frame" href="/">
            <img src={logo} width="50px" />
          </Navbar.Brand>

          <div className="nav-ctn-2">
            <Link className="nav-link" to="/auth/login">
              <h6 className="nav-txt-btn">Login</h6>
            </Link>
            <Link className="nav-link" to="/auth/register/user">
              <h6 className="nav-txt-btn">Register</h6>
            </Link>
          </div>
        </Container>
      </Navbar>
    </div>
  );
}
