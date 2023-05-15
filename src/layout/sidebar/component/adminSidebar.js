import { AiOutlineDashboard, AiOutlineIdcard } from "react-icons/ai"
import { BiPackage } from "react-icons/bi"
import { NavLink } from "react-router-dom"
import { User } from "../../../pages"
import { Breadcrumbs } from "./breadscrumb"

export function AdminSideBar({children}) {
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
                            to={'info'}>
                            <div className='sbar-icon-frame'>
                              <AiOutlineDashboard className="sbar-icon"></AiOutlineDashboard>
                            </div>
                            <p className='sbar-txt'>Infomation</p>
                        </NavLink>
                        <NavLink  
                            className={({isActive}) =>{
                              return isActive  ? 'sbar-link-active' : 'sbar-link'
                            }}
                            to={'drivers'}>
                            <div className='sbar-icon-frame'>
                              <AiOutlineIdcard className="sbar-icon"></AiOutlineIdcard>
                            </div>
                            <p className='sbar-txt'>Accept Driver</p>
                        </NavLink>
                        <NavLink  
                          className={({isActive}) =>{
                            return isActive  ? 'sbar-link-active' : 'sbar-link'
                          }}
                          to={'/user/product'}>
                          <div className='sbar-icon-frame'>
                            <BiPackage className="sbar-icon"></BiPackage>
                          </div>
                          <p className='sbar-txt'>Orders</p>
                        </NavLink>
                        <NavLink  
                          className={({isActive}) =>{
                            return isActive  ? 'sbar-link-active' : 'sbar-link'
                          }}
                          to={'/user/product'}>
                          <div className='sbar-icon-frame'>
                            <BiPackage className="sbar-icon"></BiPackage>
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