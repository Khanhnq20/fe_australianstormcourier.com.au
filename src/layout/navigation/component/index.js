import React from "react";
import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";
import { Navbar } from "react-bootstrap";
import { NavAuth } from "../../../layout";
import "../style/navigation.css";
import { useContext } from "react";
import { AuthContext } from "../../../stores";
import logo from "../../../image/as-logo.png";

// {
//     "accessToken": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxNzA4N2M5ZC01NDk5LTQ5YzEtOGY5Ny03MzU3MTQ2MzBmOWQiLCJlbWFpbCI6InRydW5ndGluaDI0NjgxMGZAZ21haWwuY29tIiwicm9sZSI6IlVzZXIiLCJzdWIiOiJBdXN0cmFsaWFuIFN0b3JtIFN1YmplY3QiLCJqdGkiOiI1Y2RiMzc0Ny0zMGQ0LTRlNzUtYTEyNC0zNTBiMzY0NDcwOGIiLCJpYXQiOjE2ODI4MzY5MzAsIm5iZiI6MTY4MjgzNjkzMCwiZXhwIjoxNjgyODY1NzMwLCJpc3MiOiJBdXN0cmFsaWFuIFN0b3JtIiwiYXVkIjoiaHR0cHM6Ly9hdXN0cmFsaWFuc3Rvcm1jb3VyaWVyLmNvbS5hdS8ifQ.Rg7SzMzR8wvbJUL3A3RBI-4jdjmAbAC4ezG6zzx0qsoND9GY8ZLYwdX3R_Aepkg18BHNGj-1AJEeHQ4E17FoYw",
//     "accountInfo": {
//         "id": "e66f4bf6-2111-4ad0-a44e-bd75bb3507b4",
//         "username": "trungtinh246810f",
//         "name": null,
//         "email": "trungtinh246810f@gmail.com",
//         "emailConfirmed": true,
//         "phoneNumber": "0398866149",
//         "phoneNumberConfirmed": true,
//         "address": "K251 Huỳnh Thúc Kháng",
//         "abnNumber": 213213,
//         "roles": [
//             "Driver",
//             "User",
//             "Sender"
//         ]
//     },
//     "driverInfo": null,
//     "senderInfo": null,
//     "loading": false,
//     "error": [],
//     "isLogged": true
// }

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
