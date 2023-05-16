import React from 'react'
import '../style/sidebar.css';
import {AiFillLeftCircle,AiOutlineIdcard,AiOutlineHistory} from 'react-icons/ai';
import {User} from '../../../pages'
import { NavLink, useLocation } from 'react-router-dom';
import {Breadcrumb, BreadcrumbItem} from 'react-bootstrap';
import {BiPackage} from 'react-icons/bi';
import {FiShoppingCart} from 'react-icons/fi';
import {TbPackages,TbReportMoney} from 'react-icons/tb';
import {FaBars,FaTimes} from 'react-icons/fa';
import {BsPersonCheck} from 'react-icons/bs';
import {HiOutlineUserGroup} from 'react-icons/hi'



//export * from './adminSidebar';
//export * from './driverSidebar';
//export * from './userSideBar';
//export * from './breadscrumb';

function UserSideBar({children}) {
  const [toggle,setToggle] = React.useState(true);
  return (
    <div>
      <div className='h-root'>
          <div>
            <div className='h-form'>
              <span onClick={()=>{setToggle(true)}} className={toggle ? '' : 'hero'}></span>
              <span className={toggle ? 'sbar-root hide' : 'sbar-root'}>
                <div>
                  <div className='sbar-header'>
                      <div className='sbar-title'>Menu</div>
                      <AiFillLeftCircle className={toggle ? 'sbar-toggle right' : 'sbar-toggle'} onClick={()=>{setToggle(e => !e)}}></AiFillLeftCircle>
                  </div>
                  <div>
                    <div className={toggle ? 'form-label': ''}>
                      {/* 1. Order */}
                      <NavLink  
                        className={({isActive}) =>{
                          return isActive  ? 'sbar-link active' : 'sbar-link'
                        }}
                        to={'/user/order/list'}>
                        <div className='sbar-icon-frame'>
                          <TbPackages className="sbar-icon"></TbPackages>
                        </div>
                        <p className={toggle ? 'sbar-txt txt-hide' : 'sbar-txt'}>My Order</p>
                      </NavLink>
                      {/* 2. Create new order */}
                      <NavLink  
                        className={({isActive}) =>{
                          return isActive  ? 'sbar-link active' : 'sbar-link'
                        }}
                        to={'/user/product/post'}>
                        <div className='sbar-icon-frame'>
                          <BiPackage className="sbar-icon"></BiPackage>
                        </div>
                        <p className={toggle ? 'sbar-txt txt-hide' : 'sbar-txt'}>Create new Order</p>
                      </NavLink>
                      {/* 3. History */}
                      <NavLink  
                        className={({isActive}) =>{
                          return isActive  ? 'sbar-link active' : 'sbar-link'
                        }}
                        to={'/user/history'}>
                        <div className='sbar-icon-frame'>
                          <AiOutlineHistory className="sbar-icon"></AiOutlineHistory>
                        </div>
                        <p className={toggle ? 'sbar-txt txt-hide' : 'sbar-txt'}>History</p>
                      </NavLink>
                      {/* 4. User information */}
                      <NavLink  
                        className={({isActive}) =>{
                          return isActive  ? 'sbar-link active' : 'sbar-link'
                        }}
                        to={'/user/info'}>
                        <div className='sbar-icon-frame'>
                          <AiOutlineIdcard className="sbar-icon"></AiOutlineIdcard>
                        </div>
                        <p className={toggle ? 'sbar-txt txt-hide' : 'sbar-txt'}>Information</p>
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
  const [toggle,setToggle] = React.useState(false);
  return (
    <div className='container-define'>
      <div className='h-root'>
          <div>
            <div className='h-form'>
            <span onClick={()=>{setToggle(true)}} className={toggle ? '' : 'hero'}></span>
              <span className={toggle ? 'sbar-root hide' : 'sbar-root'}>
                <div style={{minWidth:'200px'}}>
                  <div className='sbar-header'>
                      <div className='sbar-title'>MENU</div>
                      <AiFillLeftCircle className={toggle ? 'sbar-toggle right' : 'sbar-toggle'} onClick={()=>{setToggle(e => !e)}}></AiFillLeftCircle>
                  </div>
                  <div>
                    <div className={toggle ? 'form-label': ''}>
                      <NavLink 
                          className={({isActive,isPending}) =>{
                              return isPending ? "sbar-link" : isActive  ? 'sbar-link active' : 'sbar-link'
                          }}
                          to={'/driver/offer'}>
                          <div className='sbar-icon-frame'>
                            <TbPackages className="sbar-icon"></TbPackages>
                          </div>
                          <p className='sbar-txt'>Job Availables</p>
                      </NavLink>
                      <NavLink  
                          className={({isActive}) =>{
                            return isActive  ? 'sbar-link active' : 'sbar-link'
                          }}
                          to={'/driver/info'}>
                          <div className='sbar-icon-frame'>
                            <AiOutlineIdcard className="sbar-icon"></AiOutlineIdcard>
                          </div>
                          <p className='sbar-txt'>Information</p>
                      </NavLink>
                      <NavLink  
                          className={({isActive}) =>{
                            return isActive  ? 'sbar-link active' : 'sbar-link'
                          }}
                          to={'/driver/history'}>
                          <div className='sbar-icon-frame'>
                            <AiOutlineHistory className="sbar-icon"></AiOutlineHistory>
                          </div>
                          <p className='sbar-txt'>History</p>
                      </NavLink>
                      <NavLink  
                          className={({isActive}) =>{
                            return isActive  ? 'sbar-link active' : 'sbar-link'
                          }}
                          to={'/driver/order'}>
                          <div className='sbar-icon-frame'>
                            <FiShoppingCart className="sbar-icon"></FiShoppingCart>
                          </div>
                          <p className='sbar-txt'>Your Actived Job</p>
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
                                <FaBars className='sbar-toggle' onClick={()=>{setToggle(true)}}></FaBars>
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

function AdminSideBar({children}) {
  const [toggle,setToggle] = React.useState(false);
  return (
    <div className='container-define'>
      <div className='h-root'>
          <div>
            <div className='h-form'>
            <span onClick={()=>{setToggle(true)}} className={toggle ? '' : 'hero'}></span>
              <span className={toggle ? 'sbar-root hide' : 'sbar-root'}>
                <div style={{minWidth:'200px'}}>
                  <div className='sbar-header'>
                      <div className='sbar-title'>MENU</div>
                      <AiFillLeftCircle className={toggle ? 'sbar-toggle right' : 'sbar-toggle'} onClick={()=>{setToggle(e => !e)}}></AiFillLeftCircle>
                  </div>
                  <div>
                    <div className={toggle ? 'form-label': ''}>
                      <NavLink 
                          className={({isActive,isPending}) =>{
                              return isPending ? "sbar-link" : isActive  ? 'sbar-link active' : 'sbar-link'
                          }}
                          to={'info'}>
                          <div className='sbar-icon-frame'>
                            <AiOutlineIdcard className="sbar-icon"></AiOutlineIdcard  >
                          </div>
                          <p className='sbar-txt'>Infomation</p>
                      </NavLink>
                      <NavLink  
                          className={({isActive}) =>{
                            return isActive  ? 'sbar-link active' : 'sbar-link'
                          }}
                          to={'accept'}>
                          <div className='sbar-icon-frame'>
                            <BsPersonCheck className="sbar-icon"></BsPersonCheck>
                          </div>
                          <p className='sbar-txt'>Accept Driver</p>
                      </NavLink>
                      <NavLink  
                          className={({isActive}) =>{
                            return isActive  ? 'sbar-link active' : 'sbar-link'
                          }}
                          to={'user'}>
                          <div className='sbar-icon-frame'>
                            <HiOutlineUserGroup className="sbar-icon"></HiOutlineUserGroup>
                          </div>
                          <p className='sbar-txt'>User Management</p>
                      </NavLink>
                      <NavLink  
                        className={({isActive}) =>{
                          return isActive  ? 'sbar-link active' : 'sbar-link'
                        }}
                        to={'orders'}>
                        <div className='sbar-icon-frame'>
                          <BiPackage className="sbar-icon"></BiPackage>
                        </div>
                        <p className='sbar-txt'>Orders</p>
                      </NavLink>
                      <NavLink  
                        className={({isActive}) =>{
                          return isActive  ? 'sbar-link active' : 'sbar-link'
                        }}
                        to={'/user/product'}>
                        <div className='sbar-icon-frame'>
                          <TbReportMoney className="sbar-icon"></TbReportMoney>
                        </div>
                        <p className='sbar-txt'>Invoices</p>
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
                        <FaBars className='sbar-toggle' onClick={()=>{setToggle(true)}}></FaBars>
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
    <Breadcrumb className='breadcrumb-link'>
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
export {UserSideBar,DriverSideBar,AdminSideBar};
