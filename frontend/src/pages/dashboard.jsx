import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import axios from 'axios'

const API_BASE = 'http://localhost:5000/api'

export default function Dashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('Dashboard')
  const [quizStarted, setQuizStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [doshaResult, setDoshaResult] = useState(null)
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [medications, setMedications] = useState([{name: 'Triphala Churna', dosage: '1 tsp twice daily after meals'}])
  const [showAddMedication, setShowAddMedication] = useState(false)
  const [newMedication, setNewMedication] = useState({name: '', dosage: ''})
  
  // Settings state
  const [settings, setSettings] = useState({
    darkMode: false,
    pushNotifications: true,
    dataSharing: false,
    language: 'en'
  })
  
  // Backend data states
  const [user, setUser] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [documents, setDocuments] = useState([])
  const [iotDevices, setIotDevices] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Load data on component mount
  useEffect(() => {
    // Check for OAuth redirect parameters
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    const userParam = urlParams.get('user')
    const authSuccess = urlParams.get('auth_success')
    const tab = urlParams.get('tab')
    const startQuiz = urlParams.get('startQuiz')
    
    if (authSuccess && token && userParam) {
      try {
        const userData = JSON.parse(decodeURIComponent(userParam))
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(userData))
        setUser(userData)
        // Clean URL
        window.history.replaceState({}, document.title, '/dashboard')
      } catch (error) {
        console.error('Error parsing OAuth data:', error)
      }
    }
    
    // Handle direct navigation to Dosha quiz
    if (tab === 'Dosha') {
      setActiveTab('Dosha')
      if (startQuiz === 'true') {
        setQuizStarted(true)
      }
    }
    
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    
    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
      } catch (error) {
        console.error('Error parsing stored user:', error)
      }
    }
    
    setLoading(false)
  }, [])
  
  // API Functions
  const loadUserData = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return
      const response = await axios.get(`${API_BASE}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUser(response.data)
    } catch (error) {
      console.error('Error loading user data:', error)
      setUser(null)
    }
  }
  
  const loadAppointments = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return
      const response = await axios.get(`${API_BASE}/appointments`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAppointments(response.data)
    } catch (error) {
      console.error('Error loading appointments:', error)
      setAppointments([])
    }
  }
  
  const loadDocuments = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return
      const response = await axios.get(`${API_BASE}/documents`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setDocuments(response.data)
    } catch (error) {
      console.error('Error loading documents:', error)
      setDocuments([])
    }
  }
  
  const loadIotDevices = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return
      const response = await axios.get(`${API_BASE}/smartwatch`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setIotDevices(response.data)
    } catch (error) {
      console.error('Error loading IoT devices:', error)
      setIotDevices([])
    }
  }
  
  const loadSettings = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setLoading(false)
        return
      }
      const response = await axios.get(`${API_BASE}/settings`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSettings(response.data)
    } catch (error) {
      console.error('Error loading settings:', error)
    }
    setLoading(false)
  }

  const questions = [
    {
      question: "What is your natural body build?",
      options: [
        "Thin, light frame, find it hard to gain weight",
        "Medium, muscular build, moderate weight",
        "Large, heavy frame, gain weight easily"
      ]
    },
    {
      question: "How is your appetite?",
      options: [
        "Variable, sometimes hungry, sometimes not",
        "Strong, regular, get irritated when hungry",
        "Steady, can skip meals without discomfort"
      ]
    },
    {
      question: "How do you handle stress?",
      options: [
        "Worry, anxiety, restlessness",
        "Anger, irritation, frustration",
        "Calm, steady, sometimes withdrawn"
      ]
    },
    {
      question: "What is your sleep pattern?",
      options: [
        "Light sleeper, difficulty falling asleep",
        "Moderate sleep, wake up refreshed",
        "Deep sleeper, hard to wake up"
      ]
    },
    {
      question: "How is your energy level?",
      options: [
        "Comes in bursts, then crashes",
        "Steady, high energy throughout day",
        "Steady, slow to start but sustained"
      ]
    },
    {
      question: "How do you learn best?",
      options: [
        "Quick to learn, quick to forget",
        "Moderate pace, good retention",
        "Slow to learn, excellent retention"
      ]
    },
    {
      question: "What is your skin type?",
      options: [
        "Dry, rough, cool to touch",
        "Warm, oily, prone to rashes",
        "Thick, smooth, cool and moist"
      ]
    },
    {
      question: "How do you prefer weather?",
      options: [
        "Warm, humid weather",
        "Cool, well-ventilated spaces",
        "Warm, dry weather"
      ]
    }
  ]

  const handleAnswerSelect = (answerIndex) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answerIndex
    setAnswers(newAnswers)
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateResult(newAnswers)
    }
  }

  const calculateResult = async (allAnswers) => {
    const scores = { vata: 0, pitta: 0, kapha: 0 }
    
    allAnswers.forEach(answer => {
      if (answer === 0) scores.vata++
      else if (answer === 1) scores.pitta++
      else scores.kapha++
    })
    
    const total = allAnswers.length
    const result = {
      vata: Math.round((scores.vata / total) * 100),
      pitta: Math.round((scores.pitta / total) * 100),
      kapha: Math.round((scores.kapha / total) * 100),
      primary: scores.vata > scores.pitta && scores.vata > scores.kapha ? 'Vata' :
               scores.pitta > scores.kapha ? 'Pitta' : 'Kapha',
      answers: allAnswers
    }
    
    setDoshaResult(result)
    setQuizCompleted(true)
    saveDoshaResult(result)
  }

  const resetQuiz = () => {
    setQuizStarted(false)
    setCurrentQuestion(0)
    setAnswers([])
    setQuizCompleted(false)
    setDoshaResult(null)
  }

  // Education Quiz State
  const [educationQuiz, setEducationQuiz] = useState({active: false, type: '', currentQ: 0, answers: [], completed: false})

  const educationQuizzes = {
    basics: {
      questions: [
        {
          question: "How many doshas are there in Ayurveda?",
          options: ["2", "3", "4", "5"],
          correct: 1
        },
        {
          question: "Which dosha is associated with fire element?",
          options: ["Vata", "Pitta", "Kapha", "None"],
          correct: 1
        },
        {
          question: "What does Panchakarma mean?",
          options: ["Three actions", "Four actions", "Five actions", "Six actions"],
          correct: 2
        }
      ],
      explanations: [
        "There are three doshas: Vata, Pitta, and Kapha.",
        "Pitta dosha is associated with fire and water elements.",
        "Panchakarma means \"five actions\" - the five therapeutic procedures."
      ]
    },
    herbs: {
      questions: [
        {
          question: "Which herb is known as the \"King of Herbs\" in Ayurveda?",
          options: ["Turmeric", "Ashwagandha", "Brahmi", "Triphala"],
          correct: 1
        },
        {
          question: "Triphala is a combination of how many fruits?",
          options: ["2", "3", "4", "5"],
          correct: 1
        }
      ],
      explanations: [
        "Ashwagandha is often called the \"King of Herbs\" due to its adaptogenic properties.",
        "Triphala consists of three fruits: Amalaki, Bibhitaki, and Haritaki."
      ]
    }
  }

  const handleEducationQuizAnswer = (answerIndex) => {
    const quiz = educationQuizzes[educationQuiz.type]
    const newAnswers = [...educationQuiz.answers]
    newAnswers[educationQuiz.currentQ] = answerIndex
    
    if (educationQuiz.currentQ < quiz.questions.length - 1) {
      setEducationQuiz({...educationQuiz, currentQ: educationQuiz.currentQ + 1, answers: newAnswers})
    } else {
      setEducationQuiz({...educationQuiz, answers: newAnswers, completed: true})
    }
  }

  const calculateEducationScore = () => {
    const quiz = educationQuizzes[educationQuiz.type]
    let correct = 0
    educationQuiz.answers.forEach((answer, index) => {
      if (answer === quiz.questions[index].correct) correct++
    })
    return correct
  }

  const resetEducationQuiz = () => {
    setEducationQuiz({active: false, type: '', currentQ: 0, answers: [], completed: false})
  }

  const handlePhotoChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfilePhoto(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const addMedication = () => {
    if (newMedication.name && newMedication.dosage) {
      setMedications([...medications, newMedication])
      setNewMedication({name: '', dosage: ''})
      setShowAddMedication(false)
    }
  }

  const removeMedication = (index) => {
    setMedications(medications.filter((_, i) => i !== index))
  }

  const handleSettingToggle = async (setting) => {
    const newSettings = { ...settings, [setting]: !settings[setting] }
    setSettings(newSettings)
    try {
      const token = localStorage.getItem('token')
      await axios.put(`${API_BASE}/settings`, newSettings, {
        headers: { Authorization: `Bearer ${token}` }
      })
    } catch (error) {
      console.error('Error updating settings:', error)
    }
  }

  const handleLanguageChange = async (language) => {
    const newSettings = { ...settings, language }
    setSettings(newSettings)
    try {
      const token = localStorage.getItem('token')
      await axios.put(`${API_BASE}/settings`, newSettings, {
        headers: { Authorization: `Bearer ${token}` }
      })
    } catch (error) {
      console.error('Error updating language:', error)
    }
  }
  
  // Dosha Quiz Backend Integration
  const saveDoshaResult = (result) => {
    console.log('Dosha result:', result)
  }
  
  // Appointment Booking
  const bookAppointment = async (doctorId, dateTime) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(`${API_BASE}/appointments`, {
        doctorId,
        dateTime,
        status: 'scheduled'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAppointments([...appointments, response.data])
      alert('Appointment booked successfully!')
    } catch (error) {
      console.error('Error booking appointment:', error)
      alert('Failed to book appointment')
    }
  }
  
  // Document Upload
  const uploadDocument = async (file, type) => {
    try {
      const token = localStorage.getItem('token')
      const formData = new FormData()
      formData.append('document', file)
      formData.append('type', type)
      
      const response = await axios.post(`${API_BASE}/documents/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      setDocuments([...documents, response.data])
      alert('Document uploaded successfully!')
    } catch (error) {
      console.error('Error uploading document:', error)
      alert('Failed to upload document')
    }
  }
  
  // Profile Update
  const updateProfile = async (profileData) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.put(`${API_BASE}/user/profile`, profileData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUser(response.data)
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile')
    }
  }
  
  // IoT Device Connection
  const connectDevice = async (deviceData) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(`${API_BASE}/smartwatch/connect`, deviceData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setIotDevices([...iotDevices, response.data])
      alert('Device connected successfully!')
    } catch (error) {
      console.error('Error connecting device:', error)
      alert('Failed to connect device')
    }
  }
  
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  const navItems = [
    { name: 'Dashboard', icon: '📊', active: true },
    { name: 'Dosha', icon: '🧘', active: false },
    { name: 'Appointments', icon: '📅', active: false },
    { name: 'Education', icon: '📚', active: false },
    { name: 'Documents', icon: '📄', active: false },
    { name: 'IoT', icon: '📱', active: false },
    { name: 'Profile', icon: '👤', active: false },
    { name: 'Settings', icon: '⚙️', active: false }
  ]

  const reminders = [
    { task: 'Take Triphala', time: '8:00 AM', type: 'medication', completed: false },
    { task: 'Morning Meditation', time: '6:30 AM', type: 'practice', completed: true },
    { task: 'Abhyanga Massage', time: '7:00 PM', type: 'therapy', completed: false }
  ]

  const quickActions = [
    { name: 'Dosha Quiz', icon: '🧘', color: 'bg-blue-50 text-blue-600' },
    { name: 'Add Reminder', icon: '🔔', color: 'bg-orange-50 text-orange-600' },
    { name: 'Book Appointment', icon: '📅', color: 'bg-green-50 text-green-600' },
    { name: 'Learn', icon: '📚', color: 'bg-purple-50 text-purple-600' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>PanchVeda Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-full mr-3 flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">PanchVeda</h1>
                <p className="text-sm text-gray-500">Welcome, {user?.name || 'Demo User'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
              <button 
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === item.name
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main className="p-6">
          {educationQuiz.active ? (
            <div className="max-w-4xl mx-auto">
              {!educationQuiz.completed ? (
                // Quiz Question Page
                <div>
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h1 className="text-2xl font-bold text-gray-900">Interactive Quizzes</h1>
                      <span className="text-sm text-gray-500">{Math.round(((educationQuiz.currentQ + 1) / educationQuizzes[educationQuiz.type].questions.length) * 100)}%</span>
                    </div>
                    
                    <div className="mb-6">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span>Question {educationQuiz.currentQ + 1} of {educationQuizzes[educationQuiz.type].questions.length}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-teal-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${((educationQuiz.currentQ + 1) / educationQuizzes[educationQuiz.type].questions.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">{educationQuizzes[educationQuiz.type].questions[educationQuiz.currentQ].question}</h2>
                    
                    <div className="space-y-4">
                      {educationQuizzes[educationQuiz.type].questions[educationQuiz.currentQ].options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleEducationQuizAnswer(index)}
                          className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-teal-300 hover:bg-teal-50 transition-colors"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                // Quiz Results Page
                <div>
                  <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Interactive Quizzes</h1>
                  </div>

                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/>
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Completed!</h2>
                    <p className="text-gray-600 mb-2">You scored {calculateEducationScore()} out of {educationQuizzes[educationQuiz.type].questions.length}</p>
                    <p className="text-gray-600 mb-6">
                      {calculateEducationScore() === educationQuizzes[educationQuiz.type].questions.length ? 
                        "Excellent! You have a great understanding of Ayurveda." :
                        "Keep studying! There's more to learn about Ayurveda."}
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Answers</h3>
                    
                    {educationQuizzes[educationQuiz.type].questions.map((q, index) => (
                      <div key={index} className="mb-6 last:mb-0">
                        <h4 className="font-medium text-gray-900 mb-2">{q.question}</h4>
                        <div className="mb-2">
                          <span className="text-green-600 text-sm">✓ Correct: {q.options[q.correct]}</span>
                        </div>
                        {educationQuiz.answers[index] !== q.correct && (
                          <div className="mb-2">
                            <span className="text-red-600 text-sm">✗ Your answer: {q.options[educationQuiz.answers[index]]}</span>
                          </div>
                        )}
                        <p className="text-gray-600 text-sm">{educationQuizzes[educationQuiz.type].explanations[index]}</p>
                      </div>
                    ))}
                  </div>

                  <div className="text-center space-x-4">
                    <button
                      onClick={resetEducationQuiz}
                      className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Back to Quizzes
                    </button>
                    <button
                      onClick={() => setEducationQuiz({...educationQuiz, currentQ: 0, answers: [], completed: false})}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Retake Quiz
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : activeTab === 'Dosha' ? (
            <div className="max-w-4xl mx-auto">
              {!quizStarted && !quizCompleted ? (
                // Dosha Discovery Landing Page
                <div>
                  <div className="mb-8">
                    <div className="flex items-center mb-4">
                      <svg className="w-6 h-6 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <h1 className="text-2xl font-bold text-gray-900">AI-Powered Dosha Discovery</h1>
                    </div>
                    <p className="text-gray-600">Discover your unique Ayurvedic constitution through our comprehensive assessment</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Vata Card */}
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-blue-600 mb-2">Vata</h3>
                      <p className="text-sm text-blue-500 mb-2">Air & Space</p>
                      <p className="text-sm text-gray-600">Movement, Creativity, Energy</p>
                    </div>

                    {/* Pitta Card */}
                    <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 text-center">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L13.5 2.5L16.17 5.17L10.5 10.84L11.91 12.25L15.83 8.33L17.5 10H19V9H21ZM7.91 10.25L2.5 15.66L3.91 17.07L7.5 13.48L9.25 15.23L3.84 20.64L5.25 22.05L10.66 16.64L11.91 17.89L7.91 10.25Z"/>
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-red-600 mb-2">Pitta</h3>
                      <p className="text-sm text-red-500 mb-2">Fire & Water</p>
                      <p className="text-sm text-gray-600">Transformation, Intelligence, Heat</p>
                    </div>

                    {/* Kapha Card */}
                    <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-6 text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-green-600 mb-2">Kapha</h3>
                      <p className="text-sm text-green-500 mb-2">Earth & Water</p>
                      <p className="text-sm text-gray-600">Structure, Strength, Stability</p>
                    </div>
                  </div>

                  <div className="text-center">
                    <button
                      onClick={() => setQuizStarted(true)}
                      className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center mx-auto"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      Start Comprehensive Assessment
                    </button>
                  </div>
                </div>
              ) : quizStarted && !quizCompleted ? (
                // Quiz Page
                <div>
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h1 className="text-2xl font-bold text-gray-900">AI-Powered Dosha Discovery</h1>
                      <span className="text-sm text-gray-500">{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
                    </div>
                    <p className="text-gray-600 mb-6">Discover your unique Ayurvedic constitution through our comprehensive assessment</p>
                    
                    <div className="mb-6">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span>Question {currentQuestion + 1} of {questions.length}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-teal-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-8 border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">{questions[currentQuestion].question}</h2>
                    
                    <div className="space-y-4">
                      {questions[currentQuestion].options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleAnswerSelect(index)}
                          className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-teal-300 hover:bg-teal-50 transition-colors"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                // Results Page
                <div>
                  <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">AI-Powered Dosha Discovery</h1>
                    <p className="text-gray-600">Discover your unique Ayurvedic constitution through our comprehensive assessment</p>
                  </div>

                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Primary Dosha: {doshaResult?.primary}</h2>
                    <p className="text-gray-600 mb-6">
                      {doshaResult?.primary === 'Vata' && 'You have a Vata constitution - creative, energetic, and adaptable. Focus on warm, grounding foods and regular routines. Practice meditation and gentle yoga.'}
                      {doshaResult?.primary === 'Pitta' && 'You have a Pitta constitution - intelligent, focused, and determined. Focus on cooling foods and moderate exercise. Practice calming activities and avoid excessive heat.'}
                      {doshaResult?.primary === 'Kapha' && 'You have a Kapha constitution - stable, strong, and calm. Focus on light, spicy foods and regular exercise. Practice energizing activities and avoid excessive rest.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-blue-50 rounded-2xl p-6 text-center">
                      <h3 className="text-lg font-semibold text-blue-600 mb-2">Vata Score</h3>
                      <div className="text-3xl font-bold text-blue-600">{doshaResult?.vata}</div>
                    </div>
                    <div className="bg-red-50 rounded-2xl p-6 text-center">
                      <h3 className="text-lg font-semibold text-red-600 mb-2">Pitta Score</h3>
                      <div className="text-3xl font-bold text-red-600">{doshaResult?.pitta}</div>
                    </div>
                    <div className="bg-green-50 rounded-2xl p-6 text-center">
                      <h3 className="text-lg font-semibold text-green-600 mb-2">Kapha Score</h3>
                      <div className="text-3xl font-bold text-green-600">{doshaResult?.kapha}</div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Personalized Recommendations</h3>
                    
                    <div className="mb-6">
                      <h4 className="text-md font-semibold text-green-600 mb-2">Diet Guidelines</h4>
                      <p className="text-gray-600">
                        {doshaResult?.primary === 'Vata' && 'Eat warm, cooked foods. Include ghee, nuts, and warming spices like ginger and cinnamon.'}
                        {doshaResult?.primary === 'Pitta' && 'Eat cooling, fresh foods. Avoid spicy, oily, and acidic foods. Include sweet fruits and leafy greens.'}
                        {doshaResult?.primary === 'Kapha' && 'Eat light, warm, and spicy foods. Avoid heavy, oily, and sweet foods. Include ginger, turmeric, and black pepper.'}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-md font-semibold text-green-600 mb-2">Lifestyle Tips</h4>
                      <p className="text-gray-600">
                        {doshaResult?.primary === 'Vata' && 'Maintain regular sleep schedule, practice oil massage, and avoid excessive travel.'}
                        {doshaResult?.primary === 'Pitta' && 'Stay cool, practice moderation in all activities, and avoid excessive sun exposure.'}
                        {doshaResult?.primary === 'Kapha' && 'Stay active, wake up early, and engage in stimulating activities.'}
                      </p>
                    </div>
                  </div>

                  <div className="text-center">
                    <button
                      onClick={resetQuiz}
                      className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Take Quiz Again
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : activeTab === 'Education' ? (
            <div>
              {/* Educational Videos Section */}
              <div className="mb-8">
                <div className="flex items-center mb-6">
                  <svg className="w-6 h-6 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m2-10v18a2 2 0 01-2 2H5a2 2 0 01-2-2V4a2 2 0 012-2h14a2 2 0 012 2z" />
                  </svg>
                  <h2 className="text-xl font-semibold text-gray-900">Educational Videos</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  {/* Video 1 */}
                  <div className="bg-white rounded-2xl overflow-hidden border border-gray-200">
                    <div className="relative bg-gradient-to-br from-orange-200 to-orange-400 h-48 flex items-center justify-center">
                      <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">10:30</div>
                      <button className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all">
                        <svg className="w-8 h-8 text-gray-700 ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900">Introduction to Panchakarma</h3>
                    </div>
                  </div>

                  {/* Video 2 */}
                  <div className="bg-white rounded-2xl overflow-hidden border border-gray-200">
                    <div className="relative bg-gradient-to-br from-green-200 to-green-400 h-48 flex items-center justify-center">
                      <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">8:45</div>
                      <button className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all">
                        <svg className="w-8 h-8 text-gray-700 ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900">Understanding Your Dosha</h3>
                    </div>
                  </div>

                  {/* Video 3 */}
                  <div className="bg-white rounded-2xl overflow-hidden border border-gray-200">
                    <div className="relative bg-gradient-to-br from-yellow-200 to-yellow-400 h-48 flex items-center justify-center">
                      <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">12:15</div>
                      <button className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all">
                        <svg className="w-8 h-8 text-gray-700 ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900">Ayurvedic Diet Principles</h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Quizzes Section */}
              <div>
                <div className="flex items-center mb-6">
                  <svg className="w-6 h-6 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <h2 className="text-xl font-semibold text-gray-900">Interactive Quizzes</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Quiz 1 */}
                  <div className="text-center">
                    <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L13.5 2.5L16.17 5.17L10.5 10.84L11.91 12.25L15.83 8.33L17.5 10H19V9H21Z"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Ayurveda Basics</h3>
                    <p className="text-gray-600 mb-4">Test your knowledge of fundamental Ayurvedic principles</p>
                    <div className="mb-4">
                      <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium">3 Questions</span>
                    </div>
                    <button 
                      onClick={() => setEducationQuiz({active: true, type: 'basics', currentQ: 0, answers: [], completed: false})}
                      className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Start Quiz
                    </button>
                  </div>

                  {/* Quiz 2 */}
                  <div className="text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Ayurvedic Herbs</h3>
                    <p className="text-gray-600 mb-4">Learn about common Ayurvedic herbs and their properties</p>
                    <div className="mb-4">
                      <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium">2 Questions</span>
                    </div>
                    <button 
                      onClick={() => setEducationQuiz({active: true, type: 'herbs', currentQ: 0, answers: [], completed: false})}
                      className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Start Quiz
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'Appointments' ? (
            <div>
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <svg className="w-6 h-6 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h1 className="text-xl font-semibold text-gray-900">Book New Appointment</h1>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Dr. Rajesh Sharma */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-start mb-4">
                    <div className="w-12 h-12 bg-gray-300 rounded-full mr-4 flex items-center justify-center">
                      <span className="text-gray-600 font-semibold text-sm">DR</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">Dr. Rajesh Sharma</h3>
                      <p className="text-gray-600 text-sm mb-2">Panchakarma & Detoxification</p>
                      <div className="flex items-center mb-1">
                        <div className="flex items-center mr-3">
                          <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-sm font-medium text-gray-900">4.9</span>
                        </div>
                        <span className="text-sm text-gray-600">15 years</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-900">₹1500</p>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button className="flex-1 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Book Now
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile
                    </button>
                  </div>
                </div>

                {/* Dr. Priya Nair */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-start mb-4">
                    <div className="w-12 h-12 bg-gray-300 rounded-full mr-4 flex items-center justify-center">
                      <span className="text-gray-600 font-semibold text-sm">DR</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">Dr. Priya Nair</h3>
                      <p className="text-gray-600 text-sm mb-2">Women's Health & Fertility</p>
                      <div className="flex items-center mb-1">
                        <div className="flex items-center mr-3">
                          <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-sm font-medium text-gray-900">4.8</span>
                        </div>
                        <span className="text-sm text-gray-600">12 years</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-900">₹1200</p>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button className="flex-1 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Book Now
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'Documents' ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900">My Documents</h1>
                    <p className="text-gray-600 text-sm">Store, upload and manage your medical documents securely</p>
                  </div>
                </div>
                <button 
                  onClick={() => document.getElementById('doc-upload').click()}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload Document
                </button>
                <input 
                  id="doc-upload" 
                  type="file" 
                  className="hidden" 
                  onChange={(e) => uploadDocument(e.target.files[0], 'medical')}
                />
              </div>

              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200 flex items-center justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Blood Test Report.pdf</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Medical Report</span>
                        <span>2024-01-10</span>
                        <span>2.5 MB</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </button>
                    <button className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download
                    </button>
                    <button className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-200 flex items-center justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Prescription.jpg</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Prescription</span>
                        <span>2024-01-08</span>
                        <span>1.2 MB</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </button>
                    <button className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download
                    </button>
                    <button className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'Dashboard' ? (
            <div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Wellness Score */}
            <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-medium mb-2">Wellness Score</h3>
              <div className="text-4xl font-bold mb-4">85%</div>
              <div className="w-full bg-green-300 rounded-full h-2">
                <div className="bg-white h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>

            {/* Today's Vitals */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <h3 className="text-lg font-medium text-gray-900">Today's Vitals</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">BP:</span>
                  <span className="font-medium">120/80</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pulse:</span>
                  <span className="font-medium">72 bpm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">SpO2:</span>
                  <span className="font-medium">98%</span>
                </div>
              </div>
            </div>

            {/* Goals Met */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <h3 className="text-lg font-medium text-gray-900">Goals Met</h3>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">3/4</div>
              <p className="text-gray-600 text-sm">daily goals</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Treatment Progress */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                <h3 className="text-lg font-medium text-gray-900">Treatment Progress</h3>
              </div>
              <div className="mb-4">
                <div className="text-2xl font-bold text-gray-900 mb-1">Day 14</div>
                <p className="text-gray-600 text-sm">of 21-day program</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-green-500 h-3 rounded-full" style={{ width: '67%' }}></div>
              </div>
            </div>

            {/* Current Dosha Balance */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
                <h3 className="text-lg font-medium text-gray-900">Current Dosha Balance</h3>
              </div>
              <div className="flex justify-center mb-6">
                <div className="relative w-40 h-40">
                  <svg className="w-40 h-40" viewBox="0 0 160 160">
                    {/* Vata - Blue (35%) - starts at top */}
                    <path
                      d="M 80 20 A 60 60 0 0 1 134.64 80 L 110 80 A 30 30 0 0 0 80 50 Z"
                      fill="#1E90FF"
                    />
                    {/* Pitta - Orange (40%) */}
                    <path
                      d="M 134.64 80 A 60 60 0 0 1 56.18 128.28 L 68.09 114.14 A 30 30 0 0 0 110 80 Z"
                      fill="#FF8C00"
                    />
                    {/* Kapha - Green (25%) */}
                    <path
                      d="M 56.18 128.28 A 60 60 0 0 1 80 20 L 80 50 A 30 30 0 0 0 68.09 114.14 Z"
                      fill="#32CD32"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex justify-center space-x-6 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: '#1E90FF'}}></div>
                  <span className="text-gray-700">Vata: 35%</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: '#FF8C00'}}></div>
                  <span className="text-gray-700">Pitta: 40%</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: '#32CD32'}}></div>
                  <span className="text-gray-700">Kapha: 25%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Weekly Wellness Trends */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <svg className="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900">Weekly Wellness Trends</h3>
              </div>
              <div className="h-48 relative">
                <svg className="w-full h-full" viewBox="0 0 500 200">
                  {/* Grid lines */}
                  <defs>
                    <pattern id="grid" width="50" height="25" patternUnits="userSpaceOnUse">
                      <path d="M 50 0 L 0 0 0 25" fill="none" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2,2"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  
                  {/* Y-axis labels */}
                  <text x="15" y="25" className="text-xs fill-gray-500">100</text>
                  <text x="20" y="50" className="text-xs fill-gray-500">75</text>
                  <text x="20" y="75" className="text-xs fill-gray-500">50</text>
                  <text x="20" y="100" className="text-xs fill-gray-500">25</text>
                  <text x="25" y="125" className="text-xs fill-gray-500">0</text>
                  
                  {/* Energy line (green) */}
                  <polyline
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    points="50,50 100,45 150,35 200,30 250,25 300,30 350,35 400,40"
                  />
                  
                  {/* Wellness line (blue) */}
                  <polyline
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    points="50,55 100,50 150,40 200,35 250,30 300,35 350,40 400,45"
                  />
                  
                  {/* Data points */}
                  <circle cx="50" cy="50" r="3" fill="#10b981" />
                  <circle cx="100" cy="45" r="3" fill="#10b981" />
                  <circle cx="150" cy="35" r="3" fill="#10b981" />
                  <circle cx="200" cy="30" r="3" fill="#10b981" />
                  <circle cx="250" cy="25" r="3" fill="#10b981" />
                  <circle cx="300" cy="30" r="3" fill="#10b981" />
                  <circle cx="350" cy="35" r="3" fill="#10b981" />
                  <circle cx="400" cy="40" r="3" fill="#10b981" />
                  
                  <circle cx="50" cy="55" r="3" fill="#3b82f6" />
                  <circle cx="100" cy="50" r="3" fill="#3b82f6" />
                  <circle cx="150" cy="40" r="3" fill="#3b82f6" />
                  <circle cx="200" cy="35" r="3" fill="#3b82f6" />
                  <circle cx="250" cy="30" r="3" fill="#3b82f6" />
                  <circle cx="300" cy="35" r="3" fill="#3b82f6" />
                  <circle cx="350" cy="40" r="3" fill="#3b82f6" />
                  <circle cx="400" cy="45" r="3" fill="#3b82f6" />
                  

                </svg>
                
                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 px-12">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>
            </div>

            {/* Sleep & Stress Analysis */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <svg className="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900">Sleep & Stress Analysis</h3>
              </div>
              <div className="h-48 relative">
                <svg className="w-full h-full" viewBox="0 0 500 200">
                  {/* Grid lines */}
                  <defs>
                    <pattern id="grid2" width="50" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 50 0 L 0 0 0 10" fill="none" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2,2"/>
                    </pattern>
                    <linearGradient id="stressArea" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#f87171" stopOpacity="0.6"/>
                      <stop offset="100%" stopColor="#f87171" stopOpacity="0.1"/>
                    </linearGradient>
                    <linearGradient id="sleepArea" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#a855f7" stopOpacity="0.6"/>
                      <stop offset="100%" stopColor="#a855f7" stopOpacity="0.1"/>
                    </linearGradient>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid2)" />
                  
                  {/* Y-axis labels */}
                  <text x="15" y="15" className="text-xs fill-gray-500">40</text>
                  <text x="15" y="40" className="text-xs fill-gray-500">30</text>
                  <text x="15" y="65" className="text-xs fill-gray-500">20</text>
                  <text x="15" y="90" className="text-xs fill-gray-500">10</text>
                  <text x="20" y="115" className="text-xs fill-gray-500">0</text>
                  
                  {/* Stress area (pink/red) */}
                  <path
                    d="M 50 20 L 100 35 L 150 40 L 200 45 L 250 50 L 300 60 L 350 70 L 400 75 L 400 110 L 350 110 L 300 110 L 250 110 L 200 110 L 150 110 L 100 110 L 50 110 Z"
                    fill="url(#stressArea)"
                  />
                  
                  {/* Sleep area (purple) */}
                  <path
                    d="M 50 110 L 100 110 L 150 110 L 200 110 L 250 110 L 300 110 L 350 110 L 400 110 L 400 150 L 350 150 L 300 150 L 250 150 L 200 150 L 150 150 L 100 150 L 50 150 Z"
                    fill="url(#sleepArea)"
                  />
                  

                </svg>
                
                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 px-12">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <svg className="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (action.name === 'Dosha Quiz') {
                        setActiveTab('Dosha')
                        setQuizStarted(true)
                      }
                    }}
                    className={`p-4 rounded-xl text-center transition-all hover:scale-105 ${action.color}`}
                  >
                    <div className="text-2xl mb-2">{action.icon}</div>
                    <div className="text-sm font-medium">{action.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Today's Reminders */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900">Today's Reminders</h3>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
              <div className="space-y-3">
                {reminders.map((reminder, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={reminder.completed}
                        className="mr-3 w-4 h-4 text-green-600 rounded"
                        readOnly
                      />
                      <div>
                        <div className={`font-medium ${reminder.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {reminder.task}
                        </div>
                        <div className="text-sm text-gray-500">{reminder.time}</div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      reminder.type === 'medication' ? 'bg-green-100 text-green-800' :
                      reminder.type === 'practice' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {reminder.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
            </div>
          ) : activeTab === 'IoT' ? (
            <div>
              <div className="flex items-center mb-6">
                <svg className="w-6 h-6 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Connected Devices & Wearables</h1>
                  <p className="text-gray-600 text-sm">Manage your smartwatches, fitness trackers, and health monitoring devices</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full mr-4 flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">Apple Watch Series 9</h3>
                      <p className="text-gray-600 text-sm">Smartwatch</p>
                      <div className="flex items-center mt-1">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium mr-2">Connected</span>
                        <span className="text-gray-500 text-sm">Last sync: 2 mins ago</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        78%
                      </div>
                      <span className="text-xs text-gray-500">Battery</span>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full mr-4 flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">Fitbit Charge 5</h3>
                      <p className="text-gray-600 text-sm">Fitness Tracker</p>
                      <div className="flex items-center mt-1">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium mr-2">Connected</span>
                        <span className="text-gray-500 text-sm">Last sync: 5 mins ago</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        92%
                      </div>
                      <span className="text-xs text-gray-500">Battery</span>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-red-100 rounded-full mr-4 flex items-center justify-center">
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">Blood Pressure Monitor</h3>
                      <p className="text-gray-600 text-sm">Medical Device</p>
                      <div className="flex items-center mt-1">
                        <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium mr-2">Disconnected</span>
                        <span className="text-gray-500 text-sm">Last sync: 2 hours ago</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        45%
                      </div>
                      <span className="text-xs text-gray-500">Battery</span>
                    </div>
                    <button 
                      onClick={() => connectDevice({type: 'blood-pressure', name: 'Blood Pressure Monitor'})}
                      className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Connect
                    </button>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Device</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl p-6 text-center transition-colors">
                    <svg className="w-8 h-8 text-gray-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm font-medium text-gray-900">Smartwatch</p>
                  </button>
                  <button className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl p-6 text-center transition-colors">
                    <svg className="w-8 h-8 text-gray-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <p className="text-sm font-medium text-gray-900">Fitness Tracker</p>
                  </button>
                  <button className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl p-6 text-center transition-colors">
                    <svg className="w-8 h-8 text-gray-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <p className="text-sm font-medium text-gray-900">Heart Monitor</p>
                  </button>
                  <button className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl p-6 text-center transition-colors">
                    <svg className="w-8 h-8 text-gray-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm font-medium text-gray-900">Health App</p>
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-time Health Monitoring</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-red-50 rounded-xl p-6 text-center">
                    <svg className="w-8 h-8 text-red-500 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <div className="text-2xl font-bold text-red-600 mb-1">72</div>
                    <p className="text-sm text-red-600 font-medium">Heart Rate (bpm)</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-6 text-center">
                    <svg className="w-8 h-8 text-blue-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <div className="text-2xl font-bold text-blue-600 mb-1">8,547</div>
                    <p className="text-sm text-blue-600 font-medium">Steps Today</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-6 text-center">
                    <svg className="w-8 h-8 text-green-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-2xl font-bold text-green-600 mb-1">7h 32m</div>
                    <p className="text-sm text-green-600 font-medium">Sleep Last Night</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-6 text-center">
                    <svg className="w-8 h-8 text-purple-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <div className="text-2xl font-bold text-purple-600 mb-1">324</div>
                    <p className="text-sm text-purple-600 font-medium">Calories Burned</p>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'Profile' ? (
            <div>
              <div className="flex items-center mb-6">
                <svg className="w-6 h-6 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Personal Profile</h1>
                  <p className="text-gray-600 text-sm">Manage your personal information and health details</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mr-4 overflow-hidden">
                    {profilePhoto ? (
                      <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-600 font-semibold text-lg">DU</span>
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      id="photo-upload"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Change Photo
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input type="text" value="Demo User" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input type="email" value="demo@example.com" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input type="tel" value="+91 98765 43210" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                    <input type="date" value="1985-06-15" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                      <option value="o+">O+</option>
                      <option value="o-">O-</option>
                      <option value="a+">A+</option>
                      <option value="a-">A-</option>
                      <option value="b+">B+</option>
                      <option value="b-">B-</option>
                      <option value="ab+">AB+</option>
                      <option value="ab-">AB-</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
                    <input type="text" value="175 cm" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
                    <input type="text" value="70 kg" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input type="text" value="Mumbai, Maharashtra" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
                  <input type="tel" value="+91 98765 43211" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Known Allergies</h3>
                  <input type="text" value="None known" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Medications</h3>
                <div className="space-y-3">
                  {medications.map((medication, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{medication.name}</h4>
                        <p className="text-sm text-gray-600">{medication.dosage}</p>
                      </div>
                      <button onClick={() => removeMedication(index)} className="text-red-600 hover:text-red-700 p-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  
                  {showAddMedication ? (
                    <div className="p-3 border border-gray-300 rounded-lg">
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Medication name"
                          value={newMedication.name}
                          onChange={(e) => setNewMedication({...newMedication, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                        <input
                          type="text"
                          placeholder="Dosage instructions"
                          value={newMedication.dosage}
                          onChange={(e) => setNewMedication({...newMedication, dosage: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={addMedication}
                            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            Add
                          </button>
                          <button
                            onClick={() => {setShowAddMedication(false); setNewMedication({name: '', dosage: ''});}}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowAddMedication(true)}
                      className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-teal-300 hover:text-teal-600 transition-colors"
                    >
                      <svg className="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Medication
                    </button>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <button 
                  onClick={() => updateProfile({
                    name: user?.name || 'Demo User',
                    email: user?.email || 'demo@example.com',
                    phone: user?.phone || '+91 98765 43210',
                    medications: medications
                  })}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : activeTab === 'Settings' ? (
            <div>
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <svg className="w-6 h-6 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <h1 className="text-2xl font-bold text-gray-900">Application Settings</h1>
                </div>
                <p className="text-gray-600">Customize your app experience and preferences</p>
              </div>

              {/* Dark Mode */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Dark Mode</h3>
                    <p className="text-gray-600 text-sm">Switch to dark theme</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={settings.darkMode}
                      onChange={() => handleSettingToggle('darkMode')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                  </label>
                </div>
              </div>

              {/* Push Notifications */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Push Notifications</h3>
                    <p className="text-gray-600 text-sm">Receive appointment and medication reminders</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={settings.pushNotifications}
                      onChange={() => handleSettingToggle('pushNotifications')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                  </label>
                </div>
              </div>

              {/* Data Sharing */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Data Sharing</h3>
                    <p className="text-gray-600 text-sm">Share anonymized health data for research</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={settings.dataSharing}
                      onChange={() => handleSettingToggle('dataSharing')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                  </label>
                </div>
              </div>

              {/* Language Preference */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Language Preference</h3>
                  <div className="mt-4">
                    <select 
                      className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
                      value={settings.language}
                      onChange={(e) => handleLanguageChange(e.target.value)}
                    >
                      <option value="en">🇺🇸 English</option>
                      <option value="hi">🇮🇳 Hindi</option>
                      <option value="es">🇪🇸 Spanish</option>
                      <option value="fr">🇫🇷 French</option>
                      <option value="de">🇩🇪 German</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Privacy & Security Section */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Privacy & Security</h2>
                
                {/* Privacy Settings */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 mb-4">
                  <button className="w-full flex items-center justify-between text-left hover:bg-gray-50 transition-colors rounded-lg p-2">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Privacy Settings</h3>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Download My Data */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 mb-4">
                  <button className="w-full flex items-center justify-between text-left hover:bg-gray-50 transition-colors rounded-lg p-2">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Download My Data</h3>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Delete Account */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 mb-4">
                  <button className="w-full flex items-center justify-between text-left hover:bg-red-50 transition-colors rounded-lg p-2 group">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-red-200 transition-colors">
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-red-600 group-hover:text-red-700">Delete Account</h3>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-red-400 group-hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Support Section */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Support</h2>
                
                {/* Help Center */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 mb-4">
                  <button className="w-full flex items-center justify-between text-left hover:bg-gray-50 transition-colors rounded-lg p-2">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Help Center</h3>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Contact Support */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 mb-4">
                  <button className="w-full flex items-center justify-between text-left hover:bg-gray-50 transition-colors rounded-lg p-2">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Contact Support</h3>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Rate App */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 mb-4">
                  <button className="w-full flex items-center justify-between text-left hover:bg-gray-50 transition-colors rounded-lg p-2">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Rate App</h3>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{activeTab}</h2>
              <p className="text-gray-600">This section is coming soon...</p>
            </div>
          )}
        </main>
      </div>
    </>
  )
}