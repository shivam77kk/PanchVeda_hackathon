import { useState } from 'react'
import Head from 'next/head'

export default function TestAuth() {
  const [userType, setUserType] = useState('patient')
  
  const handleGoogleAuth = () => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
    const googleRoute = userType === 'patient' ? '/api/auth/google/patient' : '/api/auth/google/doctor'
    console.log('Redirecting to:', `${API_BASE}${googleRoute}`)
    window.location.href = `${API_BASE}${googleRoute}`
  }

  const testBackendConnection = async () => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const response = await fetch(`${API_BASE}/api/auth/google/health`)
      const data = await response.json()
      console.log('Backend health check:', data)
      alert('Backend connection successful! Check console for details.')
    } catch (error) {
      console.error('Backend connection failed:', error)
      alert('Backend connection failed! Check console for details.')
    }
  }

  return (
    <>
      <Head>
        <title>Test Google Auth</title>
      </Head>
      
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6 text-center">Test Google OAuth</h1>
          
          <div className="mb-6">
            <p className="text-gray-700 mb-3">Select user type:</p>
            <div className="flex gap-3">
              <button
                onClick={() => setUserType('patient')}
                className={`flex-1 py-2 px-4 rounded ${
                  userType === 'patient'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Patient
              </button>
              <button
                onClick={() => setUserType('doctor')}
                className={`flex-1 py-2 px-4 rounded ${
                  userType === 'doctor'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Doctor
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleGoogleAuth}
              className="w-full bg-red-500 text-white py-3 px-4 rounded hover:bg-red-600 transition-colors"
            >
              Test Google OAuth as {userType}
            </button>
            
            <button
              onClick={testBackendConnection}
              className="w-full bg-green-500 text-white py-3 px-4 rounded hover:bg-green-600 transition-colors"
            >
              Test Backend Connection
            </button>
          </div>

          <div className="mt-6 text-sm text-gray-600">
            <p><strong>Expected URL:</strong></p>
            <p className="break-all">
              {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/google/{userType}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}