import React, { createContext, useEffect } from 'react'
import {authConstraints, authInstance, config} from '../../api'
import { toast } from 'react-toastify';
export const AuthContext = createContext();

export default function Index({children}) {
    const [state,setState] = React.useState({
        accessToken: localStorage.getItem(authConstraints.LOCAL_KEY),
        accountInfo: null,
        driverInfo: null,
        senderInfo: null,
        loading: true,
        error: [],
        isLogged: false,
        roles: []
    });

    const funcs = {
        saveAccessToken(accessToken, refreshToken){
            localStorage.removeItem(authConstraints.LOCAL_KEY);
            localStorage.removeItem(authConstraints.LOCAL_KEY_2);

            localStorage.setItem(authConstraints.LOCAL_KEY, accessToken);
            localStorage.setItem(authConstraints.LOCAL_KEY_2, refreshToken);
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
                setState(i =>({
                    ...i,
                    accountInfo: response.data
                }));

                toast.success(`You have registered account successfully, please goto "Signin" to join us`, {
                });
                
            }).catch(err =>{
                setState(i => ({
                    ...i,
                    error: err
                }));
            });
        },
    
        signupDriver(body){
            authInstance.post([authConstraints.root, authConstraints.signupDriver].join("/"), body).then(response =>{
                setState(i =>({
                    ...i,
                    driverInfo: response.data
                }));
            }).catch(err =>{
                setState(i =>({
                    ...i,
                    error: err
                }));
            });
        },

        getAccount(){
            authInstance.get([authConstraints.root, authConstraints.getAccount].join("/"), {
                headers: {
                    "Authorization": [config.AuthenticationSchema, state.accessToken].join(" ")
                }
            }).then(response =>{
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

        test(){
            authInstance.get([authConstraints.root, authConstraints.test].join("/")).then(response =>{

            }).catch(err =>{

            });
        }
    }

    const accountActions = {
        updateProfile(body, userId) {
            return authInstance.post([authConstraints.root, authConstraints.updateUser].join("/"), body, {
                params: {
                    userId
                },
                headers: {
                    "Authorization": [config.AuthenticationSchema, localStorage.getItem(authConstraints.LOCAL_KEY)].join(' ')
                }
            }).then(response =>{
                if(response?.userInfo && response.successed){
                    setState(i => ({
                        ...i,
                        accountInfo: response.userInfo
                    }));

                    toast.success("Updated user information");
                }
            }).catch(err =>{

            });
        }
    }

    useEffect(() =>{
        setState(i =>{
            const newAccessToken = localStorage.getItem(authConstraints.LOCAL_KEY);
            return {
                ...i, 
                accessToken: newAccessToken
            };
        });
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