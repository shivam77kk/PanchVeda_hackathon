import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const { token, user, error, auth_success } = router.query
    
    if (auth_success && token && user) {
      try {
        const userData = JSON.parse(decodeURIComponent(user))
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(userData))
        router.push('/dashboard')
      } catch (parseError) {
        console.error('Error parsing user data:', parseError)
        router.push('/login?error=invalid_user_data')
      }
    } else if (error) {
      console.error('Google auth error:', error)
      router.push('/login?error=' + error)
    }
  }, [router.query])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  )
}