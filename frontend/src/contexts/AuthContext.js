import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

  // Configure axios defaults
  useEffect(() => {
    axios.defaults.withCredentials = true
    
    // Add request interceptor to include token
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Add response interceptor to handle token expiration
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          await logout()
        }
        return Promise.reject(error)
      }
    )

    return () => {
      axios.interceptors.request.eject(requestInterceptor)
      axios.interceptors.response.eject(responseInterceptor)
    }
  }, [])

  // Check authentication status on mount
  useEffect(() => {
    // Check for OAuth redirect first
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    const userParam = urlParams.get('user')
    const authSuccess = urlParams.get('auth_success')
    
    if (authSuccess && token && userParam) {
      try {
        const userData = JSON.parse(decodeURIComponent(userParam))
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(userData))
        setUser(userData)
        setIsAuthenticated(true)
        setLoading(false)
        console.log('✅ OAuth authentication successful')
        return
      } catch (error) {
        console.error('Error parsing OAuth data:', error)
      }
    }
    
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token')
      const userData = localStorage.getItem('user')
      
      if (token && userData) {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        setIsAuthenticated(true)
        
        // Verify token is still valid
        try {
          await axios.get(`${API_BASE}/users/profile`)
        } catch (error) {
          if (error.response?.status === 401) {
            await logout()
          }
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      await logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password, userType) => {
    try {
      const endpoint = userType === 'patient' ? '/users/login' : '/doctors/login'
      const response = await axios.post(`${API_BASE}${endpoint}`, {
        email,
        password
      })

      const { accessToken, user: userData } = response.data
      
      localStorage.setItem('token', accessToken)
      localStorage.setItem('user', JSON.stringify(userData))
      
      setUser(userData)
      setIsAuthenticated(true)
      
      return { success: true, user: userData }
    } catch (error) {
      console.error('Login failed:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      }
    }
  }

  const register = async (userData, userType) => {
    try {
      const endpoint = userType === 'patient' ? '/users/register' : '/doctors/register'
      const response = await axios.post(`${API_BASE}${endpoint}`, userData)

      const { accessToken, user: newUser } = response.data
      
      localStorage.setItem('token', accessToken)
      localStorage.setItem('user', JSON.stringify(newUser))
      
      setUser(newUser)
      setIsAuthenticated(true)
      
      return { success: true, user: newUser }
    } catch (error) {
      console.error('Registration failed:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      }
    }
  }

  const logout = async () => {
    try {
      // Call backend logout endpoint
      await axios.post(`${API_BASE}/auth/google/logout`)
    } catch (error) {
      console.error('Logout API call failed:', error)
    } finally {
      // Clear local storage and state regardless of API call result
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setUser(null)
      setIsAuthenticated(false)
      router.push('/login')
    }
  }

  const updateUser = (updatedUser) => {
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    checkAuthStatus
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}