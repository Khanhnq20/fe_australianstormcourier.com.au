import { HttpTransportType, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import React, { createContext, useContext, useEffect, useState } from "react";
import { authConstraints, config } from "../../api";
import { AuthContext } from "../contextAPI";

export const SocketContext = createContext();

export  default function Index({children}){
    const [authState] = useContext(AuthContext);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socketConnection, setSocketConnection] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if(process.env.NODE_ENV !== 'production'){
            const connection = new HubConnectionBuilder()
            .withUrl(`${config.APIHost}${authConstraints.userHub}`,{
                accessTokenFactory: () => localStorage.getItem(authConstraints.LOCAL_KEY),
            })
            // .configureLogging(LogLevel.Trace)
            .configureLogging(LogLevel.Information)
            .withAutomaticReconnect()
            .build();

            setSocketConnection(connection);
            return;
        }
        const connection = new HubConnectionBuilder()
                .withUrl(`${config.APIHost}${authConstraints.userHub}`,{
                    accessTokenFactory: () => localStorage.getItem(authConstraints.LOCAL_KEY),
                })
                .withAutomaticReconnect()
                .build();

            setSocketConnection(connection);
    }, []);

    useEffect(() =>{
        if(socketConnection){
            socketConnection
                .start()
                .then(() => {
                    console.log("Connection established");
                    socketConnection.send(authConstraints.hubOnline, authState?.accountInfo?.id);
                })
                .catch((error) => setError(error));
                
            socketConnection.on(authConstraints.hubReceiveOnline, (successed, userOnlines) => {
                if(successed){
                    setOnlineUsers(userOnlines);
                }
            });
        }
    }, [socketConnection])

    const funcs = {

    }

    return (
        <SocketContext.Provider value={[
            {onlineUsers, error},
            {
                ...funcs
            }
        ]}>
        {children}
        </SocketContext.Provider>
    );
};