import React, { useContext } from 'react'
import {AuthContext} from './authctx';
import { Navigate } from 'react-router-dom';
import { Container, Spinner } from 'react-bootstrap';
import taskStatus from './taskStatus';
import { authConstraints } from '../../api';
import { CustomSpinner } from '../../layout';
import { NonRouting } from '../../pages';

function AuthValidator({children, roles=["User", "Driver", "Sender", "Admin"], invalidLink="/auth/login"}) {
    const [authState] = useContext(AuthContext);

    if(authState.loading && authState.tasks?.[authConstraints.getAccount] === taskStatus.Inprogress){
        return (<Container>
            <CustomSpinner />
        </Container>)
    } 

    if(!authState?.accountInfo?.roles) {
        return (<Container>
            <NonRouting></NonRouting>
        </Container>)
    } 

    let hasPermited = authState.isLogged && authState.accountInfo?.roles?.some(e => roles.includes(e));

    if(hasPermited) 
        return children;

    return (<Navigate to={invalidLink}></Navigate>);
}

AuthValidator.LoggedContainer = function LoggedContainer({children, invalidLink=null}) {
    const [authState] = useContext(AuthContext);

    if(authState.loading && authState.task?.[authConstraints.getAccount] === taskStatus.Inprogress) 
        return (<Container>
            <div className="mx-auto text-center">
                <Spinner></Spinner>
                <h2>Loading...</h2>
            </div>
        </Container>);
    
    if(authState?.isLogged)
        return <Navigate to={
            invalidLink ||
            (authState?.accountInfo?.roles?.includes?.("User") && "/user/order/me" )|| 
            (authState?.accountInfo?.roles?.includes?.("Driver") && "/driver/offer") ||
            (authState?.accountInfo?.roles?.includes?.("SuperAdmin") && "/admin/orders") ||
            "/error/forbiden"
        }
        replace={true}></Navigate>;

    return children;
}


export default AuthValidator;