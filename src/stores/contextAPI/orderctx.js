import React, { createContext } from 'react';
import { authConstraints, authInstance, config } from '../../api';
import taskStatus from './taskStatus';
import { toast } from 'react-toastify';

export const OrderContext = createContext();

export default function Index({ children }) {
    const [state, setState] = React.useState({
        loading: false,
        errors: [],
        orders: [],
        tasks: {},
    });

    const funcs = {
        getJobAvailables(page, amount, state) {
            setState((i) => ({
                ...i,
                loading: true,
                tasks: {
                    ...i.tasks,
                    [authConstraints.getDriverJobs]: taskStatus.Inprogress,
                },
            }));
            return authInstance
                .get([authConstraints.driverRoot, authConstraints.getDriverJobs].join(' '), {
                    headers: {
                        Authorization: [
                            config.AuthenticationSchema,
                            localStorage.getItem(authConstraints.LOCAL_KEY),
                        ].join(' '),
                    },
                    params: {
                        page,
                        amount,
                        state,
                    },
                })
                .then((response) => {
                    if (response.data?.successed) {
                        setState((i) => ({
                            ...i,
                            loading: false,
                            tasks: {
                                ...i.tasks,
                                [authConstraints.getDriverJobs]: taskStatus.Completed,
                            },
                        }));
                    } else {
                        setState((i) => ({
                            ...i,
                            loading: false,
                            tasks: {
                                ...i.tasks,
                                [authConstraints.getDriverJobs]: taskStatus.Failed,
                            },
                        }));
                    }
                })
                .catch((error) => {
                    setState((i) => ({
                        ...i,
                        loading: false,
                        tasks: {
                            ...i.tasks,
                            [authConstraints.getDriverJobs]: taskStatus.Failed,
                        },
                    }));
                });
        },

        postOrder(body) {
            setState((i) => ({
                ...i,
                loading: true,
                tasks: {
                    ...i.tasks,
                    [authConstraints.postOrder]: taskStatus.Inprogress,
                },
            }));

            authInstance
                .post([authConstraints.userRoot, authConstraints.postOrder].join('/'), body, {
                    headers: {
                        Authorization: [
                            config.AuthenticationSchema,
                            localStorage.getItem(authConstraints.LOCAL_KEY),
                        ].join(' '),
                    },
                })
                .then((response) => {
                    if (response?.data?.successed && response?.data?.newOrder) {
                        setState((i) => ({
                            ...i,
                            tasks: {
                                ...i.tasks,
                                [authConstraints.postOrder]: taskStatus.Completed,
                            },
                        }));
                        toast.success('Post successfully');
                    }

                    toast.error(response?.data?.error);
                    setState((i) => ({
                        ...i,
                        loading: false,
                    }));
                })
                .catch((err) => {
                    setState((i) => ({
                        ...i,
                        errors: [err],
                        tasks: {
                            ...i.tasks,
                            [authConstraints.postOrder]: taskStatus.Failed,
                        },
                        loading: false,
                    }));
                    toast.error('Post failed');
                });
        },

        postDriverOffer(body) {
            setState((i) => {
                return {
                    ...i,
                    // loading: true,
                    tasks: {
                        ...i.tasks,
                        [authConstraints.postDriverOffers]: taskStatus.Inprogress,
                    },
                };
            });
            return authInstance
                .post([authConstraints.driverRoot, authConstraints.postDriverOffers].join('/'), body, {
                    headers: {
                        Authorization: [
                            config.AuthenticationSchema,
                            localStorage.getItem(authConstraints.LOCAL_KEY),
                        ].join(' '),
                    },
                })
                .then((response) => {
                    if (response.data?.successed) {
                        setState((i) => ({
                            ...i,
                            loading: false,
                            tasks: {
                                ...i.tasks,
                                [authConstraints.postDriverOffers]: taskStatus.Completed,
                            },
                        }));
                        toast.success('Post offer successfully');
                    } else {
                        setState((i) => ({
                            ...i,
                            loading: false,
                            tasks: {
                                ...i.tasks,
                                [authConstraints.postDriverOffers]: taskStatus.Failed,
                            },
                        }));
                        toast.warning(response.data?.error || 'Post offer incompletely');
                    }
                })
                .catch((error) => {
                    setState((i) => ({
                        ...i,
                        errors: [error.message],
                        loading: false,
                        tasks: {
                            ...i.tasks,
                            [authConstraints.postDriverOffers]: taskStatus.Completed,
                        },
                    }));
                    toast.error(error.message);
                });
        },

        getActiveOrders() {
            return authInstance
                .get([authConstraints.driverRoot, authConstraints.getDriverActiveOrders].join('/'), {
                    headers: {
                        Authorization: [
                            config.AuthenticationSchema,
                            localStorage.getItem(authConstraints.LOCAL_KEY),
                        ].join(' '),
                    },
                })
                .then((response) => {})
                .catch((error) => {});
        },

        putCancelOffer(orderId) {
            setState((i) => ({
                ...i,
                loading: true,
                tasks: { [authConstraints.putCancelOffer]: taskStatus.Inprogress },
            }));
            authInstance
                .put([authConstraints.driverRoot, authConstraints.putCancelOffer].join('/'), null, {
                    headers: {
                        Authorization: [
                            config.AuthenticationSchema,
                            localStorage.getItem(authConstraints.LOCAL_KEY),
                        ].join(' '),
                    },
                    params: {
                        orderId,
                        returnURL: encodeURIComponent(window.location.origin),
                    },
                })
                .then((response) => {
                    if (response.data?.successed) {
                        setState((i) => ({
                            ...i,
                            loading: false,
                            tasks: { [authConstraints.putCancelOffer]: taskStatus.Completed },
                        }));
                        toast.success('Updated offer status successfully');
                    } else {
                        setState((i) => ({
                            ...i,
                            loading: false,
                            tasks: { [authConstraints.putCancelOffer]: taskStatus.Failed },
                        }));

                        toast.error(response.data?.error);
                    }
                })
                .catch((error) => {
                    setState((i) => ({
                        ...i,
                        loading: false,
                        tasks: { [authConstraints.putCancelOffer]: taskStatus.Failed },
                    }));
                    toast.error(error?.status + ': ' + error?.message);
                });
        },

        putStartOrder(orderId) {
            setState((i) => ({
                ...i,
                loading: true,
                tasks: { [authConstraints.putStartOrder]: taskStatus.Inprogress },
            }));
            authInstance
                .put([authConstraints.driverRoot, authConstraints.putStartOrder].join('/'), null, {
                    headers: {
                        Authorization: [
                            config.AuthenticationSchema,
                            localStorage.getItem(authConstraints.LOCAL_KEY),
                        ].join(' '),
                    },
                    params: {
                        orderId,
                        returnURL: encodeURIComponent(window.location.origin),
                    },
                })
                .then((response) => {
                    if (response.data?.successed) {
                        setState((i) => ({
                            ...i,
                            loading: false,
                            tasks: { [authConstraints.putStartOrder]: taskStatus.Completed },
                        }));
                        toast.success('Sent message to client. You can start picking up now');
                    } else {
                        setState((i) => ({
                            ...i,
                            loading: false,
                            tasks: { [authConstraints.putStartOrder]: taskStatus.Failed },
                        }));

                        toast.error(response.data?.error);
                    }
                })
                .catch((error) => {
                    setState((i) => ({
                        ...i,
                        loading: false,
                        tasks: { [authConstraints.putStartOrder]: taskStatus.Failed },
                    }));
                    toast.error(error?.status + ': ' + error?.message);
                });
        },

        putPrepareOrder(body) {
            setState((i) => ({
                ...i,
                tasks: { [authConstraints.putPrepareOrder]: taskStatus.Inprogress },
            }));
            authInstance
                .put([authConstraints.driverRoot, authConstraints.putPrepareOrder].join('/'), body, {
                    headers: {
                        Authorization: [
                            config.AuthenticationSchema,
                            localStorage.getItem(authConstraints.LOCAL_KEY),
                        ].join(' '),
                    },
                    params: {
                        returnURL: encodeURIComponent(window.location.origin),
                    },
                })
                .then((response) => {
                    if (response.data?.successed) {
                        setState((i) => ({
                            ...i,
                            tasks: {
                                [authConstraints.putPrepareOrder]: taskStatus.Completed,
                            },
                        }));
                    } else {
                        setState((i) => ({
                            ...i,
                            tasks: { [authConstraints.putPrepareOrder]: taskStatus.Failed },
                        }));

                        toast.error(response.data?.error);
                    }
                })
                .catch((error) => {
                    setState((i) => ({
                        ...i,
                        tasks: { [authConstraints.putPrepareOrder]: taskStatus.Failed },
                    }));
                    toast.error(error?.status + ': ' + error?.message);
                });
        },

        putDeliveryOrder(orderId) {
            setState((i) => ({
                ...i,
                tasks: { [authConstraints.putDeliverOrder]: taskStatus.Inprogress },
            }));
            authInstance
                .put([authConstraints.driverRoot, authConstraints.putDeliverOrder].join('/'), null, {
                    headers: {
                        Authorization: [
                            config.AuthenticationSchema,
                            localStorage.getItem(authConstraints.LOCAL_KEY),
                        ].join(' '),
                    },
                    params: {
                        orderId,
                        returnURL: encodeURIComponent(window.location.origin),
                    },
                })
                .then((response) => {
                    if (response.data?.successed) {
                        setState((i) => ({
                            ...i,
                            tasks: {
                                [authConstraints.putDeliverOrder]: taskStatus.Completed,
                            },
                        }));
                    } else {
                        setState((i) => ({
                            ...i,
                            tasks: { [authConstraints.putDeliverOrder]: taskStatus.Failed },
                        }));

                        toast.error(response.data?.error);
                    }
                })
                .catch((error) => {
                    toast.error(error?.status + ': ' + error?.message);
                });
        },

        putReceiveOrder(body) {
            setState((i) => ({
                ...i,
                tasks: { [authConstraints.putReceiveOrder]: taskStatus.Inprogress },
            }));
            authInstance
                .put([authConstraints.driverRoot, authConstraints.putReceiveOrder].join('/'), body, {
                    headers: {
                        Authorization: [
                            config.AuthenticationSchema,
                            localStorage.getItem(authConstraints.LOCAL_KEY),
                        ].join(' '),
                    },
                    params: {
                        returnURL: encodeURIComponent(window.location.origin),
                    },
                })
                .then((response) => {
                    if (response.data?.successed) {
                        setState((i) => ({
                            ...i,
                            tasks: {
                                [authConstraints.putReceiveOrder]: taskStatus.Completed,
                            },
                        }));
                    } else {
                        setState((i) => ({
                            ...i,
                            tasks: { [authConstraints.putReceiveOrder]: taskStatus.Failed },
                        }));

                        toast.error(response.data?.error);
                    }
                })
                .catch((error) => {
                    toast.error(error?.status + ': ' + error?.message);
                });
        },

        putCancelOrder(orderId) {
            setState((i) => ({
                ...i,
                tasks: { [authConstraints.putCancelOffer]: taskStatus.Inprogress },
            }));
            authInstance
                .put([authConstraints.driverRoot, authConstraints.putCancelOffer].join('/'), null, {
                    headers: {
                        Authorization: [
                            config.AuthenticationSchema,
                            localStorage.getItem(authConstraints.LOCAL_KEY),
                        ].join(' '),
                    },
                    params: {
                        orderId,
                        returnURL: encodeURIComponent(window.location.origin),
                    },
                })
                .then((response) => {
                    if (response.data?.successed) {
                        setState((i) => ({
                            ...i,
                            tasks: { [authConstraints.putCancelOffer]: taskStatus.Completed },
                        }));
                    } else {
                        setState((i) => ({
                            ...i,
                            tasks: { [authConstraints.putCancelOffer]: taskStatus.Failed },
                        }));

                        toast.error(response.data?.error);
                    }
                })
                .catch((error) => {
                    toast.error(error?.status + ': ' + error?.message);
                });
        },
    };

    return (
        <OrderContext.Provider
            value={[
                state,
                {
                    ...funcs,
                    setGState: setState,
                },
            ]}
        >
            {children}
        </OrderContext.Provider>
    );
}
