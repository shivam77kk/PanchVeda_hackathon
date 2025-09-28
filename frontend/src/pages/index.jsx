import Head from 'next/head'
import Header from '../components/Header'
import HeroSection from '../components/HeroSection'
import WhyChoose from '../components/WhyChoose'
import FiveTherapies from '../components/FiveTherapies'
import DoshaDiscovery from '../components/DoshaDiscovery'
import CallToAction from '../components/CallToAction'
import Footer from '../components/Footer'
import { useDarkMode } from '@/contexts/DarkModeContext'

export default function Home() {
  const { isDarkMode } = useDarkMode()
  
  return (
    <>
      <Head>
        <title>PanchVeda - Transform Your Health with Panchakarma Healing</title>
        <meta name="description" content="Experience the profound healing power of Panchakarma - the ancient five-fold detoxification system." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className="bg-green-50 dark:bg-gray-900 min-h-screen">
        <Header />
        <HeroSection />
        <WhyChoose />
        <FiveTherapies />
        <DoshaDiscovery />
        <CallToAction />
        <Footer />
      </main>
    </>
  )
}
