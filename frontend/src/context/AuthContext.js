import { createContext, useState } from 'react'
import { login, adminLogin } from '../api/auth'

export const AuthContext = createContext()

export const AuthProvider = ({children}) => {

  const [user,setUser] = useState(()=>{

    const saved = localStorage.getItem('user')

    return saved ? JSON.parse(saved) : null

  })

  const loginUser = async(credentials)=>{

    const data = await login(credentials)

    localStorage.setItem('token',data.token)

    const userData = {
      name:data.name,
      role:data.role
    }

    localStorage.setItem('user',JSON.stringify(userData))

    setUser(userData)

  }

  const loginAdmin = async(credentials)=>{

    const data = await adminLogin(credentials)

    if(data.role !== 'admin') throw new Error('Not authorized')

    localStorage.setItem('token',data.token)

    const userData = {
      name:data.name,
      role:data.role
    }

    localStorage.setItem('user',JSON.stringify(userData))

    setUser(userData)

  }

  const logoutUser = ()=>{

    localStorage.removeItem('token')
    localStorage.removeItem('user')

    setUser(null)

  }

  return(

    <AuthContext.Provider
      value={{
        user,
        loginUser,
        loginAdmin,
        logoutUser
      }}
    >

      {children}

    </AuthContext.Provider>

  )

}