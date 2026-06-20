import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = (authData) => {
    const userData = {
      id: authData.data.id,
      email: authData.data.email,
      nombre: authData.data.nombre,
      role: authData.data.role
    }
    localStorage.setItem('token', authData.data.token)
    localStorage.setItem('user', JSON.stringify(userData))
    setToken(authData.data.token)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  const isAdmin = () => user?.role === 'ADMIN'
  const isVet = () => user?.role === 'VETERINARIO'
  const isCuidador = () => user?.role === 'CUIDADOR'
  const isCliente = () => user?.role === 'CLIENTE'
  const canManage = () => ['ADMIN', 'CUIDADOR', 'VETERINARIO'].includes(user?.role)

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAdmin, isVet, isCuidador, isCliente, canManage }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
