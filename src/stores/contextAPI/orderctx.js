import React, { createContext, useEffect } from 'react'
import {authConstraints} from '../../api'

export const OrderContext = createContext();

export default function Index({children}) {
    const [state,setState] = React.useState({
        accessToken: "",
        accountInfo: null,
        driverInfo: null,
        senderInfo: null,
        loading: true,
        error: [],
        isLogged: false,
        roles: [],
        vehicles: []
    });

    const hasMounted = React.useRef(false);    

    const funcs = {
        
    }

    const accountActions = {
        
    }

    useEffect(() => {

        if(hasMounted.current && state.accountInfo == null && !state.isLogged){
            funcs.getAccount();
        }
    }, [state.accessToken]);

    useEffect(() =>{
        var hasLoggedIn = !!localStorage.getItem(authConstraints.LOCAL_KEY);

        if(hasLoggedIn && !hasMounted.current){
            const newAccessToken = localStorage.getItem(authConstraints.LOCAL_KEY);
            console.log("new access token: " + newAccessToken);
            hasMounted.current = true;
            
            setState(i =>{
                return {
                    ...i, 
                    accessToken: newAccessToken
                };
            });
        }

        funcs.getAllVehicles();

        return () =>{
            hasMounted.current = false;
        }
    },[]);

    return (
        <OrderContext.Provider value={[
            state,
            {
                ...funcs,
                ...accountActions,
                setGState: setState
            }
        ]
        }>
            {children}
        </OrderContext.Provider>
    )
}