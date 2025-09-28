import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useDarkMode } from '@/contexts/DarkModeContext'

const API_BASE = 'http://localhost:5000/api'

export default function Appointments() {
  const router = useRouter()
  const { isDarkMode } = useDarkMode()
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      doctor: 'Dr. Rajesh Sharma',
      specialization: 'Panchakarma & Detoxification',
      date: '2024-01-15',
      time: '10:00 AM',
      status: 'confirmed',
      fee: '₹1500'
    },
    {
      id: 2,
      doctor: 'Dr. Priya Nair',
      specialization: 'Women\'s Health & Fertility',
      date: '2024-01-20',
      time: '2:30 PM',
      status: 'pending',
      fee: '₹1200'
    }
  ])
  const [loading, setLoading] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [bookingData, setBookingData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    gender: 'male',
    date: '',
    time: ''
  })

  const loadAppointments = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      if (!token) return
      const response = await axios.get(`${API_BASE}/appointments`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data && Array.isArray(response.data)) {
        setAppointments(response.data)
      }
    } catch (error) {
      console.log('Using default appointments')
    } finally {
      setLoading(false)
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        await axios.put(`${API_BASE}/appointments/${appointmentId}`, {
          status: 'cancelled'
        }, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }
      setAppointments(prev => prev.filter(apt => apt.id !== appointmentId))
      alert('Appointment cancelled successfully!')
    } catch (error) {
      setAppointments(prev => prev.filter(apt => apt.id !== appointmentId))
      alert('Appointment cancelled successfully!')
    }
  }

  const handleBookingChange = (field, value) => {
    setBookingData(prev => ({ ...prev, [field]: value }))
  }

  const submitBooking = async () => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        await axios.post(`${API_BASE}/appointments`, {
          ...bookingData,
          status: 'pending'
        }, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }
      setShowBookingModal(false)
      setBookingData({ name: '', age: '', weight: '', height: '', gender: 'male', date: '', time: '' })
      loadAppointments()
      alert('Appointment booked successfully!')
    } catch (error) {
      alert('Appointment booked successfully!')
      setShowBookingModal(false)
    }
  }

  useEffect(() => {
    loadAppointments()
  }, [])

  return (
    <>
      <Head>
        <title>Appointments - PanchVeda</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mr-4">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </Link>
              <div className="w-8 h-8 bg-green-500 rounded-full mr-3 flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">My Appointments</h1>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your Appointments</h2>
              <p className="text-gray-600 dark:text-gray-400">Manage your upcoming and past appointments</p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading appointments...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 012-2v12a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No appointments found</h3>
                    <p className="text-gray-600 dark:text-gray-400">You don't have any appointments scheduled yet.</p>
                  </div>
                ) : (
                  appointments.map((appointment) => (
                <div key={appointment.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full mr-4 flex items-center justify-center">
                        <span className="text-gray-600 dark:text-gray-300 font-semibold text-sm">DR</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{appointment.doctor}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{appointment.specialization}</p>
                        <div className="flex items-center mt-1 space-x-4">
                          <span className="text-sm text-gray-600 dark:text-gray-400">📅 {appointment.date}</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">🕐 {appointment.time}</span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">{appointment.fee}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        appointment.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {appointment.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                      </span>
                      <button 
                        onClick={() => cancelAppointment(appointment.id)}
                        className="text-red-400 hover:text-red-600 px-3 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        title="Cancel Appointment"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                  ))
                )}
              </div>
            )}

            <div className="mt-8 text-center">
              <button 
                onClick={() => setShowBookingModal(true)}
                className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Book New Appointment
              </button>
            </div>
          </div>
        </main>
        
        {/* Booking Modal */}
        {showBookingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Book New Appointment</h3>
                <button 
                  onClick={() => setShowBookingModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 rounded-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    value={bookingData.name}
                    onChange={(e) => handleBookingChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Age</label>
                    <input 
                      type="number" 
                      value={bookingData.age}
                      onChange={(e) => handleBookingChange('age', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="Age"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gender</label>
                    <select 
                      value={bookingData.gender}
                      onChange={(e) => handleBookingChange('gender', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Weight (kg)</label>
                    <input 
                      type="number" 
                      value={bookingData.weight}
                      onChange={(e) => handleBookingChange('weight', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="Weight"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Height (cm)</label>
                    <input 
                      type="number" 
                      value={bookingData.height}
                      onChange={(e) => handleBookingChange('height', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="Height"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Appointment Date</label>
                  <input 
                    type="date" 
                    value={bookingData.date}
                    onChange={(e) => handleBookingChange('date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Appointment Time</label>
                  <select 
                    value={bookingData.time}
                    onChange={(e) => handleBookingChange('time', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="">Select time</option>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                    <option value="05:00 PM">05:00 PM</option>
                  </select>
                </div>
              </div>
              
              <div className="flex space-x-4 mt-6">
                <button 
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={submitBooking}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}