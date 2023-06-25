import React from 'react';
import ReactDOM from 'react-dom/client';

import reportWebVitals from './reportWebVitals';
import { Spinner } from 'react-bootstrap';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { AuthContextComponent } from './stores';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import './App.css';
import 'swiper/css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <>
        <AuthContextComponent>
            <RouterProvider router={router} fallbackElement={<Spinner />}></RouterProvider>
        </AuthContextComponent>
        <ToastContainer />
    </>,
);

reportWebVitals();
