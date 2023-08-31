import React, { useContext } from 'react';
import { AuthContext } from './authctx';
import { Link, Navigate } from 'react-router-dom';
import { Button, Container, Spinner } from 'react-bootstrap';
import taskStatus from './taskStatus';
import { authConstraints } from '../../api';
import { CustomSpinner } from '../../layout';
import { NonRouting } from '../../pages';
import { MdOutlinePhonelinkErase, MdOutlineSendToMobile } from 'react-icons/md';

function AuthValidator({ children, roles = ['User', 'Driver', 'Sender', 'Admin'], invalidLink = '/auth/login' }) {
    const [authState] = useContext(AuthContext);

    if (
        authState.tasks.hasOwnProperty(authConstraints.getAccount) &&
        authState.tasks?.[authConstraints.getAccount] === taskStatus.Inprogress
    ) {
        return (
            <Container>
                <CustomSpinner />
            </Container>
        );
    }

    if (!authState?.accountInfo?.roles) {
        return (
            <Container>
                <NonRouting></NonRouting>
            </Container>
        );
    }

    if (!authState?.accountInfo?.phoneNumberConfirmed) {
        return (
            <Container>
                <div className="p-3 box-shadow-form aus-phone-confirm-form">
                    <h3>
                        <MdOutlinePhonelinkErase className="me-2"></MdOutlinePhonelinkErase> Phone number's not
                        activated
                    </h3>
                    <p>
                        Your phone number <b>+{authState?.accountInfo?.phoneNumber}</b> has not been verified. To
                        continue, Click below to activate your phone number for this account
                    </p>
                    <Link
                        to={`/verify/phone?phone=${authState?.accountInfo?.phoneNumber}&userId=${authState?.accountInfo?.id}&from=login`}
                    >
                        <Button variant="warning">
                            <MdOutlineSendToMobile></MdOutlineSendToMobile> Verify{' '}
                            <b>+{authState?.accountInfo?.phoneNumber}</b>
                        </Button>
                    </Link>
                </div>
            </Container>
        );
    }

    let hasPermited = authState.isLogged && authState.accountInfo?.roles?.some((e) => roles.includes(e));

    if (hasPermited) return children;

    return <Navigate to={invalidLink}></Navigate>;
}

AuthValidator.LoggedContainer = function LoggedContainer({ children, invalidLink = null }) {
    const [authState] = useContext(AuthContext);

    if (
        authState.tasks.hasOwnProperty(authConstraints.getAccount) &&
        authState.tasks?.[authConstraints.getAccount] === taskStatus.Inprogress
    )
        return (
            <Container>
                <div className="mx-auto text-center">
                    <CustomSpinner></CustomSpinner>
                </div>
            </Container>
        );

    if (authState?.isLogged)
        return (
            <Navigate
                to={
                    invalidLink ||
                    (authState?.accountInfo?.roles?.includes?.('User') && '/user/order/me') ||
                    (authState?.accountInfo?.roles?.includes?.('Driver') && '/driver/offer') ||
                    (authState?.accountInfo?.roles?.includes?.('SuperAdmin') && '/admin/orders') ||
                    '/error/forbiden'
                }
                replace={true}
            ></Navigate>
        );

    return children;
};

export default AuthValidator;
