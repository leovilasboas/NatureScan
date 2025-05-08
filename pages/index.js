import { useState } from 'react';
import { useMutation } from 'react-query';
import Head from 'next/head';
import Link from 'next/link';
import ImageUploader from '../components/ImageUploader';
import CameraCapture from '../components/CameraCapture';
import ResultDisplay from '../components/ResultDisplay';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [activeTab, setActiveTab] = useState('upload');
  const [image, setImage] = useState(null);
  const [results, setResults] = useState(null);

  const identifyMutation = useMutation(async (imageData) => {
    const response = await fetch('/api/identify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: imageData }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to identify the image');
    }

    return response.json();
  }, {
    onSuccess: (data) => {
      setResults(data);
    },
  });

  const handleImageSelect = (imageData) => {
    console.log("Image selected:", imageData ? `${imageData.substring(0, 30)}... (length: ${imageData.length})` : "null");
    setImage(imageData);
    setResults(null);
  };

  const handleIdentify = () => {
    if (image) {
      console.log("Sending image for identification, length:", image.length);
      identifyMutation.mutate(image);
    } else {
      console.error("No image to identify");
      alert("Por favor, selecione uma imagem primeiro.");
    }
  };

  return (
    <div className="min-h-screen">
      <Head>
        <title>NatureID - Plant & Animal Identification</title>
        <meta name="description" content="Identify plants and animals with AI" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>

      {/* Scrolling marquee like worklouder.cc */}
      <div className="overflow-hidden bg-white/5 backdrop-blur-sm border-b border-white/10 py-2 text-sm mb-8">
        <div className="flex whitespace-nowrap animate-marquee">
          <span className="mx-4">🌿 Know Plants⚡</span>
          <span className="mx-4">🦁 Identify Animals ⚙️</span>
          <span className="mx-4">🌎 Nature Conservation ❤️‍🔥</span>
          <span className="mx-4">🔍 Visual Recognition 🎨</span>
          <span className="mx-4">🌿 Know Plants⚡</span>
          <span className="mx-4">🦁 Identify Animals ⚙️</span>
          <span className="mx-4">🌎 Nature Conservation ❤️‍🔥</span>
          <span className="mx-4">🔍 Visual Recognition 🎨</span>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-7xl font-black mb-8 text-white" style={{ 
            letterSpacing: '-0.03em', 
            textShadow: '0 4px 30px rgba(0, 0, 0, 0.5)'
          }}>
            Nature Identification
          </h1>
          <p className="text-2xl font-medium text-white/90 mb-12 max-w-3xl mx-auto">
            Our tools make nature exploration feel like an adventure, 
            helping you identify plants and animals instantly.
          </p>
        </div>

        {/* Main Content */}
        {!results ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            {/* Upload Card */}
            <div className="bg-white/5 backdrop-blur-md p-10 rounded-3xl border border-white/10 hover:border-white/20 transition-all">
              <h2 className="text-3xl font-bold mb-8 text-white">
                Upload a Photo
              </h2>
              <div className="mb-8">
                <ImageUploader onImageSelect={handleImageSelect} />
              </div>
              {image && activeTab === 'upload' && (
                <button
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg transform transition-all hover:scale-[1.02] active:scale-[0.98]"
                  onClick={handleIdentify}
                  disabled={identifyMutation.isLoading}
                >
                  {identifyMutation.isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing Image...
                    </span>
                  ) : "Identify Now"}
                </button>
              )}
            </div>
            
            {/* Camera Card */}
            <div className="bg-white/5 backdrop-blur-md p-10 rounded-3xl border border-white/10 hover:border-white/20 transition-all">
              <h2 className="text-3xl font-bold mb-8 text-white">
                Take a Photo
              </h2>
              <div className="mb-8">
                <CameraCapture onImageCapture={handleImageSelect} />
              </div>
              {image && activeTab === 'camera' && (
                <button
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg transform transition-all hover:scale-[1.02] active:scale-[0.98]"
                  onClick={handleIdentify}
                  disabled={identifyMutation.isLoading}
                >
                  {identifyMutation.isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing Image...
                    </span>
                  ) : "Identify Now"}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-md p-10 rounded-3xl border border-white/10 mb-20">
            <ResultDisplay results={results} onReset={() => {
              setImage(null);
              setResults(null);
            }} />
          </div>
        )}

        {identifyMutation.isError && (
          <div className="p-6 mb-10 bg-red-900/50 text-white rounded-xl border border-red-500/50">
            <p className="font-semibold text-xl mb-2">Error:</p>
            <p>{identifyMutation.error.message}</p>
          </div>
        )}

        {/* Features Section */}
        <div className="mb-24">
          <h2 className="text-5xl font-black mb-12 text-center text-white" style={{ letterSpacing: '-0.03em' }}>
            Our Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 hover:border-white/20 transition-all transform hover:scale-[1.03] hover:-translate-y-2">
              <h3 className="text-2xl font-bold mb-4 text-white">Plants</h3>
              <p className="text-white/80">Identify thousands of plant species with our advanced AI image recognition technology</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 hover:border-white/20 transition-all transform hover:scale-[1.03] hover:-translate-y-2">
              <h3 className="text-2xl font-bold mb-4 text-white">Animals</h3>
              <p className="text-white/80">Recognize wild animals from your photos with high accuracy and detailed information</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 hover:border-white/20 transition-all transform hover:scale-[1.03] hover:-translate-y-2">
              <h3 className="text-2xl font-bold mb-4 text-white">Premium</h3>
              <p className="text-white/80">Get detailed information about species, habitat, and conservation status</p>
            </div>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="text-center mb-20">
          <h2 className="text-3xl font-bold mb-6 text-white">Ready to explore nature?</h2>
          <p className="text-xl text-white/80 mb-8">Start identifying plants and animals around you today.</p>
          <Link href="#top" className="inline-block bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-4 px-10 rounded-xl text-xl shadow-lg transform transition-all hover:scale-[1.05] active:scale-[0.98]">
            Get Started
          </Link>
        </div>
      </div>

      <footer className="border-t border-white/10 py-6 mt-12">
        <div className="container mx-auto px-4">
          <p className="text-center text-white/50 text-sm">
            © 2025 Nature Identification App - All rights reserved
          </p>
        </div>
      </footer>
    </div>
  );
}
