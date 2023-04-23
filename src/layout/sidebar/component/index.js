import React from 'react'
import '../style/sidebar.css';
import {AiOutlineDashboard,AiOutlineIdcard} from 'react-icons/ai';

export default function Index() {
  return (
    <div>
      <div className='sbar-root'>
        <div className='sbar-header'>
            <div>MENU</div>
        </div>
        <div>
          <div className='sbar-tab'>
            <div className='sbar-icon-frame'>
              <AiOutlineDashboard className="sbar-icon"></AiOutlineDashboard>
            </div>
            <p className='sbar-txt'>Dashboard</p>
          </div>
          <div className='sbar-tab'>
            <div className='sbar-icon-frame'>
              <AiOutlineIdcard className="sbar-icon"></AiOutlineIdcard>
            </div>
            <p className='sbar-txt'>Information</p>
          </div>
        </div>
      </div>
    </div>
  )
}
