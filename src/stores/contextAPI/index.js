import React, { createContext } from 'react'

export default function index({children}) {
    const ContextProvider = createContext();
    const [context,setContext] = React.useState();
  return (
    <ContextProvider.Provider value={{context}}>
        {children}
    </ContextProvider.Provider>
  )
}
export const useContext = () =>{
    return React.useContext(ContextProvider);
}