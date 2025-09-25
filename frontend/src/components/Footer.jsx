import { Heart } from 'lucide-react'

export default function Footer() {
  const footerLinks = {
    therapies: ['Vamana', 'Virechana', 'Basti', 'Nasya', 'Raktamokshana'],
    learn: ['Dosha Quiz', 'Panchakarma Guide', 'Ayurveda Basics', 'Herbs & Remedies'],
    support: ['Help Center', 'Contact Vaidyas', 'Privacy Policy', 'Terms of Service']
  }

  const handleLinkClick = (link) => {
    console.log(`Navigating to: ${link}`)
  }

  return (
    <footer className="bg-gray-900 text-gray-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-xl font-semibold text-white">PanchVeda</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              India's premier digital Panchakarma platform for holistic healing.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Therapies</h4>
            <ul className="space-y-2">
              {footerLinks.therapies.map((link) => (
                <li key={link}>
                  <button
                    onClick={() => handleLinkClick(link)}
                    className="text-gray-400 hover:text-green-400 transition-colors duration-200 text-sm"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Learn</h4>
            <ul className="space-y-2">
              {footerLinks.learn.map((link) => (
                <li key={link}>
                  <button
                    onClick={() => handleLinkClick(link)}
                    className="text-gray-400 hover:text-green-400 transition-colors duration-200 text-sm"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link}>
                  <button
                    onClick={() => handleLinkClick(link)}
                    className="text-gray-400 hover:text-green-400 transition-colors duration-200 text-sm"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 PanchVeda. Bringing ancient Panchakarma wisdom to modern life.
          </p>
          <div className="flex items-center space-x-1 text-gray-400 text-sm mt-4 md:mt-0">
            <span>Made with</span>
            <Heart size={16} className="text-green-500 animate-pulse" />
            <span>for healing</span>
          </div>
        </div>
      </div>
    </footer>
  )
}