import React from 'react'
import '../style/sidebar.css';
import {AiOutlineDashboard,AiOutlineIdcard} from 'react-icons/ai';
import {User} from '../../../pages'
import { NavLink, useLocation } from 'react-router-dom';
import {Breadcrumb, BreadcrumbItem} from 'react-bootstrap';
import { ShouldRenderComponent } from '../../../stores';
import {BiPackage} from 'react-icons/bi';
import {FiShoppingCart} from 'react-icons/fi';


function UserSideBar({children}) {
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
                      to={'/user/dashboard'}>
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
                          to={'/driver/product'}>
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
                          to={'/sender/product'}>
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
                                <Breadcrumbs></Breadcrumbs>
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
                          to={'/user/dashboard'}>
                          <div className='sbar-icon-frame'>
                            <AiOutlineDashboard className="sbar-icon"></AiOutlineDashboard>
                          </div>
                          <p className='sbar-txt'>Dashboard</p>
                      </NavLink>
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
                      <NavLink  
                          className={({isActive}) =>{
                            return isActive  ? 'sbar-link-active' : 'sbar-link'
                          }}
                          to={'/driver/product'}>
                          <div className='sbar-icon-frame'>
                            <BiPackage className="sbar-icon"></BiPackage>
                          </div>
                          <p className='sbar-txt'>Product</p>
                      </NavLink>
                      <NavLink  
                          className={({isActive}) =>{
                            return isActive  ? 'sbar-link-active' : 'sbar-link'
                          }}
                          to={'/driver/order'}>
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
                                <Breadcrumbs></Breadcrumbs>
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
                          to={'/user/dashboard'}>
                          <div className='sbar-icon-frame'>
                            <AiOutlineDashboard className="sbar-icon"></AiOutlineDashboard>
                          </div>
                          <p className='sbar-txt'>Dashboard</p>
                      </NavLink>
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
                                <Breadcrumbs></Breadcrumbs>
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

function Breadcrumbs() {
  const location = useLocation();
  const pathList = location.pathname.split('/')
  .filter(crumb => !!crumb);

  const pathLinks = pathList.reduce((pre,curr) => {
    return [...pre , pre + "/" + curr];
  }, []);

  return (
    <Breadcrumb>
      {pathList
        .map((crumb,index) => {
          return(
            <BreadcrumbItem className={pathLinks[index] === location.pathname ? "path active-link" : "path" } key={crumb} href={pathLinks[index]}>
              {crumb}
            </BreadcrumbItem>
          )
      })}
    </Breadcrumb>
  );
}
export {UserSideBar,DriverSideBar,SenderSideBar};
