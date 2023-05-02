import axios from "axios";
import config from '../config';

const constraints = {
    root: "/api/auth",
    // Local storage key of access token
    LOCAL_KEY: "actoken",
    // Local storage key of refresh token 
    LOCAL_KEY_2: "ractoken",
    // URL of API endpoints
    signin: "signin",
    signupUser: "register/user",
    signupDriver: "register/driver",
    getAccount: "account",
    updateUser: "update/user",
    refreshToken: "refresh",
    changePwd: "update/password",
    signout: "signout",
    test: "test/authorizedUser",
    getAccessToken: () => localStorage.getItem(constraints.LOCAL_KEY)
}


export const authInstance = axios.create({
    baseURL: config.APIHost,
});

authInstance.interceptors.response.use(response =>{
    return response;
}, error =>{
    if(error.response.code === ""){
        return authInstance.get([constraints.root, constraints.refreshToken].join("/")).then(response =>{
        }).catch(err =>{

        });
    }

    return Promise.reject(error);
});

export default constraints;