import React from 'react';
import { Sidebar } from '../../../layout/index.jsx';
import '../style/homepage.css';

export default function Index({children}) {
  return (
        <div>
            <Sidebar>
                {children}
            </Sidebar>
        </div>
  )
}
