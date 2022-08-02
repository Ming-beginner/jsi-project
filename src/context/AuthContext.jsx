import React, {createContext, useContext, useState} from 'react'

const AuthContext = createContext();

const useAuth = ()=>{
    return useContext(AuthContext)
}

const AuthProvider = ({children}) => {
  const [currentUser, setCurrentUser] = useState()
  return (
    <AuthContext.Provider value={{currentUser, setCurrentUser}}>
        {children}
    </AuthContext.Provider>
  )
}

export {useAuth, AuthProvider}