import React from 'react'
import { Button, Container, NavLink } from 'react-bootstrap'

export default function Index() {
  return (
    <div className='my-5'>
        <Container className='pt-4 text-center'> 
            <div className='py-3 mx-auto' style={{ maxWidth: "160px" }}>
                <img src="https://australianstormcourier.com.au/wp-content/uploads/2023/04/as-logo.png" className='w-100'></img>
            </div>
            <h2 className='mb-3 text-center'>
                Your account was verified, welcome to Australian Storm Courier
            </h2>
            <p className='text-center'>Your account has been verified by the Administrator, please click the button below to use our website.</p>
            <NavLink to={'/auth/login'}>
              <Button variant='warning' className={`my-btn-yellow my-4 product-btn-search mx-4`}>Go to Sign in</Button>
            </NavLink>
        </Container>
    </div>
  )
}
