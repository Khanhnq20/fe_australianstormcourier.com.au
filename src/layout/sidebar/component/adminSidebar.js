import React from 'react'
import {AiFillLeftCircle,AiOutlineIdcard} from 'react-icons/ai';
import { BiPackage } from "react-icons/bi"
import { NavLink } from "react-router-dom"
import { User } from "../../../pages"
import { Breadcrumbs } from "./breadscrumb"
import {HiOutlineUserGroup} from 'react-icons/hi';
import {TbReportMoney} from 'react-icons/tb';
import {BsPersonCheck} from 'react-icons/bs';

export function AdminSideBar({children}) {
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
                            <AiOutlineIdcard className="sbar-icon"></AiOutlineIdcard>
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
                        to={'invoices'}>
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