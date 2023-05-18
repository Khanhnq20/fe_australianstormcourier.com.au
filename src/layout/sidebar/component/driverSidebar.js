import { FiShoppingCart } from "react-icons/fi"
import {FaBars} from 'react-icons/fa';
import React from 'react'
import { User } from "../../../pages"
import { Breadcrumbs } from "./breadscrumb"
import { NavLink } from "react-router-dom"
import { TbPackages } from "react-icons/tb"
import {AiFillLeftCircle,AiOutlineIdcard,AiOutlineHistory} from 'react-icons/ai';

export function DriverSideBar({children}) {
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