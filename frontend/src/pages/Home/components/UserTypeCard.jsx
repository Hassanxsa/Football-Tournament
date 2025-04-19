import React from 'react';
import { Link } from 'react-router-dom';

const UserTypeCard = ({ title, features, buttonText, buttonLink, colorClass }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <h2 className={`text-2xl font-bold ${colorClass} mb-4`}>{title}</h2>
      <ul className="space-y-3 text-slate-600 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      <Link to={buttonLink}>
        <button className={`w-full py-3 ${colorClass.replace('text-', 'bg-')} hover:${colorClass.replace('text-', 'bg-').replace('500', '600')} text-white font-semibold rounded-lg shadow-md transition-colors duration-200`}>
          {buttonText}
        </button>
      </Link>
    </div>
  );
};

export default UserTypeCard;
