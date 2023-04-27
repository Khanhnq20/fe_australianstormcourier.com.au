import React from 'react'
import '../style/sidebar.css';
import {AiOutlineDashboard,AiOutlineIdcard} from 'react-icons/ai';
import {User} from '../../../pages'
import { NavLink } from 'react-router-dom';


export default function Index({children}) {
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
                      to={'/user/dashboard'}>
                          <div className='sbar-icon-frame'>
                            <AiOutlineIdcard className="sbar-icon"></AiOutlineIdcard>
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
