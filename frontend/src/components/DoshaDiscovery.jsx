import { Zap, Flame, Droplet, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/router'

export default function DoshaDiscovery() {
  const doshas = [
    {
      icon: Zap,
      name: 'Vata',
      subtitle: 'Air & Space',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500'
    },
    {
      icon: Flame,
      name: 'Pitta',
      subtitle: 'Fire & Water',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500'
    },
    {
      icon: Droplet,
      name: 'Kapha',
      subtitle: 'Earth & Water',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500'
    }
  ]

  const features = [
    'Discover your unique Prakruti constitution',
    'Get personalized diet recommendations',
    'Understand your body\'s natural tendencies',
    'Receive custom yoga and meditation practices'
  ]

  const router = useRouter()

  const handleTakeQuiz = () => {
    router.push('/dashboard?tab=Dosha&startQuiz=true')
  }

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-green-500 to-green-600 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <div className="flex items-center space-x-2 text-green-200 mb-4">
                <Zap size={20} />
                <span className="text-sm font-medium">AI Prakriti Assessment</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Discover Your Dosha with AI
              </h2>
              <p className="text-lg text-green-100 mb-8">
                Take our intelligent quiz powered by ancient Ayurvedic wisdom and modern AI to 
                understand your unique constitution and get personalized recommendations.
              </p>
            </div>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3 group">
                  <div className="w-2 h-2 bg-green-200 rounded-full group-hover:scale-150 transition-transform duration-200"></div>
                  <span className="text-green-100 group-hover:text-white transition-colors duration-200">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={handleTakeQuiz}
              className="bg-white text-green-600 px-8 py-3 rounded-lg hover:bg-green-50 transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center space-x-2 group font-semibold"
            >
              <span>Take Dosha Quiz</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {doshas.map((dosha, index) => {
              const Icon = dosha.icon
              return (
                <div
                  key={index}
                  className="text-center group cursor-pointer"
                >
                  <div className={`w-20 h-20 ${dosha.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-1 group-hover:scale-105 transition-transform duration-200">
                    {dosha.name}
                  </h3>
                  <p className="text-green-200 text-sm group-hover:text-white transition-colors duration-200">
                    {dosha.subtitle}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-20 h-20 bg-white/5 rounded-full animate-bounce"></div>
    </section>
  )
}