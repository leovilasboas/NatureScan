import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const features = [
    {
      icon: "📸",
      title: "Snap",
      description: "Capture any organism with your camera"
    },
    {
      icon: "🔍",
      title: "Analyze",
      description: "AI matches your photo to millions of species"
    },
    {
      icon: "📚",
      title: "Learn",
      description: "Get detailed facts, habitat info & more"
    }
  ];

  const sampleSpecies = [
    {
      name: "Bird of Paradise",
      scientific: "Strelitzia reginae",
      confidence: 99.3,
      image: "https://images.pexels.com/photos/87452/flowers-background-butterflies-beautiful-87452.jpeg"
    },
    {
      name: "Monarch Butterfly",
      scientific: "Danaus plexippus",
      confidence: 98.7,
      image: "https://images.pexels.com/photos/672142/pexels-photo-672142.jpeg"
    },
    {
      name: "Red Fox",
      scientific: "Vulpes vulpes",
      confidence: 97.5,
      image: "https://images.pexels.com/photos/2295744/pexels-photo-2295744.jpeg"
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      <Head>
        <title>NatureID - AI-Powered Species Identification</title>
        <meta name="description" content="Instant AI identification of plants & animals—anywhere, anytime." />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      {/* Navbar */}
      <nav className="fixed w-full z-50 glassmorphic">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold gradient-text">NatureID</span>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#" className="text-white hover:text-spring-green px-3 py-2">Explore</a>
                <a href="#" className="text-white hover:text-spring-green px-3 py-2">How It Works</a>
                <a href="#" className="text-white hover:text-spring-green px-3 py-2">Try Now</a>
                <a href="#" className="text-white hover:text-spring-green px-3 py-2">About</a>
              </div>
            </div>
            
            <button className="bg-spring-green text-black px-6 py-2 rounded-full font-semibold hover:bg-lime-green transition-colors glow-hover">
              Identify a Species
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto text-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Discover the Wild World
            <br />
            at Your Fingertips
          </h1>
          <p className="text-xl md:text-2xl text-light-gray mb-12 max-w-3xl mx-auto">
            Instant AI identification of plants & animals—anywhere, anytime.
          </p>
          <button className="bg-lime-green text-white px-8 py-4 rounded-xl text-xl font-semibold hover:bg-spring-green transition-colors pulse">
            Try It Now
          </button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section ref={ref} className="py-20 px-4 bg-black/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="glassmorphic p-8 rounded-2xl glow-hover"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-light-gray">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Species Gallery */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-12">Recently Identified Species</h2>
          <div className="gallery-grid">
            {sampleSpecies.map((species, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="species-card glassmorphic"
              >
                <img src={species.image} alt={species.name} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 right-0 p-4 glassmorphic">
                  <h3 className="text-white font-bold">{species.name}</h3>
                  <p className="text-light-gray text-sm italic">{species.scientific}</p>
                  <div className="mt-2">
                    <div className="confidence-bar" style={{ width: `${species.confidence}%` }}></div>
                    <p className="text-xs text-spring-green mt-1">{species.confidence}% confidence</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-8">
              Identify. Learn. Connect with Nature 🌿
            </h2>
            <div className="max-w-md mx-auto mb-8">
              <input
                type="email"
                placeholder="Enter your email"
                className="newsletter-input mb-4"
              />
              <button className="w-full bg-lime-green text-white py-3 rounded-lg font-semibold hover:bg-spring-green transition-colors">
                Subscribe
              </button>
            </div>
            <div className="flex justify-center space-x-8 mb-8">
              <a href="#" className="text-light-gray hover:text-spring-green">Privacy</a>
              <a href="#" className="text-light-gray hover:text-spring-green">Terms</a>
              <a href="#" className="text-light-gray hover:text-spring-green">Contact</a>
            </div>
            <p className="text-light-gray">© 2025 NatureID. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}