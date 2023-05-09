import React, { createContext, useEffect } from 'react'
import {authConstraints, authInstance, config} from '../../api'
import { toast } from 'react-toastify';
import taskStatus from './taskStatus';
export const AuthContext = createContext();

export default function Index({children}) {
    const [state,setState] = React.useState({
        accessToken: "",    
        // accountInfo: null,
        accountInfo: {
            roles: ['User', 'Driver']
        },
        loading: true,
        isLogged: true,
        vehicles: [],
        packageTypes: [],
        errors: [],
        tasks: {}
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
            this.clearErrors();
            setState(i =>({
                ...i,
                loading: true,
                tasks: {
                    ...i.tasks,
                    [authConstraints.signin] : taskStatus.Inprogress
                }
            }));
            authInstance.post([authConstraints.root, authConstraints.signin].join("/"), body).then(response =>{
                if(response?.data?.token?.accessToken && response?.data?.token?.refreshToken){
                    const {data} = response;
                    const {accessToken, refreshToken} = data?.token;

                    this.saveAccessToken(accessToken, refreshToken);
                    setState(i => ({
                        ...i,
                        accessToken: accessToken,
                        tasks: {
                            ...i.tasks,
                            [authConstraints.signin] : taskStatus.Completed
                        }
                    }));
                }
                else {
                    setState(i =>({
                        ...i,
                        errors: [...i.errors, response.data]
                    }))
                }
            }).catch(err =>{
                setState(i => ({
                    ...i,
                    errors: err,
                    tasks: {
                        ...i.tasks,
                        [authConstraints.signin] : taskStatus.Failed
                    }
                }));
            }).finally(() =>{
                setState(i =>({
                    ...i,
                    loading: false
                }))
            });
        },

        signupUser(body){
            setState(i =>({
                ...i,
                loading: true,
                tasks: {
                    ...i.tasks,
                    [authConstraints.signupUser] : taskStatus.Inprogress
                }
            }));
            authInstance.post([authConstraints.root, authConstraints.signupUser].join("/"), body).then(response =>{
                if(!!response.data?.successed){
                    toast.success(`You have registered account successfully, please goto "Signin" to join us`, {});
                }
                    setState(i =>({
                        ...i,
                        errors: [...response.data.registeredErrors, ...response.data.assingedToRoleErrors],
                        tasks: {
                            ...i.tasks,
                            [authConstraints.signupUser] : taskStatus.Completed
                        }
                    }));

            }).catch(err =>{
                if(err?.response){
                    setState(i => ({
                        ...i,
                        errors: [err?.response],
                        tasks: {
                            ...i.tasks,
                            [authConstraints.signupUser] : taskStatus.Failed
                        }
                    }));
                }
            }).finally(() =>{
                setState(i =>({
                    ...i,
                    loading: false
                }));
            });
        },
    
        signupDriver(body){
            setState(i =>({
                ...i,
                loading: true,
                tasks: {
                    ...i.tasks,
                    [authConstraints.signupDriver] : taskStatus.Inprogress
                }
            }));
            authInstance.post([authConstraints.root, authConstraints.signupDriver].join("/"), body).then(response =>{
                if(!!response.data?.successed){
                    toast.success(`You have become driver successfully`, {});
                } 
                    setState(i =>({
                        ...i,
                        errors: [...response.data?.registeredErrors, ...response.data?.assingedToRoleErrors],
                        tasks: {
                            ...i.tasks,
                            [authConstraints.signupDriver] : taskStatus.Completed
                        }
                    }));
            }).catch(err =>{
                if(err){
                    setState(i =>({
                        ...i,
                        errors: [err],
                        tasks: {
                            ...i.tasks,
                            [authConstraints.signupDriver] : taskStatus.Failed
                        }
                    }));
                }
            }).finally(() =>{
                setState(i =>({
                    ...i,
                    loading: false
                }))
            });;
        },

        signout(){
            localStorage.removeItem(authConstraints.LOCAL_KEY);
            localStorage.removeItem(authConstraints.LOCAL_KEY_2);

            setState(i => ({
                ...i,
                accessToken: localStorage.getItem(authConstraints.LOCAL_KEY),
                accountInfo: null,
                driverInfo: null,
                errors: null,
                isLogged: false,
                loading: false,
                roles: null,
                senderInfo: null
            }));
        },

        getAccount(){
            setState(i =>({
                ...i,
                loading: true,
                tasks: {
                    ...i.tasks,
                    [authConstraints.getAccount] : taskStatus.Inprogress
                }
            }));
            authInstance.get([authConstraints.root, authConstraints.getAccount].join("/"), {
                headers: {
                    "Authorization": [config.AuthenticationSchema, localStorage.getItem(authConstraints.LOCAL_KEY)].join(" ")
                }
            })
            .then(response =>{
                if(response?.data){
                    setState(i => ({
                        ...i,
                        accountInfo: response.data,
                        isLogged: true,
                        roles: response.roles,
                        tasks: {
                            ...i.tasks,
                            [authConstraints.getAccount] : taskStatus.Completed
                        }
                    }));
                }
            }).catch(err =>{
                setState(i =>({
                    ...i,
                    errors: [err],
                    isLogged: false,
                    tasks: {
                        ...i.tasks,
                        [authConstraints.getAccount] : taskStatus.Failed
                    }
                }));
            }).finally(() =>{
                setState(i =>({
                    ...i,
                    loading: false,
                }));
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
                        errors: [err],
                    }));
                });
        },

        getAllPackgeTypes(){
            return authInstance
                .get([authConstraints.root, authConstraints.packageTypes].join("/"))
                .then(response =>{
                    if(response?.data?.packageTypes){
                        setState(i => ({
                            ...i,
                            packageTypes: response?.data?.packageTypes
                        }));
                    }
                }).catch(err =>{
                    setState(i =>({
                        ...i,
                        errors: [err],
                    }));
                });
        },
        
        clearErrors(){
            setState(i =>({
                ...i,
                errors: [],
                tasks: {}
            }));
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
        if(!!hasMounted.current && !state.isLogged){
            funcs.getAccount();
        }
        else{
            setState(i => ({
                ...i,
                loading: false
            }));
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
        funcs.getAllPackgeTypes();

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