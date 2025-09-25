import { Shield, Users, Brain, Lock } from 'lucide-react'

export default function WhyChoose() {
  const features = [
    {
      icon: Shield,
      title: 'Panchakarma Detoxification',
      description: 'Complete body purification through ancient five-stage cleansing protocols for deep healing',
      color: 'text-green-500'
    },
    {
      icon: Users,
      title: 'Expert Vaidyas',
      description: 'Certified Panchakarma specialists with generations of traditional knowledge and modern training',
      color: 'text-blue-500'
    },
    {
      icon: Brain,
      title: 'AI-Powered Dosha Analysis',
      description: 'Discover your unique constitution with our intelligent assessment and personalized treatment plans',
      color: 'text-purple-500'
    },
    {
      icon: Lock,
      title: 'Secure Healing Journey',
      description: 'Your health data protected while tracking progress through traditional therapies and modern monitoring',
      color: 'text-indigo-500'
    }
  ]

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Why Choose PanchVeda?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            India's first digital Panchakarma platform combining traditional healing with modern technology
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="text-center p-6 rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-gray-50 group cursor-pointer"
              >
                <div className="relative mb-6">
                  <div className={`w-16 h-16 ${feature.color} bg-opacity-10 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-green-600 transition-colors duration-200">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}