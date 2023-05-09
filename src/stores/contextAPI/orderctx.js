import React, { createContext, useEffect } from 'react'
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
                if(response?.data?.newOrders){
                    setState(i => ({
                        ...i,
                        tasks: {
                            ...i.tasks,
                            [authConstraints.postOrder] : taskStatus.Completed
                        },
                    }));
                }

                setState(i =>({
                    ...i,
                    loading: false
                }));

                toast.success("Post successfully");
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
    }

    const actions = {
        
    }

    useEffect(() => {

    }, []);

    return (
        <OrderContext.Provider value={[
            state,
            {
                ...funcs,
                ...actions,
                setGState: setState
            }
        ]
        }>
            {children}
        </OrderContext.Provider>
    )
}