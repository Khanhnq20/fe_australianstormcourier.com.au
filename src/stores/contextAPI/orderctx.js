import React, { createContext } from 'react'
import {authConstraints, authInstance, config} from '../../api'
import taskStatus from './taskStatus';
import { toast } from 'react-toastify';

export const OrderContext = createContext();

export default function Index({children}) {
    const [state,setState] = React.useState({
        loading: false,
        errors: [],
        orders: [],
        tasks: {}
    });

    const funcs = {
        getJobAvailables(){
            return authInstance.get([authConstraints.driverRoot, authConstraints.getDriverJobs].join(" "), {
                headers: {
                    'Authorization': [config.AuthenticationSchema, localStorage.getItem(authConstraints.LOCAL_KEY)].join(" ")
                }
            })
            .then(response =>{
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            });
        },

        postOrder(body){
            setState(i =>({
                ...i,
                loading: true,
                tasks: {
                    ...i.tasks,
                    [authConstraints.getAccount] : taskStatus.Inprogress
                }
            }));

            authInstance.post([authConstraints.userRoot, authConstraints.postOrder].join("/"),body, {
                headers: {
                    "Authorization": [config.AuthenticationSchema, localStorage.getItem(authConstraints.LOCAL_KEY)].join(" ")
                }
            }).then(response =>{
                if(response?.data?.successed && response?.data?.newOrder){
                    setState(i => ({
                        ...i,
                        tasks: {
                            ...i.tasks,
                            [authConstraints.postOrder] : taskStatus.Completed
                        },
                    }));
                    toast.success("Post successfully");
                }

                toast.error(response?.data?.error);
                setState(i =>({
                    ...i,
                    loading: false
                }));
            }).catch(err =>{
                setState(i =>({
                    ...i,
                    errors: [err],
                    tasks: {
                        ...i.tasks,
                        [authConstraints.postOrder] : taskStatus.Failed
                    },
                    loading: false
                }));
                toast.error("Post failed");
            });
        },

        postDriverOffer(body){
            return authInstance.post([authConstraints.driverRoot, authConstraints.postDriverOffers].join("/"), body, {
                headers: {
                    'Authorization': [config.AuthenticationSchema, localStorage.getItem(authConstraints.LOCAL_KEY)].join(" ")
                }
            })
            .then(response =>{
                console.log(response);
                toast.success("Post offer successfully");
            })
            .catch(error => {
                setState(i => ({
                    ...i,
                    errors: [error.message] 
                }));
                toast.error(error.message);
            });
        },

        getActiveOrders(){
            return authInstance.get([authConstraints.driverRoot, authConstraints.getDriverActiveOrders].join("/"), {
                headers: {
                    'Authorization': [config.AuthenticationSchema, localStorage.getItem(authConstraints.LOCAL_KEY)].join(" ")
                }
            })
            .then(response =>{
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            });
        },
    }

    return (
        <OrderContext.Provider value={[
            state,
            {
                ...funcs,
                setGState: setState
            }
        ]
        }>
            {children}
        </OrderContext.Provider>
    )
}