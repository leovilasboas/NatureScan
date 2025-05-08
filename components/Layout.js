import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Layout({ children }) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => router.pathname === path;

  const navigationItems = [
    { path: '/', label: 'Identify', icon: '/icons/camera.svg' },
    { path: '/history', label: 'History', icon: '/icons/history.svg' },
    { path: '/premium', label: 'Premium', icon: '/icons/premium.svg' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#635bff" />
      </Head>
      
      <header className="fixed w-full z-50 glassmorphic border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link href="/">
              <span className="text-3xl font-bold gradient-text tracking-tight">NatureID</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <span className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive(item.path)
                      ? 'bg-white/10 text-spring-green'
                      : 'text-white/80 hover:text-spring-green hover:bg-white/5'
                  }`}>
                    <img src={item.icon} alt="" className="w-5 h-5 mr-2" />
                    {item.label}
                  </span>
                </Link>
              ))}
            </nav>

            <button
              className="md:hidden text-white/80 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open menu</span>
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-black/95 border-t border-white/10">
            <div className="px-4 py-2 space-y-1">
              {navigationItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <span
                    className={`flex items-center px-4 py-3 rounded-lg transition-all duration-300 ${
                      isActive(item.path)
                        ? 'bg-white/10 text-spring-green'
                        : 'text-white/80 hover:text-spring-green hover:bg-white/5'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <img src={item.icon} alt="" className="w-5 h-5 mr-3" />
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow pt-20">
        {children}
      </main>

      <footer className="py-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center text-white/60 text-sm">
            © {new Date().getFullYear()} NatureID. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}