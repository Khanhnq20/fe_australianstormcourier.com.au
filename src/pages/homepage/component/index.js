import React from 'react';
import { Sidebar } from '../../../layout/index.jsx';

export default function Index({children}) {
  return (
        <div>
            <Sidebar>
                {children}
            </Sidebar>
        </div>
  )
}
