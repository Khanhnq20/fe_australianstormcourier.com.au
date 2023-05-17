import React from 'react'
import { Container } from 'react-bootstrap';


export const NotFound = ({children, errors}) => {
    return (<>
        <Container className='pt-4 text-center'> 
            <div className='py-3 mx-auto' style={{ maxWidth: "220px" }}>
                <img src="https://australianstormcourier.com.au/wp-content/uploads/2023/04/as-logo.png" className='w-100'></img>
            </div>
            <h2 className='mb-3 text-center'>
                <b style={{color: "var(--clr-primary)"}}>404</b> Error: Not Found
            </h2>
            <p className='text-center'>This page are being modified or not existed now. <b style={{color: "var(--clr-primary)"}}>Come back</b>  to your previous page</p>
        </Container>
    </>);
}

export const BadRequest = ({children, errors}) => {
    return (<>
        <Container className='pt-4 text-center'>
            <div className='py-3 mx-auto' style={{ maxWidth: "220px" }}>
                <img src="https://australianstormcourier.com.au/wp-content/uploads/2023/04/as-logo.png" className='w-100'></img>
            </div>
            <h2 className='mb-3 text-center'>
                <b style={{color: "var(--clr-primary)"}}>400</b> Error : Bad Request
            </h2>
            <p className='text-center'>Your request is not capable to the content of page. <b style={{color: "var(--clr-primary)"}}>Come back</b>  to your previous page</p>
        </Container>
    </>);
}

export const BrokenServer = ({children}) =>{
    return (<>
        <Container className='pt-4 text-center'> 
            <div className='py-3 mx-auto' style={{ maxWidth: "220px" }}>
                <img src="https://australianstormcourier.com.au/wp-content/uploads/2023/04/as-logo.png" className='w-100'></img>
            </div>
            <h2 className='mb-3'>
                <b style={{color: "var(--clr-primary)"}}>505</b> Error
            </h2>
            <p>Sorry for this inconvenience. We are working on the best to bring service back to you.
            </p>
            <p>
                <b>Server are being modified</b>
            </p>
        </Container>
    </>)
}
