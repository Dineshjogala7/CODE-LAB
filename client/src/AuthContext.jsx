import { createContext, useCallback, useContext, useState } from "react"

const AuthContext = createContext();

export const AuthProvider = ({children})=>{
    const [userName,setUserName] = useState("")
    return <AuthContext.Provider value= {{userName,setUserName}}>
        {children}
    </AuthContext.Provider>
}
export const useAuth = ()=>{
    const context = useContext(AuthContext);
    if(!context) throw new Error ("Auth must have a provider value")
    return context
}