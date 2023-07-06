import React from 'react';
import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';
import { Button, Navbar } from 'react-bootstrap';
import { NavAuth } from '../../../layout';
import '../style/navigation.css';
import { useContext } from 'react';
import { AuthContext } from '../../../stores';
import logo from '../../../image/as-logo.png';

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
                            <Button className="my-btn-yellow btn btn-warning">
                                {/* <h6 className="nav-txt-btn"></h6> */}
                                Login
                            </Button>
                        </Link>
                    </div>
                </Container>
            </Navbar>
        </div>
    );
}
