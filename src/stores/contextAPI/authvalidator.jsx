import React, { useContext, useEffect } from 'react'
import {AuthContext} from './authctx';
import { Navigate } from 'react-router-dom';
import { Container, Spinner } from 'react-bootstrap';

function AuthValidator({children, roles=["User", "Driver", "Sender", "Admin"], invalidLink="/auth/login"}) {
    const [authState] = useContext(AuthContext);

    let hasPermited = authState.isLogged && authState.accountInfo?.roles?.some(e => roles.includes(e));

    if(authState.loading) 
        return (<Container>
            <div className="mx-auto text-center">
                <Spinner></Spinner>
                <h2>Loading...</h2>
            </div>
        </Container>)

    if(hasPermited) 
        return children;

    return (<Navigate to={invalidLink}></Navigate>);
}

AuthValidator.LoggedContainer = function LoggedContainer({children}) {
    const [authState, {getAccount}] = useContext(AuthContext);

    if(authState.loading) 
        return (<Container>
            <div className="mx-auto text-center">
                <Spinner></Spinner>
                <h2>Loading...</h2>
            </div>
        </Container>);
    
    if(authState.isLogged)
        return <Navigate to={"/user/dashboard"} replace={true}></Navigate>;

    return children;
}


export default AuthValidator;