import { Heart, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/router'

export default function CallToAction() {
  const router = useRouter()
  
  const handleStartHealing = () => {
    router.push('/login')
  }

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20"></div>
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Heart className="w-8 h-8 text-white animate-pulse" />
          </div>
        </div>
        
        <h2 className="text-3xl lg:text-5xl font-bold mb-6">
          Begin Your Panchakarma Journey
        </h2>
        
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Join thousands who have experienced profound healing through traditional 
          Panchakarma therapies. Start your personalized detoxification and 
          rejuvenation journey today.
        </p>
        
        <button
          onClick={handleStartHealing}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-10 py-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center space-x-3 mx-auto group text-lg font-semibold"
        >
          <span>Start Your Healing</span>
          <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform duration-200" />
        </button>
        
        <p className="text-gray-400 text-sm mt-6">
          ✓ Free consultation   ✓ Personalized treatment plan   ✓ Expert guidance
        </p>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-green-500 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500 rounded-full animate-bounce"></div>
      </div>
    </section>
  )
}