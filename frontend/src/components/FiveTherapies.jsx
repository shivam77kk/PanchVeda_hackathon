import { Droplet, Flame, Wind, Leaf, Heart } from 'lucide-react'

export default function FiveTherapies() {
  const therapies = [
    {
      icon: Droplet,
      name: 'Vamana',
      description: 'Therapeutic vomiting for Kapha disorders',
      details: 'Removes excess mucus, treats asthma, allergies',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Flame,
      name: 'Virechana',
      description: 'Purgation therapy for Pitta imbalances',
      details: 'Cleanses liver, treats skin disorders, hyperacidity',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50'
    },
    {
      icon: Wind,
      name: 'Basti',
      description: 'Medicated enemas for Vata conditions',
      details: 'Nourishes nervous system, treats arthritis, paralysis',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Leaf,
      name: 'Nasya',
      description: 'Nasal administration of medicines',
      details: 'Clears sinuses, improves mental clarity, headaches',
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      icon: Heart,
      name: 'Raktamokshana',
      description: 'Bloodletting for blood-related disorders',
      details: 'Purifies blood, treats skin diseases, hypertension',
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    }
  ]

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            The Five Sacred Therapies
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Panchakarma consists of five purification procedures that eliminate toxins, restore 
            balance, and rejuvenate the body naturally
          </p>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
          {therapies.map((therapy, index) => {
            const Icon = therapy.icon
            return (
              <div
                key={index}
                className={`${therapy.bgColor} rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group relative overflow-hidden`}
              >
                <div className="relative z-10">
                  <div className={`w-16 h-16 ${therapy.color} bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <Icon className={`w-8 h-8 ${therapy.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors duration-200">
                    {therapy.name}
                  </h3>
                  <p className="text-sm text-gray-700 mb-2 font-medium">
                    {therapy.description}
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {therapy.details}
                  </p>
                </div>
                
                {/* Hover overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}