import axios from "axios";
import config from '../config';
import { authConstraints } from "..";

const constraints = {
    root: "/api/auth",
    userRoot: "/api/user",
    driverRoot: "/api/driver",
    adminRoot: "/api/admin",
    userHub: "/hubs/user",
    // Local storage key of access token
    LOCAL_KEY: "actoken",
    // Local storage key of refresh token 
    LOCAL_KEY_2: "ractoken",
    // URL of API endpoints
    signin: "signin",
    signout: "signout",

    signupUser: "register/customer",
    signupDriver: "register/driver",
    verifiedUser: "verified/user",

    vehicles: "vehicles",

    updateUser: "update/user",
    updateDriver: "update/driver",
    resetPwd: "password/reset",
    changePwd: "password/update",

    getAccount: "account",
    refreshToken: "refresh",

    packageTypes: "package/types",
    postOrder: "order",

    getUserOrders: "order",
    getUserOrderHistory: "history",

    getDriverJobs: "job",
    postDriverOffers: "offer",
    getDriverActiveOrders: 'order/active',

    getAllOrderInfo: 'order/detail',
    getOrderOffers: 'order/offers',

    acceptDriverOffer: "order/accept",
    postCheckoutIntentSessions: "order/checkout-intent-session",
    postCheckout: "order/checkout",

    putCancelOffer: "offer/cancel",

    getAccountsDriver: "accounts/driver",
    acceptAccountDriver: "accounts/driver/accept",
    getAllAccounts: "accounts/customer",
    blockAccount: "account/block",

    getAllPayments: "payments",

    putDeliverOrder: "order/deliver",
    putReceiveOrder: "order/receive",

    hubOnline: "online",
    hubReceiveOnline: "online",

    test: "test/authorizedUser",
    getAccessToken: () => localStorage.getItem(constraints.LOCAL_KEY)
}


export const authInstance = axios.create({
    baseURL: config.APIHost,
});

export function tryingToRefresh(trialTime, error, callback){
    const accessToken = localStorage.getItem(constraints.LOCAL_KEY); 
    const r_accesssToken = localStorage.getItem(constraints.LOCAL_KEY_2);

    if(trialTime > 0 
        && !!accessToken 
        && !!r_accesssToken
    ){
        return authInstance.get([constraints.root, constraints.refreshToken].join("/"), {
            params: {
                accessToken: accessToken,
                rtoken: r_accesssToken
            }
        }).then(response =>{
            if(!!response?.data?.token){
                const {accessToken, refreshToken} = response.data?.token;

                localStorage.removeItem(constraints.LOCAL_KEY);
                localStorage.removeItem(constraints.LOCAL_KEY_2);

                localStorage.setItem(constraints.LOCAL_KEY, accessToken);
                localStorage.setItem(constraints.LOCAL_KEY_2, refreshToken);

                callback(accessToken);
            }

        }).catch(err =>{
            return tryingToRefresh(trialTime - 1, err);
        });
    }

    return Promise.reject(error);
}

authInstance.interceptors.response.use(response =>{
    return response;
}, async (error) =>{
    const isDevelopment = process.env.NODE_ENV === 'development';
    let originalRequest = error.config;
    if(error.message === "Network Error"){
        window.location.replace("/error/500");
    }
    if(error?.response?.status === 401 && !originalRequest._retry && localStorage.getItem(authConstraints.LOCAL_KEY) && localStorage.getItem(authConstraints.LOCAL_KEY_2)){
        originalRequest._retry = true;

        const response =  await axios.get([constraints.root, constraints.refreshToken].join("/"), {
            baseURL: config.APIHost,
            params: {
                accessToken: localStorage.getItem(constraints.LOCAL_KEY),
                rtoken: localStorage.getItem(constraints.LOCAL_KEY_2)
            }
        });

        if(response?.data?.successed){
            const {accessToken, refreshToken} = response?.data?.token;
    
            localStorage.removeItem(constraints.LOCAL_KEY);
            localStorage.setItem(constraints.LOCAL_KEY, accessToken);
            localStorage.removeItem(constraints.LOCAL_KEY_2);
            localStorage.setItem(constraints.LOCAL_KEY_2, refreshToken);
    
            originalRequest.headers['Authorization'] = [config.AuthenticationSchema, accessToken].join(' ');
    
            return authInstance(originalRequest);
        }
    }
    if(error?.response?.status === 400 && !isDevelopment){
        window.location.replace("/error/400");
    }
    if(error?.response?.status === 404 && !isDevelopment){
        window.location.replace("/error/404");
    }
    if(error?.response?.status === 500 && !isDevelopment){
        window.location.replace("/error/500");
    }

    return Promise.reject(error);
});

export default constraints;