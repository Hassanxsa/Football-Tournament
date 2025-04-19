import React from 'react';
import Header from './components/Header';
import FeaturesSection from './components/FeaturesSection';

function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8">
          <FeaturesSection />
        </div>
      </div>
    </div>
  );
}

export default Home;