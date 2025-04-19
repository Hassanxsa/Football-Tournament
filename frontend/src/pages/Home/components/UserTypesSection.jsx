import React from 'react';
import UserTypeCard from './UserTypeCard';

const UserTypesSection = () => {
  const userTypes = [
    {
      title: 'Tournament Admin',
      features: [
        'Manage tournaments and teams',
        'Select team captains',
        'Approve player registrations'
      ],
      buttonText: 'Access Admin Panel',
      buttonLink: '/admin/tournaments',
      colorClass: 'text-blue-500'
    },
    {
      title: 'Guest Access',
      features: [
        'View tournament match results',
        'Check top scorers',
        'Browse team information'
      ],
      buttonText: 'Browse as Guest',
      buttonLink: '/guest/results/1',
      colorClass: 'text-green-500'
    }
  ];

  return (
    <div className="grid md:grid-cols-2 gap-8 mb-16">
      {userTypes.map((userType, index) => (
        <UserTypeCard key={index} {...userType} />
      ))}
    </div>
  );
};

export default UserTypesSection;
