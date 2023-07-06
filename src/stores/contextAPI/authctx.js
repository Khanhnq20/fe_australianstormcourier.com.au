import React, { createContext, useEffect } from 'react';
import { authConstraints, authInstance, config } from '../../api';
import { toast } from 'react-toastify';
import taskStatus from './taskStatus';
export const AuthContext = createContext();

export default function Index({ children }) {
    const [state, setState] = React.useState({
        accessToken: '',
        accountInfo: null,
        loading: true,
        isLogged: false,
        vehicles: [],
        packageTypes: [],
        errors: [],
        tasks: {},
    });
    const controller = new AbortController();

    const hasMounted = React.useRef(false);

    const funcs = {
        saveAccessToken(accessToken, refreshToken) {
            localStorage.removeItem(authConstraints.LOCAL_KEY);
            localStorage.removeItem(authConstraints.LOCAL_KEY_2);

            localStorage.setItem(authConstraints.LOCAL_KEY, accessToken);
            localStorage.setItem(authConstraints.LOCAL_KEY_2, refreshToken);
        },

        signin(body, returnURL) {
            this.clearErrors();
            setState((i) => ({
                ...i,
                loading: true,
                tasks: {
                    ...i.tasks,
                    [authConstraints.signin]: taskStatus.Inprogress,
                },
            }));
            authInstance
                .post([authConstraints.root, authConstraints.signin].join('/'), body, {
                    params: {
                        returnURL,
                    },
                })
                .then((response) => {
                    if (response?.data?.token?.accessToken && response?.data?.token?.refreshToken) {
                        const { data } = response;
                        const { accessToken, refreshToken } = data?.token;

                        this.saveAccessToken(accessToken, refreshToken);
                        setState((i) => ({
                            ...i,
                            accessToken: accessToken,
                            tasks: {
                                ...i.tasks,
                                [authConstraints.signin]: taskStatus.Completed,
                            },
                        }));
                    } else {
                        toast.warning(response?.data || '');
                        setState((i) => ({
                            ...i,
                            loading: false,
                            tasks: {
                                ...i.tasks,
                                [authConstraints.signin]: taskStatus.Failed,
                            },
                        }));
                    }
                })
                .catch((err) => {
                    setState((i) => ({
                        ...i,
                        errors: err,
                        loading: false,
                        tasks: {
                            ...i.tasks,
                            [authConstraints.signin]: taskStatus.Failed,
                        },
                    }));
                });
        },

        signupUser(body, returnURL = '', callback) {
            setState((i) => ({
                ...i,
                loading: true,
                tasks: {
                    ...i.tasks,
                    [authConstraints.signupUser]: taskStatus.Inprogress,
                },
            }));
            authInstance
                .post([authConstraints.root, authConstraints.signupUser].join('/'), body, {
                    params: {
                        returnURL: encodeURIComponent(returnURL),
                    },
                })
                .then((response) => {
                    if (response.data?.successed) {
                        toast.success(`You have registered account successfully, please goto "Signin" to join us`, {});
                        callback?.();
                        setState((i) => ({
                            ...i,
                            errors: [...response.data.registeredErrors],
                            loading: false,
                            tasks: {
                                ...i.tasks,
                                [authConstraints.signupUser]: taskStatus.Completed,
                            },
                        }));
                        return;
                    } else {
                        setState((i) => ({
                            ...i,
                            errors: [...response.data.registeredErrors],
                            loading: false,
                            tasks: {
                                ...i.tasks,
                                [authConstraints.signupUser]: taskStatus.Failed,
                            },
                        }));
                    }
                })
                .catch((err) => {
                    if (err?.response) {
                        setState((i) => ({
                            ...i,
                            errors: [err?.response],
                            loading: false,
                            tasks: {
                                ...i.tasks,
                                [authConstraints.signupUser]: taskStatus.Failed,
                            },
                        }));
                    } else {
                        setState((i) => ({
                            ...i,
                            errors: [err?.message],
                            loading: false,
                            tasks: {
                                ...i.tasks,
                                [authConstraints.signupUser]: taskStatus.Failed,
                            },
                        }));
                    }
                });
        },

        signupDriver(body, returnURL = '', callback) {
            setState((i) => ({
                ...i,
                loading: true,
                tasks: {
                    ...i.tasks,
                    [authConstraints.signupDriver]: taskStatus.Inprogress,
                },
            }));
            authInstance
                .post([authConstraints.root, authConstraints.signupDriver].join('/'), body, {
                    params: {
                        returnURL: encodeURIComponent(returnURL),
                    },
                })
                .then((response) => {
                    setState((i) => ({
                        ...i,
                        errors: [...response.data?.registeredErrors],
                        tasks: {
                            ...i.tasks,
                            [authConstraints.signupDriver]: response.data?.successed
                                ? taskStatus.Completed
                                : taskStatus.Failed,
                        },
                        loading: false,
                    }));
                    if (!!response.data?.successed) {
                        toast.success(`You have become driver successfully`, {});
                        callback?.();
                    }
                })
                .catch((err) => {
                    setState((i) => ({
                        ...i,
                        errors: [err],
                        tasks: {
                            ...i.tasks,
                            [authConstraints.signupDriver]: taskStatus.Failed,
                        },
                        loading: false,
                    }));
                });
        },

        verifyAccount(email, userName, confirmToken) {
            setState((i) => ({
                ...i,
                tasks: {
                    ...i.tasks,
                    [authConstraints.verifiedUser]: taskStatus.Inprogress,
                },
            }));
            authInstance
                .get([authConstraints.root, authConstraints.verifiedUser].join('/'), {
                    params: {
                        email,
                        userName,
                        confirmToken,
                    },
                })
                .then((res) => {
                    if (res.data?.successed) {
                        setState((i) => ({
                            ...i,
                            tasks: {
                                ...i.tasks,
                                [authConstraints.verifiedUser]: taskStatus.Completed,
                            },
                        }));
                    } else {
                        setState((i) => ({
                            ...i,
                            tasks: {
                                ...i.tasks,
                                [authConstraints.verifiedUser]: taskStatus.Completed,
                            },
                            errors: res.data?.errors || [res.data?.error],
                        }));
                    }
                })
                .catch((err) => {
                    setState((i) => ({
                        ...i,
                        tasks: {
                            ...i.tasks,
                            [authConstraints.verifiedUser]: taskStatus.Failed,
                        },
                    }));
                });
        },

        signout() {
            localStorage.removeItem(authConstraints.LOCAL_KEY);
            localStorage.removeItem(authConstraints.LOCAL_KEY_2);

            setState((i) => ({
                ...i,
                accessToken: localStorage.getItem(authConstraints.LOCAL_KEY),
                accountInfo: null,
                driverInfo: null,
                errors: null,
                isLogged: false,
                loading: false,
                roles: null,
                senderInfo: null,
            }));

            window.location.replace('');
        },

        getAccount() {
            setState((i) => ({
                ...i,
                loading: true,
                errors: [],
                tasks: {
                    ...i.tasks,
                    [authConstraints.getAccount]: taskStatus.Inprogress,
                },
            }));
            authInstance
                .get([authConstraints.root, authConstraints.getAccount].join('/'), {
                    headers: {
                        Authorization: [
                            config.AuthenticationSchema,
                            localStorage.getItem(authConstraints.LOCAL_KEY),
                        ].join(' '),
                    },
                    signal: controller.signal,
                })
                .then((response) => {
                    if (response?.data) {
                        setState((i) => ({
                            ...i,
                            accountInfo: response.data,
                            isLogged: true,
                            roles: response.data?.roles,
                            tasks: {
                                ...i.tasks,
                                [authConstraints.getAccount]: taskStatus.Completed,
                            },
                            loading: false,
                        }));
                    }
                })
                .catch((err) => {
                    if (err.message === 'canceled') {
                        setState((i) => ({
                            ...i,
                            isLogged: false,
                            tasks: {
                                ...i.tasks,
                                [authConstraints.getAccount]: taskStatus.Inprogress,
                            },
                            loading: false,
                        }));
                    } else {
                        setState((i) => ({
                            ...i,
                            isLogged: false,
                            tasks: {
                                ...i.tasks,
                                [authConstraints.getAccount]: taskStatus.Failed,
                            },
                            loading: false,
                        }));
                    }
                });
        },

        resetPassword(email, newPassword = '', returnURL = '', token = '') {
            setState((i) => ({
                ...i,
                errors: [],
                tasks: {
                    ...i.tasks,
                    [authConstraints.resetPwd]: taskStatus.Inprogress,
                },
            }));
            authInstance
                .post(
                    [authConstraints.root, authConstraints.resetPwd].join('/'),
                    {
                        email,
                        newPassword,
                    },
                    {
                        params: {
                            returnURL: encodeURI(returnURL),
                            token,
                        },
                    },
                )
                .then((response) => {
                    if (response.data?.successed) {
                        toast.success('Reset Password Completed!');
                        setState((i) => ({
                            ...i,
                            errors: [],
                            tasks: {
                                ...i.tasks,
                                [authConstraints.resetPwd]: taskStatus.Completed,
                            },
                        }));
                    } else if (response.status === 201) {
                        toast.success(response?.data);
                        setState((i) => ({
                            ...i,
                            errors: [],
                            tasks: {
                                ...i.tasks,
                                [authConstraints.resetPwd]: taskStatus.Completed,
                            },
                        }));
                    } else {
                        toast.warning(response?.data || '');
                        setState((i) => ({
                            ...i,
                            errors:
                                (response?.data?.errors && [...response?.data?.errors]) ||
                                (typeof response.data === 'string' && [response.data]) ||
                                [],
                            tasks: {
                                ...i.tasks,
                                [authConstraints.resetPwd]: taskStatus.Failed,
                            },
                        }));
                    }
                })
                .catch((err) => {
                    setState((i) => ({
                        ...i,
                        errors: [err.message],
                        tasks: {
                            ...i.tasks,
                            [authConstraints.resetPwd]: taskStatus.Failed,
                        },
                    }));
                });
        },

        getAllVehicles() {
            return authInstance
                .get([authConstraints.root, authConstraints.vehicles].join('/'))
                .then((response) => {
                    if (response?.data?.vehicles) {
                        setState((i) => ({
                            ...i,
                            vehicles: response?.data?.vehicles,
                        }));
                    }
                })
                .catch((err) => {
                    setState((i) => ({
                        ...i,
                        errors: [err.message],
                    }));
                });
        },

        getAllPackgeTypes() {
            return authInstance
                .get([authConstraints.root, authConstraints.packageTypes].join('/'))
                .then((response) => {
                    if (response?.data?.packageTypes) {
                        setState((i) => ({
                            ...i,
                            packageTypes: response?.data?.packageTypes,
                        }));
                    }
                })
                .catch((err) => {
                    setState((i) => ({
                        ...i,
                        errors: [err.message],
                    }));
                });
        },

        clearErrors() {
            setState((i) => ({
                ...i,
                errors: [],
                tasks: {},
            }));
        },
    };

    const accountActions = {
        updateProfile(body) {
            setState((i) => ({
                ...i,
                loading: true,
                tasks: {
                    ...i.tasks,
                    [authConstraints.updateUser]: taskStatus.Inprogress,
                },
            }));

            return authInstance
                .post([authConstraints.root, authConstraints.updateUser].join('/'), body, {
                    // params: {
                    //     userId
                    // },
                    headers: {
                        Authorization: [
                            config.AuthenticationSchema,
                            localStorage.getItem(authConstraints.LOCAL_KEY),
                        ].join(' '),
                    },
                })
                .then((response) => {
                    if (!!response.data?.userInfo && !!response.data?.successed) {
                        setState((i) => ({
                            ...i,
                            accountInfo: response.data.userInfo,
                            tasks: {
                                ...i.tasks,
                                [authConstraints.updateUser]: taskStatus.Completed,
                            },
                        }));

                        toast.success('Updated user information');
                        setState((i) => ({
                            ...i,
                            loading: false,
                        }));
                    } else {
                        toast.error('Updated failed');
                        setState((i) => ({
                            ...i,
                            loading: false,
                            tasks: {
                                ...i.tasks,
                                [authConstraints.updateUser]: taskStatus.Failed,
                            },
                        }));
                    }
                })
                .catch((err) => {
                    toast.error(err.response);
                    setState((i) => ({
                        ...i,
                        loading: false,
                        tasks: {
                            ...i.tasks,
                            [authConstraints.updateUser]: taskStatus.Failed,
                        },
                    }));
                });
        },
        updateDriverProfile(body) {
            setState((i) => ({
                ...i,
                loading: true,
            }));

            return authInstance
                .post([authConstraints.root, authConstraints.updateDriver].join('/'), body, {
                    headers: {
                        Authorization: [
                            config.AuthenticationSchema,
                            localStorage.getItem(authConstraints.LOCAL_KEY),
                        ].join(' '),
                    },
                })
                .then((response) => {
                    if (!!response.data?.userInfo && !!response.data?.successed) {
                        setState((i) => ({
                            ...i,
                            accountInfo: response.data.userInfo,
                            loading: false,
                        }));

                        toast.success('Updated user information', {});
                    }
                })
                .catch((err) => {
                    setState((i) => ({
                        ...i,
                        loading: false,
                    }));
                    toast.error(err.response);
                });
        },
        changePassword(oldPassword, newPassword) {
            setState((i) => ({
                ...i,
                tasks: {
                    ...i.tasks,
                    [authConstraints.changePwd]: taskStatus.Inprogress,
                },
            }));
            authInstance
                .post(
                    [authConstraints.root, authConstraints.changePwd].join('/'),
                    {
                        oldPassword,
                        newPassword,
                    },
                    {
                        headers: {
                            Authorization: [
                                config.AuthenticationSchema,
                                localStorage.getItem(authConstraints.LOCAL_KEY),
                            ].join(' '),
                        },
                    },
                )
                .then((response) => {
                    if (!!response.data?.successed) {
                        toast.success('Update password completed !');
                        setState((i) => ({
                            ...i,
                            errors: [],
                            tasks: {
                                ...i.tasks,
                                [authConstraints.changePwd]: taskStatus.Completed,
                            },
                            loading: false,
                        }));
                    } else {
                        setState((i) => ({
                            ...i,
                            errors:
                                typeof response.data === 'string'
                                    ? [response.data]
                                    : response.data?.errors && Array.isArray(response.data?.errors)
                                    ? response.data?.errors
                                    : [],
                            tasks: {
                                ...i.tasks,
                                [authConstraints.changePwd]: taskStatus.Failed,
                            },
                            loading: false,
                        }));
                    }
                })
                .catch((err) => {
                    setState((i) => ({
                        ...i,
                        errors: [err],
                        tasks: {
                            ...i.tasks,
                            [authConstraints.changePwd]: taskStatus.Failed,
                            loading: false,
                        },
                    }));
                });
        },
    };

    useEffect(() => {
        const newAccessToken = localStorage.getItem(authConstraints.LOCAL_KEY);

        if (!hasMounted.current) {
            hasMounted.current = true;

            setState((i) => {
                return {
                    ...i,
                    accessToken: newAccessToken || 'noaccesstoken',
                };
            });
        }

        if (!newAccessToken) {
            setState((i) => ({
                ...i,
                loading: false,
            }));
        }

        funcs.getAllVehicles();
        funcs.getAllPackgeTypes();

        return () => {
            hasMounted.current = false;
            controller.abort();
        };
    }, []);

    useEffect(() => {
        if (state.accessToken === 'noaccesstoken') {
            return;
        }
        if (hasMounted.current && !state.isLogged && !!localStorage.getItem(authConstraints.LOCAL_KEY)) {
            funcs.getAccount();
        }

        return () => {
            controller.abort();
        };
    }, [state.accessToken]);

    return (
        <AuthContext.Provider
            value={[
                state,
                {
                    ...funcs,
                    ...accountActions,
                    setGState: setState,
                },
            ]}
        >
            {children}
        </AuthContext.Provider>
    );
}
