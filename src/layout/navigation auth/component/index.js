import React from 'react';
import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';
import { Navbar } from 'react-bootstrap';
import {AiFillBell} from 'react-icons/ai';
import Dropdown from 'react-bootstrap/Dropdown';
import '../style/navAuth.css';
import {AiFillUnlock,AiOutlineSetting} from 'react-icons/ai';
import {FiLogOut} from 'react-icons/fi'

export default function Index() {
    return (
        <div className='nav-root'>
            <Navbar bg="light" variant="light" expand="lg">
                <div className="nav-auth px-5">
                    <Navbar.Brand className="nav-logo-frame" href="/">
                        <img src="https://australianstormcourier.com.au/wp-content/uploads/2023/04/as-logo.png" width="50px"/>
                    </Navbar.Brand>
                    
                    <div className='nav-auth-form'>
                        <div className='nav-notification'>
                            <AiFillBell className='nav-auth-icon-notify'></AiFillBell>
                        </div>
                        <div>
                            <AvatarUserDropDown></AvatarUserDropDown>
                        </div>
                    </div>
                </div>
            </Navbar>
        </div>
    )
}

function AvatarUserDropDown() {
        // const {userID, logout} = useAthContext();
        // const [state,functions] = useCartContext();
        // const navigate = useNavigate();
    return (
    <Dropdown>
        <Dropdown.Toggle className='nav-avatar' id="dropdown-basic">
            <img
            className='nav-avatar-img'
            height="40px"
            weight="40px"
            src="https://thumbs.dreamstime.com/b/male-avatar-icon-flat-style-male-user-icon-cartoon-man-avatar-hipster-vector-stock-91462914.jpg"
            
            />
        </Dropdown.Toggle>

        <Dropdown.Menu className='nav-menu'>
            <Dropdown.Item className='nav-menu-topic'>
                <AiFillUnlock className='nav-menu-topic-icon'></AiFillUnlock>
                <Link to={`/personal`}style={{textDecoration: "none",color:"black"}}>
                    Change Password
                </Link>
            </Dropdown.Item>
            <Dropdown.Item className='nav-menu-topic'>
                <AiOutlineSetting className='nav-menu-topic-icon'></AiOutlineSetting>
                <Link to="/userManagement" style={{textDecoration: "none",color:"black"}}>
                    Setting
                </Link>
            </Dropdown.Item>

            <Dropdown.Item className='nav-menu-topic'>
                <FiLogOut className='nav-menu-topic-icon'></FiLogOut>
                <div>   
                    Log out
                </div>
            </Dropdown.Item>
        </Dropdown.Menu>
    </Dropdown>
    );
}