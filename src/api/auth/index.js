import axios from "axios";
import config from '../config';

const constraints = {
    root: "/api/auth",
    userRoot: "/api/user",
    driverRoot: "/api/driver",
    paymentRoot: "/api/payment",
    // Local storage key of access token
    LOCAL_KEY: "actoken",
    // Local storage key of refresh token 
    LOCAL_KEY_2: "ractoken",
    // URL of API endpoints
    signin: "signin",
    signout: "signout",

    signupUser: "register/customer",
    signupDriver: "register/driver",
    vehicles: "vehicles",

    updateUser: "update/user",
    changePwd: "update/password",

    getAccount: "account",
    refreshToken: "refresh",

    packageTypes: "package/types",
    postOrder: "order",
    
    postStripeIntent: "intent",
    postCheckoutStripe: "checkout",

    test: "test/authorizedUser",
    getAccessToken: () => localStorage.getItem(constraints.LOCAL_KEY)
}


export const authInstance = axios.create({
    baseURL: config.APIHost,
});

export function tryingToRefresh(trialTime, error){
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
            }
            if(!response?.successed){

            }
        }).catch(err =>{
            return tryingToRefresh(trialTime - 1, err);
        });
    }

    return Promise.reject(error);
}

authInstance.interceptors.response.use(response =>{
    return response;
}, error =>{
    if(error?.response?.status === 401){
        return tryingToRefresh(3, error);
    }
    if(error?.response?.status === 400){
        window.location.replace("/error/400");
    }
    if(error?.response?.status === 404){
        window.location.replace("/error/404");
    }
    if(error?.response?.status === 500){
        window.location.replace("/error/500");
    }

    return Promise.reject(error);
});

export default constraints;