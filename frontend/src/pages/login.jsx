import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import axios from 'axios'

const API_BASE = 'http://localhost:5000/api'

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [userType, setUserType] = useState('patient')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [specialization, setSpecialization] = useState('')
  const [experience, setExperience] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const endpoint = userType === 'patient' 
        ? (isLogin ? '/users/login' : '/users/register')
        : (isLogin ? '/doctors/login' : '/doctors/register')
      
      const payload = isLogin 
        ? { email, password }
        : userType === 'patient'
          ? { name: fullName, email, password, age: 25, gender: 'Other', bloodGroup: 'O+' }
          : { name: fullName, email, password, age: 30, specialization, experience: parseInt(experience) || 0, mode: 'Both' }
      
      const response = await axios.post(`${API_BASE}${endpoint}`, payload)
      
      if (response.data.accessToken) {
        localStorage.setItem('token', response.data.accessToken)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Auth error:', error)
      const message = error.response?.data?.message || 'Authentication failed'
      if (error.response?.status === 409) {
        alert('User already exists. Please try logging in instead.')
        setIsLogin(true)
      } else {
        alert(message)
      }
    }
  }

  const handleGoogleAuth = () => {
    const googleRoute = userType === 'patient' ? '/auth/google/patient' : '/auth/google/doctor'
    window.location.href = `${API_BASE}${googleRoute}`
  }

  return (
    <>
      <Head>
        <title>AyurCare - Login</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div className="min-h-screen bg-green-50">
        {/* Header */}
        <div className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center text-gray-700 hover:text-gray-900 transition-colors duration-300">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-green-500 rounded-full mr-2 flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              <span className="text-xl font-semibold text-gray-800">AyurCare</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex justify-center px-4 pt-8 bg-green-50">
          <div className="bg-white rounded-3xl shadow-sm p-8 w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                {isLogin ? 'Welcome Back' : 'Join AyurCare'}
              </h1>
              <p className="text-gray-600 text-sm">
                {isLogin 
                  ? 'Sign in to your account to continue your wellness journey'
                  : 'Create your account to start your healing journey'
                }
              </p>
            </div>

            {/* Login/Sign Up Toggle */}
            <div className="flex mb-8">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 text-center font-medium transition-all duration-300 hover:scale-105 ${
                  isLogin ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 text-center font-medium transition-all duration-300 hover:scale-105 ${
                  !isLogin ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* User Type Selection */}
              <div className="mb-6">
                <p className="text-gray-800 font-medium mb-3">I am a:</p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setUserType('patient')}
                    className={`flex-1 py-3 px-4 rounded-xl font-medium flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-md ${
                      userType === 'patient'
                        ? 'bg-teal-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    Patient
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType('doctor')}
                    className={`flex-1 py-3 px-4 rounded-xl font-medium flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-md ${
                      userType === 'doctor'
                        ? 'bg-teal-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                    </svg>
                    Doctor
                  </button>
                </div>
              </div>

              {/* Full Name Input - Only for Sign Up */}
              {!isLogin && (
                <div className="mb-4">
                  <label className="block text-gray-800 font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-700 placeholder-gray-500 transition-all duration-300 hover:bg-gray-100"
                    required
                  />
                </div>
              )}

              {/* Email Input */}
              <div className="mb-4">
                <label className="block text-gray-800 font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-700 placeholder-gray-500 transition-all duration-300 hover:bg-gray-100"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="mb-4">
                <label className="block text-gray-800 font-medium mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isLogin ? "Enter your password" : "Create a password"}
                  className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-700 placeholder-gray-500 transition-all duration-300 hover:bg-gray-100"
                  required
                />
              </div>

              {/* Confirm Password Input - Only for Sign Up */}
              {!isLogin && (
                <div className="mb-4">
                  <label className="block text-gray-800 font-medium mb-2">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-700 placeholder-gray-500 transition-all duration-300 hover:bg-gray-100"
                    required
                  />
                </div>
              )}

              {/* Doctor-specific fields - Only for Sign Up and Doctor */}
              {!isLogin && userType === 'doctor' && (
                <>
                  <div className="mb-4">
                    <label className="block text-gray-800 font-medium mb-2">Specialization</label>
                    <input
                      type="text"
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      placeholder="e.g., Panchakarma, General Ayurveda"
                      className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-700 placeholder-gray-500 transition-all duration-300 hover:bg-gray-100"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-800 font-medium mb-2">Years of Experience</label>
                    <input
                      type="text"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      placeholder="Years of practice"
                      className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-700 placeholder-gray-500 transition-all duration-300 hover:bg-gray-100"
                      required
                    />
                  </div>
                </>
              )}

              {!isLogin && userType === 'patient' && <div className="mb-6"></div>}
              {isLogin && <div className="mb-6"></div>}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-green-500 text-white py-4 px-4 rounded-xl font-semibold hover:bg-green-600 hover:scale-105 transition-all duration-300 hover:shadow-lg mb-6"
              >
                {isLogin 
                  ? `Sign In as ${userType === 'patient' ? 'Patient' : 'Doctor'}`
                  : `Create ${userType === 'patient' ? 'Patient' : 'Doctor'} Account`
                }
              </button>

              {/* Doctor Verification Notice - Only for Doctor Sign Up */}
              {!isLogin && userType === 'doctor' && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <h4 className="text-blue-800 font-medium mb-1">Doctor Verification</h4>
                  <p className="text-blue-600 text-sm">
                    Doctor accounts require verification of medical credentials before activation.
                  </p>
                </div>
              )}

              {/* Divider */}
              <div className="text-center text-gray-400 text-sm mb-4 uppercase tracking-wide">OR CONTINUE WITH</div>

              {/* Google Sign In */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-4 px-4 rounded-xl font-medium hover:bg-gray-100 hover:scale-105 transition-all duration-300 hover:shadow-md flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}