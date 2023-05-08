import React from 'react'
import '../style/sidebar.css';
import {AiOutlineDashboard,AiOutlineIdcard} from 'react-icons/ai';
import {User} from '../../../pages'
import { NavLink, useLocation } from 'react-router-dom';
import {Breadcrumb, BreadcrumbItem} from 'react-bootstrap';
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
                      {/* 1. Order */}
                      <NavLink  
                        className={({isActive}) =>{
                          return isActive  ? 'sbar-link-active' : 'sbar-link'
                        }}
                        to={'/user/order/list'}>
                        <div className='sbar-icon-frame'>
                          <AiOutlineIdcard className="sbar-icon"></AiOutlineIdcard>
                        </div>
                        <p className='sbar-txt'>My Order</p>
                      </NavLink>
                      {/* 2. Create new order */}
                      <NavLink  
                        className={({isActive}) =>{
                          return isActive  ? 'sbar-link-active' : 'sbar-link'
                        }}
                        to={'/user/product/post'}>
                        <div className='sbar-icon-frame'>
                          <AiOutlineIdcard className="sbar-icon"></AiOutlineIdcard>
                        </div>
                        <p className='sbar-txt'>Create new Order</p>
                      </NavLink>
                      {/* 3. History */}
                      <NavLink  
                        className={({isActive}) =>{
                          return isActive  ? 'sbar-link-active' : 'sbar-link'
                        }}
                        to={'/user/history'}>
                        <div className='sbar-icon-frame'>
                          <AiOutlineIdcard className="sbar-icon"></AiOutlineIdcard>
                        </div>
                        <p className='sbar-txt'>History</p>
                      </NavLink>
                      {/* 4. User information */}
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
                          to={'/user/product'}>
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
