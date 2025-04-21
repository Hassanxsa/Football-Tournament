import React from 'react';
import FeatureCard from './FeatureCard';

const FeaturesSection = () => {
  const features = [
    {
      title: 'Tournament Management',
      description: 'Create and manage tournaments with ease. Set up schedules, track scores, and manage team registrations all in one place.',
      icon: '🏆'
    },
    {
      title: 'Real-time Updates',
      description: 'Stay up to date with live match scores, standings, and tournament progress.',
      icon: '⚡'
    },
    {
      title: 'Team Registration',
      description: 'Register your team for upcoming tournaments. Manage team members and view tournament eligibility.',
      icon: '👥'
    }
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-center mb-8">Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;
