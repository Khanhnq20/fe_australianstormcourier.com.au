import axios from "axios";
import config from '../config';
import { authInstance } from "../auth";

const constraints = {
    root: "/api/sender",
    // Local storage key of access token
    LOCAL_KEY: "actoken",
    // Local storage key of refresh token 
    LOCAL_KEY_2: "ractoken",
    // URL of API endpoints
    
    getAccessToken: () => localStorage.getItem(constraints.LOCAL_KEY)
}

export const senderInstance = axios.create({
    baseURL: config.APIHost,
});

senderInstance.interceptors.response.use(response =>{
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