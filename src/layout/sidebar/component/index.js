import React from 'react'
import '../style/sidebar.css';
import {AiOutlineDashboard,AiOutlineIdcard,AiOutlineCar} from 'react-icons/ai';
import {User} from '../../../pages'
import { NavLink } from 'react-router-dom';

import { AuthValidator, ShouldRenderComponent } from '../../../stores';
import {BiPackage,BiBox} from 'react-icons/bi';
import {FiShoppingCart} from 'react-icons/fi';
import {TfiDashboard} from 'react-icons/tfi'


function UserSideBar({children}) {

  const [active,setActive] = React.useState(false);
  function handleActive(){
    setActive(true);
  }
  return (
    <div>
      <div className='h-root'>
            <div>
                <div className='h-form'>
                    <span>
                    <div className='sbar-root'>
                  <div className='sbar-header'>
                      <div>MENU</div>
                  </div>
                  <div>
                    <div>
                    {/* 1. User Dashboard */}
                      <NavLink 
                      className={({isActive,isPending}) =>{
                          return isPending ? "sbar-link" : isActive  ? 'sbar-link-active' : 'sbar-link'
                      }}
                      to={'/user'}>
                          <div className='sbar-icon-frame'>
                            <AiOutlineDashboard className="sbar-icon"></AiOutlineDashboard>
                          </div>
                          <p className='sbar-txt'>Dashboard</p>
                      </NavLink>
                      {/* 2. User Information */}
                      <NavLink  
                        className={({isActive}) =>{
                          return isActive  ? 'sbar-link-active' : 'sbar-link'
                        }}
                        to={'/user/info'}>
                        <div className='sbar-icon-frame'>
                          <AiOutlineIdcard className="sbar-icon"></AiOutlineIdcard>
                        </div>
                        <p className='sbar-txt'>Information</p>
                      </NavLink>
                      {/* 3. Driver */}
                      <ShouldRenderComponent roles={["Driver"]}>
                        <NavLink  
                          className={({isActive}) =>{
                            return isActive  ? 'sbar-link-active' : 'sbar-link'
                          }}
                          to={'/driver'}>
                          <div className='sbar-icon-frame'>
                            <AiOutlineIdcard className="sbar-icon"></AiOutlineIdcard>
                          </div>
                          <p className='sbar-txt'>Driver</p>
                        </NavLink>
                      </ShouldRenderComponent>
                      {/* 4. Sender */}
                      <ShouldRenderComponent roles={["Sender"]}>
                        <NavLink  
                          className={({isActive}) =>{
                            return isActive  ? 'sbar-link-active' : 'sbar-link'
                          }}
                          to={'/sender'}>
                          <div className='sbar-icon-frame'>
                            <AiOutlineIdcard className="sbar-icon"></AiOutlineIdcard>
                          </div>
                          <p className='sbar-txt'>Sender</p>
                        </NavLink>
                      </ShouldRenderComponent>
                    </div>
                  </div>
                </div>
                    </span>
                    <span className='h-ctn'>
                        <div className=''>

                        </div>
                        <div className='h-ctn-inner'>
                            <div className='h-header'>
                                Home
                            </div>
                            <div className='h-content-frame'>
                                {children || <User></User> }
                            </div>
                        </div>
                    </span>
                </div>
            </div>
        </div>
    </div>
  )
}

