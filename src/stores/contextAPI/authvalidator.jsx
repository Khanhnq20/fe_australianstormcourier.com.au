import React, { useContext, useEffect } from 'react'
import {AuthContext} from './authctx';
import { Navigate } from 'react-router-dom';
import { Container, Spinner } from 'react-bootstrap';
import taskStatus from './taskStatus';
import { authConstraints } from '../../api';

function AuthValidator({children, roles=["User", "Driver", "Sender", "Admin"], invalidLink="/auth/login"}) {
    const [authState] = useContext(AuthContext);
    
    if(authState.loading || authState.task?.[authConstraints.getAccount] === taskStatus.Inprogress){
        return (<Container>
            <div className="mx-auto text-center">
                <Spinner></Spinner>
                <h2>Loading...</h2>
            </div>
        </Container>)
    } 

    let hasPermited = authState.isLogged && authState.accountInfo?.roles?.some(e => roles.includes(e));

    if(hasPermited) 
        return children;

    return (<Navigate to={invalidLink}></Navigate>);
}

AuthValidator.LoggedContainer = function LoggedContainer({children, invalidLink=null}) {
    const [authState] = useContext(AuthContext);

    if(authState.loading) 
        return (<Container>
            <div className="mx-auto text-center">
                <Spinner></Spinner>
                <h2>Loading...</h2>
            </div>
        </Container>);
    
    if(authState.isLogged)
        return <Navigate to={
            invalidLink || 
            authState?.accountInfo?.roles?.includes?.("User") && "/user/order/list" || 
            authState?.accountInfo?.roles?.includes?.("Driver") && "/driver/offer" || 
            -1
        }
        replace={true}></Navigate>;

    return children;
}


export default AuthValidator;