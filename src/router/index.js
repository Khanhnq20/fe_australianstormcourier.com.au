import { BrowserRouter, Outlet, Route, Routes, Navigate } from 'react-router-dom';
import Navigation from '../layout/navigation/component/index';
import Home from '../pages/home/components/index';
import { Footer } from '../layout';
import React from 'react'

export default function Router() {
  return (
    <>
        <BrowserRouter>
            <Routes>
              <Route index path="/*" element={<Navigation></Navigation>}></Route>
            </Routes>
            <Routes>
                <Route path='/' element={<Home></Home>}></Route>
            </Routes>
            <Routes>
                <Route path='/*' element={<Footer></Footer>}></Route>
            </Routes>
        </BrowserRouter>
    </>
  )
}
