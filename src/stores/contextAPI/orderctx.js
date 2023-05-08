import React, { createContext, useEffect } from 'react'
import {authConstraints, authInstance, config} from '../../api'
import taskStatus from './taskStatus';

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
                console.log(response);
                if(response?.data?.newOrders){
                    setState(i => ({
                        ...i,
                        tasks: {
                            ...i.tasks,
                            [authConstraints.postOrder] : taskStatus.Completed
                        }
                    }));
                }
            }).catch(err =>{
                setState(i =>({
                    ...i,
                    errors: [err],
                    tasks: {
                        ...i.tasks,
                        [authConstraints.postOrder] : taskStatus.Failed
                    }
                }));
            }).finally(() =>{
                setState(i =>({
                    ...i,
                    loading: false,
                }));
            });
        },
    }

    const actions = {
        
    }

    useEffect(() => {

    }, []);

    useEffect(() =>{
        
    },[]);

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