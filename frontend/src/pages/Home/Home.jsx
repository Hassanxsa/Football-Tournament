import React from 'react';
import Header from './components/Header';
import TournamentsSection from './components/TournamentsSection';

function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8">
            <TournamentsSection />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;