import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import '../style/navigation.css';

export default function Index() {
  return (
    <>
        <Navbar bg="light" variant="light">
            <Container className="nav-ctn-1">
                <Navbar.Brand href="#home">
                    <img src="https://australianstormcourier.com.au/wp-content/uploads/2023/04/as-logo.png" width="50px"/>
                </Navbar.Brand>
                <Nav>
                    <Nav.Link className='nav-txt' href="#home">Home</Nav.Link>
                    <Nav.Link className='nav-txt' href="#features">Features</Nav.Link>
                    <Nav.Link className='nav-txt' href="#pricing">Pricing</Nav.Link>
                </Nav>
            </Container>
            <Container className='nav-ctn-2'>
                <Button className='my-btn-yellow' data-color="primary">Register Driver</Button>
                <Button className='my-btn-white'>Register Customer</Button>
            </Container>
        </Navbar>
    </>
  )
}
