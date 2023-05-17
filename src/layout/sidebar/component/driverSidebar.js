import { FiShoppingCart } from "react-icons/fi"
import { User } from "../../../pages"
import { Breadcrumbs } from "./breadscrumb"
import { NavLink } from "react-router-dom"
import { TbPackages, TbTruckDelivery } from "react-icons/tb"
import { AiOutlineIdcard } from "react-icons/ai"

export 
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
                          to={'/driver/offer'}>
                          <div className='sbar-icon-frame'>
                            <TbPackages className="sbar-icon"></TbPackages>
                          </div>
                          <p className='sbar-txt'>Job Availables</p>
                      </NavLink>
                      <NavLink  
                          className={({isActive}) =>{
                            return isActive  ? 'sbar-link-active' : 'sbar-link'
                          }}
                          to={'/driver/info'}>
                          <div className='sbar-icon-frame'>
                            <AiOutlineIdcard className="sbar-icon"></AiOutlineIdcard>
                          </div>
                          <p className='sbar-txt'>Information</p>
                      </NavLink>
                      <NavLink  
                          className={({isActive}) =>{
                            return isActive  ? 'sbar-link-active' : 'sbar-link'
                          }}
                          to={'/driver/history'}>
                          <div className='sbar-icon-frame'>
                            <TbTruckDelivery className="sbar-icon"></TbTruckDelivery>
                          </div>
                          <p className='sbar-txt'>Order History</p>
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