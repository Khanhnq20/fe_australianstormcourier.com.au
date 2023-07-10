import React, { useContext, useEffect } from 'react';
import { AuthContext } from './authctx';
import { Spinner } from 'react-bootstrap';
import { CustomSpinner } from '../../layout';

function Index({ children, roles = ['User', 'Driver', 'Sender', 'Admin'], altComponent = <></> }) {
    const [authState, { getAccount }] = useContext(AuthContext);

    useEffect(() => {
        getAccount();
    }, [authState.accessToken]);

    let hasPermited = authState.isLogged && authState.accountInfo?.roles?.some((e) => roles.includes(e));

    if (authState.loading)
        return (
            <>
                <div className="mx-auto text-center">
                    <CustomSpinner></CustomSpinner>
                </div>
            </>
        );

    if (hasPermited) return children;

    return altComponent;
}

export default Index;
