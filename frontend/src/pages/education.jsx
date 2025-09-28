import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import axios from 'axios'
import { useDarkMode } from '@/contexts/DarkModeContext'

const API_BASE = 'http://localhost:5000/api'

export default function Education() {
  const { isDarkMode } = useDarkMode()
  const [activeQuiz, setActiveQuiz] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [videos, setVideos] = useState([
    {
      id: 1,
      title: 'Introduction to Panchakarma',
      description: 'Learn the fundamentals of Panchakarma therapy',
      duration: '10:30',
      thumbnail: 'orange',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      id: 2,
      title: 'Abhyanga - Ayurvedic Oil Massage',
      description: 'Complete guide to traditional oil massage techniques',
      duration: '15:45',
      thumbnail: 'green',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      id: 3,
      title: 'Shirodhara - Oil Pouring Therapy',
      description: 'Understanding the benefits of Shirodhara treatment',
      duration: '12:20',
      thumbnail: 'yellow',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      id: 4,
      title: 'Nasya - Nasal Cleansing Therapy',
      description: 'Learn about nasal administration in Panchakarma',
      duration: '8:15',
      thumbnail: 'blue',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      id: 5,
      title: 'Basti - Medicated Enema Therapy',
      description: 'Understanding the king of Panchakarma treatments',
      duration: '18:30',
      thumbnail: 'purple',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      id: 6,
      title: 'Virechana - Purgation Therapy',
      description: 'Complete guide to therapeutic purgation',
      duration: '14:10',
      thumbnail: 'red',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    }
  ])
  const [selectedVideo, setSelectedVideo] = useState(null)

  const quizzes = {
    basics: {
      title: 'Ayurveda Basics',
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
        }
      ]
    },
    herbs: {
      title: 'Ayurvedic Herbs',
      questions: [
        {
          question: "Which herb is known as the 'King of Herbs' in Ayurveda?",
          options: ["Turmeric", "Ashwagandha", "Brahmi", "Triphala"],
          correct: 1
        }
      ]
    }
  }

  const startQuiz = (quizType) => {
    setActiveQuiz(quizType)
    setCurrentQuestion(0)
    setAnswers([])
    setQuizCompleted(false)
  }

  const handleAnswer = (answerIndex) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answerIndex
    setAnswers(newAnswers)

    if (currentQuestion < quizzes[activeQuiz].questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setQuizCompleted(true)
    }
  }

  const calculateScore = () => {
    let correct = 0
    answers.forEach((answer, index) => {
      if (answer === quizzes[activeQuiz].questions[index].correct) correct++
    })
    return correct
  }

  const resetQuiz = () => {
    setActiveQuiz(null)
    setCurrentQuestion(0)
    setAnswers([])
    setQuizCompleted(false)
  }

  const loadVideos = async () => {
    try {
      const response = await axios.get(`${API_BASE}/videos/panchakarma`)
      if (response.data && Array.isArray(response.data)) {
        setVideos(response.data)
      }
    } catch (error) {
      console.log('Using default videos')
    }
  }

  const playVideo = (video) => {
    setSelectedVideo(video)
  }

  useEffect(() => {
    loadVideos()
  }, [])

  return (
    <>
      <Head>
        <title>Education - PanchVeda</title>
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
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Education Center</h1>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          <div className="max-w-4xl mx-auto">
            {!activeQuiz ? (
              <>
                {/* Panchakarma Videos */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Panchakarma Educational Videos</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {videos.map((video) => {
                      const gradientColors = {
                        orange: 'from-orange-200 to-orange-400',
                        green: 'from-green-200 to-green-400',
                        yellow: 'from-yellow-200 to-yellow-400',
                        blue: 'from-blue-200 to-blue-400',
                        purple: 'from-purple-200 to-purple-400',
                        red: 'from-red-200 to-red-400'
                      }
                      return (
                        <div key={video.id} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                          <div className={`relative bg-gradient-to-br ${gradientColors[video.thumbnail]} h-48 flex items-center justify-center`}>
                            <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                              {video.duration}
                            </div>
                            <button 
                              onClick={() => playVideo(video)}
                              className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all hover:scale-110"
                            >
                              <svg className="w-8 h-8 text-gray-700 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                            </button>
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{video.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{video.description}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Interactive Quizzes */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Interactive Quizzes</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-pink-500 dark:text-pink-300" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z"/>
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Ayurveda Basics</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">Test your knowledge of fundamental Ayurvedic principles</p>
                      <button 
                        onClick={() => startQuiz('basics')}
                        className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                      >
                        Start Quiz
                      </button>
                    </div>

                    <div className="text-center">
                      <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-green-500 dark:text-green-300" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/>
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Ayurvedic Herbs</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">Learn about common Ayurvedic herbs and their properties</p>
                      <button 
                        onClick={() => startQuiz('herbs')}
                        className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                      >
                        Start Quiz
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : !quizCompleted ? (
              // Quiz Question
              <div>
                <div className="mb-8">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{quizzes[activeQuiz].title}</h1>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-teal-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${((currentQuestion + 1) / quizzes[activeQuiz].questions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    {quizzes[activeQuiz].questions[currentQuestion].question}
                  </h2>
                  
                  <div className="space-y-4">
                    {quizzes[activeQuiz].questions[currentQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswer(index)}
                        className="w-full text-left p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-teal-300 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors text-gray-900 dark:text-white"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              // Quiz Results
              <div>
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Quiz Completed!</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    You scored {calculateScore()} out of {quizzes[activeQuiz].questions.length}
                  </p>
                </div>

                <div className="text-center space-x-4">
                  <button
                    onClick={resetQuiz}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Back to Education
                  </button>
                  <button
                    onClick={() => startQuiz(activeQuiz)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Retake Quiz
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
        
        {/* Video Player Modal */}
        {selectedVideo && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedVideo.title}</h3>
                <button 
                  onClick={() => setSelectedVideo(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 rounded-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="aspect-video mb-4">
                <iframe 
                  src={selectedVideo.url}
                  className="w-full h-full rounded-lg"
                  title={selectedVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              
              <div className="text-gray-600 dark:text-gray-400">
                <p className="mb-2"><strong>Duration:</strong> {selectedVideo.duration}</p>
                <p>{selectedVideo.description}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}