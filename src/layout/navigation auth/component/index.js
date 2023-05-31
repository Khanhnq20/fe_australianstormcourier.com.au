import React, {useContext} from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from 'react-bootstrap';
import {AiFillBell} from 'react-icons/ai';
import Dropdown from 'react-bootstrap/Dropdown';
import '../style/navAuth.css';
import {AiFillUnlock,AiOutlineSetting} from 'react-icons/ai';
import {FiLogOut,FiChevronDown} from 'react-icons/fi';
import {BsChevronDown} from 'react-icons/bs'
import { AuthContext } from '../../../stores/contextAPI/authctx';
import {BsPersonWorkspace} from 'react-icons/bs';

export default function Index() {
    const [notify,setNotify] = React.useState(false);
    return (
        <div className='nav-root'>
            <div className='nav-form'>
                <Navbar bg="light" variant="light" expand="lg">
                    <div className="nav-auth px-1">
                        <Navbar.Brand className="nav-logo-frame" href="/">
                            <img src="https://australianstormcourier.com.au/wp-content/uploads/2023/04/as-logo.png" width="50px"/>
                        </Navbar.Brand>
                        
                        <div className='nav-auth-form'>
                            {/* <div className='nav-notification'>
                                <AiFillBell onClick={()=>{setNotify(e=>!e)}} className='nav-auth-icon-notify'></AiFillBell>
                                {notify ? <Notification></Notification> : <></>}
                            </div> */}
                            <div>
                                <AvatarUserDropDown></AvatarUserDropDown>
                            </div>
                        </div>
                    </div>
                </Navbar>
            </div>
        </div>
    )
}
function Notification(){
    return(
        <>
            <div className='notify-form'>
                <div className='notify-header'>
                    <p>Notify</p>
                </div>
                <div className='notify-form-content'>
                    <div>
                        <p className='notify-title'>Title</p>
                    </div>
                    <div>
                        <p>
                        Since Bootstrap is developed to be mobile first, 
                        we use a handful of media queries to create sensible 
                        breakpoints for our layouts and interfaces.
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

function AvatarUserDropDown() {
    const  [show,setShow] = React.useState(false);
    const [{accountInfo},{
        signout
    }] = useContext(AuthContext);

    return (
    <div className='mx-4'>
        <div className='nav-avatar' onClick={()=>setShow(e => !e)}>
            <img
                className='nav-avatar-img'
                height="40px"
                weight="40px"
                src="https://thumbs.dreamstime.com/b/male-avatar-icon-flat-style-male-user-icon-cartoon-man-avatar-hipster-vector-stock-91462914.jpg"
            />
            <div className='user-name'>
            <div>
                <p className='content-green' style={{display: 'block', margin: 0}}>{accountInfo?.roles?.[0]}</p>
                <p className="pt-1" style={{color:'#666666',margin:'0', paddingLeft: '10px'}}>{accountInfo?.name || accountInfo?.username}</p>
            </div>
                <BsChevronDown  style={{color:'black'}}></BsChevronDown>
            </div>
        </div>
        {
            show 
            ? 
            <div className='nav-menu'>
                <div className='nav-menu-topic' onClick={()=>setShow(e => !e)}>
                    <BsPersonWorkspace className='nav-menu-topic-icon'></BsPersonWorkspace>
                    <Link to={`/user/order/me`} style={{textDecoration: "none",color:"var(--clr-txt-secondary)"}}>
                        My Workspace
                    </Link>
                </div>
                <div className='nav-menu-topic' onClick={()=>setShow(e => !e)}>
                    <AiFillUnlock className='nav-menu-topic-icon'></AiFillUnlock>
                    <Link to={`/user/password`} style={{textDecoration: "none",color:"var(--clr-txt-secondary)"}}>
                        Change Password
                    </Link>
                </div>
                {/* <div className='nav-menu-topic'>
                    <AiOutlineSetting className='nav-menu-topic-icon'></AiOutlineSetting>
                    <Link to="/userManagement" style={{textDecoration: "none",color:"black"}}>
                        Setting
                    </Link>
                </div> */}
                <div className='nav-menu-topic' onClick={signout}>
                    <FiLogOut className='nav-menu-topic-icon'></FiLogOut>
                    <div onClick={()=>setShow(e => !e)}>   
                        Log out
                    </div>
                </div>
            </div>
            :
            <></>
        }
    </div>
    );
}