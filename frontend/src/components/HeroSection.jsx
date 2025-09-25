import { Play, ArrowRight, Leaf } from 'lucide-react'
import { useRouter } from 'next/router'

export default function HeroSection() {
  const router = useRouter()
  
  const handleJourneyStart = () => {
    router.push('/login')
  }

  const handleVideoPlay = () => {
    console.log('Playing Panchakarma Video')
  }

  return (
    <section className="bg-gradient-to-br from-green-50 to-green-100 py-16 lg:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in-up">
            <div className="flex items-center space-x-2 text-green-600">
              <Leaf size={20} />
              <span className="text-sm font-medium">Ancient Panchakarma, Modern Technology</span>
            </div>
            
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-4">
                Transform Your Health with{' '}
                <span className="text-green-600">Panchakarma Healing</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-md">
                Experience the profound healing power of Panchakarma - the ancient five-fold 
                detoxification system. Connect with expert Vaidyas, discover your dosha, and 
                embark on a personalized wellness journey.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleJourneyStart}
                className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2 group"
              >
                <span>Start Panchakarma Journey</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              
              <button
                onClick={handleVideoPlay}
                className="border border-green-500 text-green-600 px-8 py-3 rounded-lg hover:bg-green-500 hover:text-white transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 group"
              >
                <Play size={20} className="group-hover:scale-110 transition-transform duration-200" />
                <span>Watch Panchakarma Video</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <img 
                    src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                    alt="Ayurvedic herbs" 
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform translate-y-4">
                  <img 
                    src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                    alt="Meditation" 
                    className="w-full h-32 object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 transform translate-y-8">
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <img 
                    src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                    alt="Ayurvedic treatment" 
                    className="w-full h-40 object-cover"
                  />
                </div>
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <img 
                    src="https://images.unsplash.com/photo-1545558014-8692077e9b5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                    alt="Natural healing" 
                    className="w-full h-36 object-cover"
                  />
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-green-200 rounded-full opacity-60 animate-bounce"></div>
            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-green-300 rounded-full opacity-40 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  )
}