function DriverSideBar({children}) {
  const [active,setActive] = React.useState(false);
  function handleActive(){
    setActive(true);
  }
  return (
    <div>
      <div className='h-root'>
            <div>
              <div className='h-form'>
                    <span>
                <div className='sbar-root'>
                  <div className='sbar-header'>
                      <div>MENU</div>
                  </div>
                  <div>
                    <div>
                      <NavLink 
                          className={({isActive,isPending}) =>{
                              return isPending ? "sbar-link" : isActive  ? 'sbar-link-active' : 'sbar-link'
                          }}
                          to={'/dashboard'}>
                          <div className='sbar-icon-frame'>
                            <AiOutlineDashboard className="sbar-icon"></AiOutlineDashboard>
                          </div>
                          <p className='sbar-txt'>Dashboard</p>
                      </NavLink>
                      <NavLink  
                          className={({isActive}) =>{
                            return isActive  ? 'sbar-link-active' : 'sbar-link'
                          }}
                          to={'/information'}>
                          <div className='sbar-icon-frame'>
                            <AiOutlineIdcard className="sbar-icon"></AiOutlineIdcard>
                          </div>
                          <p className='sbar-txt'>Information</p>
                      </NavLink>
                      <NavLink  
                          className={({isActive}) =>{
                            return isActive  ? 'sbar-link-active' : 'sbar-link'
                          }}
                          to={'/information'}>
                          <div className='sbar-icon-frame'>
                            <BiPackage className="sbar-icon"></BiPackage>
                          </div>
                          <p className='sbar-txt'>Product</p>
                      </NavLink>
                      <NavLink  
                          className={({isActive}) =>{
                            return isActive  ? 'sbar-link-active' : 'sbar-link'
                          }}
                          to={'/information'}>
                          <div className='sbar-icon-frame'>
                            <FiShoppingCart className="sbar-icon"></FiShoppingCart>
                          </div>
                          <p className='sbar-txt'>Order</p>
                      </NavLink>
                    </div>
                  </div>
                </div>
                    </span>
                    <span className='h-ctn'>
                        <div className=''>

                        </div>
                        <div className='h-ctn-inner'>
                            <div className='h-header'>
                                Home
                            </div>
                            <div className='h-content-frame'>
                                {children || <User></User> }
                            </div>
                        </div>
                    </span>
                </div>
            </div>
        </div>
    </div>
  )
}

function SenderSideBar({children}) {
  const [active,setActive] = React.useState(false);
  function handleActive(){
    setActive(true);
  }
  return (
    <div>
      <div className='h-root'>
            <div>
                <div className='h-form'>
                    <span>
                    <div className='sbar-root'>
                  <div className='sbar-header'>
                      <div>MENU</div>
                  </div>
                  <div>
                    <div>
                      <NavLink 
                          className={({isActive,isPending}) =>{
                              return isPending ? "sbar-link" : isActive  ? 'sbar-link-active' : 'sbar-link'
                          }}
                          to={'/dashboard'}>
                          <div className='sbar-icon-frame'>
                            <AiOutlineDashboard className="sbar-icon"></AiOutlineDashboard>
                          </div>
                          <p className='sbar-txt'>Dashboard</p>
                      </NavLink>
                      <NavLink  
                          className={({isActive}) =>{
                            return isActive  ? 'sbar-link-active' : 'sbar-link'
                          }}
                          to={'/sender/info'}>
                          <div className='sbar-icon-frame'>
                            <AiOutlineIdcard className="sbar-icon"></AiOutlineIdcard>
                          </div>
                          <p className='sbar-txt'>Information</p>
                      </NavLink>
                      <NavLink  
                          className={({isActive}) =>{
                            return isActive  ? 'sbar-link-active' : 'sbar-link'
                          }}
                          to={'/sender/product'}>
                          <div className='sbar-icon-frame'>
                            <BiPackage className="sbar-icon"></BiPackage>
                          </div>
                          <p className='sbar-txt'>Product</p>
                      </NavLink>
                    </div>
                  </div>
                </div>
                    </span>
                    <span className='h-ctn'>
                        <div className=''>

                        </div>
                        <div className='h-ctn-inner'>
                            <div className='h-header'>
                                Home
                            </div>
                            <div className='h-content-frame'>
                                {children || <User></User> }
                            </div>
                        </div>
                    </span>
                </div>
            </div>
        </div>
    </div>
  )
}

export {UserSideBar,DriverSideBar,SenderSideBar};
