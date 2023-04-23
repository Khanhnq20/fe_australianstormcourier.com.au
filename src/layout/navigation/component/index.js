import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import '../style/navigation.css';

export default function Index() {
  return (
    <>
        <Navbar bg="light" variant="light" expand="lg">
            <Container className="nav-ctn-1">
                <Navbar.Brand className="nav-logo-frame" href="#home">
                    <img src="https://australianstormcourier.com.au/wp-content/uploads/2023/04/as-logo.png" width="50px"/>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="aus-navbar" />
                <Navbar.Collapse id="aus-navbar">
                    <Nav>
                        <Link className='nav-link' to='/'>
                            <div className='nav-txt'>Home</div>
                        </Link>
                        <Link className='nav-link' to='/'>
                            <div className='nav-txt'>Features</div>
                        </Link>
                        <Link className='nav-link' to='/'>
                            <div className='nav-txt'>Pricing</div>
                        </Link>
                    </Nav>
                </Navbar.Collapse>
                
                <div className='nav-ctn-2'>
                    <Link className='nav-link' to='/login'>
                        <h6 className='nav-txt-btn'>Login</h6> 
                    </Link>
                    <Link className='nav-link' to='/registerUser'>
                        <h6 className='nav-txt-btn'>Register</h6> 
                    </Link>
                </div>
            </Container>
        </Navbar>
    </>
  )
}
