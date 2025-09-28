import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useRouter } from 'next/router'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  const handleNavClick = (section) => {
    if (section === 'get-started') {
      router.push('/login')
    } else if (section === 'education') {
      router.push('/education')
    } else if (section === 'doctors') {
      router.push('/dashboard')
    } else {
      console.log(`Navigating to: ${section}`)
    }
    setIsMenuOpen(false)
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2 cursor-pointer hover:scale-105 transition-transform duration-200">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">PanchVeda</span>
          </div>

          <nav className="hidden md:flex space-x-8">
            {['Panchakarma', 'Education', 'Doctors'].map((item) => (
              <button
                key={item}
                onClick={() => handleNavClick(item.toLowerCase())}
                className="text-gray-700 hover:text-green-600 transition-colors duration-200 hover:scale-105"
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="hidden md:block">
            <button
              onClick={() => handleNavClick('get-started')}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              Get Started
            </button>
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t animate-fade-in">
            <nav className="flex flex-col space-y-4">
              {['Panchakarma', 'Education', 'Doctors'].map((item) => (
                <button
                  key={item}
                  onClick={() => handleNavClick(item.toLowerCase())}
                  className="text-gray-700 hover:text-green-600 transition-colors duration-200 text-left"
                >
                  {item}
                </button>
              ))}
              <button
                onClick={() => handleNavClick('get-started')}
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-all duration-200 w-fit"
              >
                Get Started
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}