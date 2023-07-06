import React, { useContext, useEffect } from 'react';
import { Button, Container } from 'react-bootstrap';
import { AuthContext, taskStatus } from '../../../stores';
import { Link, useSearchParams } from 'react-router-dom';
import { authConstraints } from '../../../api';
import { CustomSpinner } from '../../../layout';
import logo from '../../../image/as-logo.png';

export default function Index() {
    const [authState, { verifyAccount }] = useContext(AuthContext);
    const [urlQuery] = useSearchParams();
    const keys = ['confirm_token', 'email', 'username'];

    useEffect(() => {
        if (keys.every((key) => urlQuery.has(key))) {
            const confirmToken = urlQuery.get(keys[0]);
            const email = urlQuery.get(keys[1]);
            const userName = urlQuery.get(keys[2]);

            verifyAccount(email, userName, confirmToken);
        } else {
        }
    }, [urlQuery]);

    if (authState.tasks?.[authConstraints.verifiedUser] === taskStatus.Inprogress) return <CustomSpinner />;

    if (authState.tasks?.[authConstraints.verifiedUser] === taskStatus.Failed) return <div className="my-5"></div>;

    return (
        <div className="my-5">
            <Container className="pt-4 text-center">
                <div className="py-3 mx-auto" style={{ maxWidth: '160px' }}>
                    <img src={logo} className="w-100"></img>
                </div>
                <h2 className="mb-3 text-center">Your account was verified, welcome to Australian Storm Courier</h2>
                <p className="text-center">
                    Your account has been verified by the Administrator, please click the button below to use our
                    website.
                </p>
                <Link to={'/auth/login'}>
                    <Button variant="warning" className={`my-btn-yellow my-4 product-btn-search mx-4`}>
                        Go to Sign in
                    </Button>
                </Link>
            </Container>
        </div>
    );
}
