import React, { createContext, useEffect } from 'react'
import {authConstraints, authInstance, config} from '../../api'
import { toast } from 'react-toastify';
export const AuthContext = createContext();

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
        saveAccessToken(accessToken, refreshToken){
            localStorage.removeItem(authConstraints.LOCAL_KEY);
            localStorage.removeItem(authConstraints.LOCAL_KEY_2);

            localStorage.setItem(authConstraints.LOCAL_KEY, accessToken);
            localStorage.setItem(authConstraints.LOCAL_KEY_2, refreshToken);

            this.getAccount();
        },

        signin(body) {
            setState(i =>({
                ...i,
                loading: true
            }));
            authInstance.post([authConstraints.root, authConstraints.signin].join("/"), body).then(response =>{
                if(response?.data?.token?.accessToken && response?.data?.token?.refreshToken){
                    const {data} = response;
                    const {accessToken, refreshToken} = data?.token;

                    this.saveAccessToken(accessToken, refreshToken);
                    setState(i => ({
                        ...i,
                        accessToken: accessToken
                    }));
                }
            }).catch(err =>{
                setState(i => ({
                    ...i,
                    error: err
                }));
            }).finally(() =>{
                setState(i =>({
                    ...i,
                    loading: false
                }))
            });
        },
    
        signupUser(body){
            authInstance.post([authConstraints.root, authConstraints.signupUser].join("/"), body).then(response =>{
                if(!!response?.successed){
                    toast.success(`You have registered account successfully, please goto "Signin" to join us`, {
                    });
                }
                else{
                    toast.error("");
                }
            }).catch(err =>{
                setState(i => ({
                    ...i,
                    error: err
                }));
            });
        },
    
        signupDriver(body){
            authInstance.post([authConstraints.root, authConstraints.signupDriver].join("/"), body, {
                headers: { "Authorization": [config.AuthenticationSchema, state.accessToken].join(" ")}
            }).then(response =>{
                if(response.data?.successed){
                    toast.success(`You have become driver successfully`, {
                    });
                }
            }).catch(err =>{
                setState(i =>({
                    ...i,
                    error: err
                }));
            });
        },

        signupSender(body){
            authInstance.post([authConstraints.root, authConstraints.signupSender].join("/"), body,{
                headers: { "Authorization": [config.AuthenticationSchema, state.accessToken].join(" ")}
            }).then(response =>{
                if(response?.data?.successed){
                    toast.success(`You have become sender successfully`, {
                    });
                }
            }).catch(err =>{
                setState(i =>({
                    ...i,
                    error: err
                }));
            });
        },

        signout(){
            localStorage.removeItem(authConstraints.LOCAL_KEY);
            localStorage.removeItem(authConstraints.LOCAL_KEY_2);

            setState(i => ({
                ...i,
                accessToken: localStorage.getItem(authConstraints.LOCAL_KEY),
                accountInfo: null,
                driverInfo: null,
                error: null,
                isLogged: false,
                loading: false,
                roles: null,
                senderInfo: null
            }));
        },

        getAccount(){
            authInstance.get([authConstraints.root, authConstraints.getAccount].join("/"), {
                headers: {
                    "Authorization": [config.AuthenticationSchema, localStorage.getItem(authConstraints.LOCAL_KEY)].join(" ")
                }
            })
            .then(response =>{
                setState(i => ({
                    ...i,
                    accountInfo: response.data,
                    isLogged: true,
                    roles: response.roles
                }));
            }).catch(err =>{
                setState(i =>({
                    ...i,
                    error: err,
                    isLogged: false
                }));
            }).finally(() =>{
                setState(i =>({
                    ...i,
                    loading: false
                }));
            });
        },
    
        refreshToken(){
            authInstance.get([authConstraints.root, authConstraints.refreshToken].join("/")).then(response =>{

            }).catch(err =>{

            });
        },

        changePassword(){
            authInstance.post([authConstraints.root, authConstraints.forgetPwd].join("/")).then(response =>{

            }).catch(err =>{

            });
        },

        getAllVehicles(){
            return authInstance
                .get([authConstraints.root, authConstraints.vehicles].join("/"))
                .then(response =>{
                    if(response?.data?.vehicles){
                        setState(i => ({
                            ...i,
                            vehicles: response?.data?.vehicles
                        }));
                    }
                }).catch(err =>{
                    setState(i =>({
                        ...i,
                        error: err,
                    }));
                }).finally(() =>{
                    setState(i =>({
                        ...i,
                        loading: false
                    }));
                });
        },

        test(){
            authInstance.get([authConstraints.root, authConstraints.test].join("/")).then(response =>{

            }).catch(err =>{

            });
        }
    }

    const accountActions = {
        updateProfile(body, userId) {
            setState(i =>({
                ...i,
                loading: true,
            }));

            return authInstance.post([authConstraints.root, authConstraints.updateUser].join("/"), body, {
                params: {
                    userId
                },
                headers: {
                    "Authorization": [config.AuthenticationSchemax, localStorage.getItem(authConstraints.LOCAL_KEY)].join(' ')
                }
            }).then(response =>{
                if(!!response.data?.userInfo && !!response.data?.successed){
                    setState(i => ({
                        ...i,
                        accountInfo: response.data.userInfo
                    }));

                    toast.success("Updated user information", {
                    });
                }
            }).catch(err =>{
                toast.error(err.response);
            }).finally(() =>{
                setState(i =>({
                    ...i,
                    loading: false
                }));
            });
        },
        changePassword(body, userId){
            
        }
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
        <AuthContext.Provider value={[
            state,
            {
                ...funcs,
                ...accountActions,
                setGState: setState
            }
        ]
        }>
            {children}
        </AuthContext.Provider>
    )
}