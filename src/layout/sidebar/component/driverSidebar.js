import { FiShoppingCart } from 'react-icons/fi';
import { FaBars } from 'react-icons/fa';
import React from 'react';
import { User } from '../../../pages';
import { Breadcrumbs } from './breadscrumb';
import { NavLink } from 'react-router-dom';
import { TbPackages } from 'react-icons/tb';
import { AiFillLeftCircle, AiOutlineIdcard, AiOutlineHistory } from 'react-icons/ai';
import { VscFeedback } from 'react-icons/vsc';

const links = [
    {
        title: 'Job Availables',
        link: '/driver/offer',
        icon: <TbPackages className="sbar-icon"></TbPackages>,
    },
    {
        title: 'Information',
        link: '/driver/info',
        icon: <AiOutlineIdcard className="sbar-icon"></AiOutlineIdcard>,
    },
    {
        title: 'History',
        link: '/driver/history',
        icon: <AiOutlineHistory className="sbar-icon"></AiOutlineHistory>,
    },
    {
        title: 'Your Actived Job',
        link: '/driver/order',
        icon: <FiShoppingCart className="sbar-icon"></FiShoppingCart>,
    },
    {
        title: 'Your rating',
        link: '/driver/review',
        icon: <VscFeedback className="sbar-icon"></VscFeedback>,
    },
];

export function DriverSideBar({ children }) {
    const [toggle, setToggle] = React.useState(false);
    return (
        <div className="container-define">
            <div className="h-root">
                <div>
                    <div className="h-form">
                        <span
                            onClick={() => {
                                setToggle(true);
                            }}
                            className={toggle ? '' : 'hero'}
                        ></span>
                        <span className={toggle ? 'sbar-root hide' : 'sbar-root'}>
                            <div style={{ minWidth: '200px' }}>
                                <div className="sbar-header">
                                    <div className="sbar-title">Menu</div>
                                    <AiFillLeftCircle
                                        className={toggle ? 'sbar-toggle right' : 'sbar-toggle'}
                                        onClick={() => {
                                            setToggle((e) => !e);
                                        }}
                                    ></AiFillLeftCircle>
                                </div>
                                <div>
                                    <div className={toggle ? 'form-label' : ''}>
                                        {links.map((i) => (
                                            <NavLink
                                                className={({ isActive }) => {
                                                    return isActive ? 'sbar-link active' : 'sbar-link';
                                                }}
                                                to={i.link}
                                            >
                                                <div className="sbar-icon-frame">{i.icon}</div>
                                                <p className="sbar-txt">{i.title}</p>
                                            </NavLink>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </span>
                        <span className="h-ctn" style={{ paddingBottom: '5rem' }}>
                            <div className="h-ctn-inner">
                                <div className="h-header">
                                    <Breadcrumbs></Breadcrumbs>
                                </div>
                                <div className="h-content-frame">{children || <User></User>}</div>
                            </div>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
