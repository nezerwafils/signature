import React from 'react';

const VentlyLogo = ({ size = 40, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background circle with gradient */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
      </defs>
      
      {/* Main circle */}
      <circle cx="50" cy="50" r="48" fill="url(#logoGradient)" />
      
      {/* Sound wave design */}
      <path
        d="M 30 50 L 30 40 M 38 50 L 38 30 M 46 50 L 46 25 M 54 50 L 54 20 M 62 50 L 62 25 M 70 50 L 70 30"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
      />
      
      {/* Stylized "V" overlay */}
      <path
        d="M 35 35 L 50 65 L 65 35"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.6"
      />
    </svg>
  );
};

export default VentlyLogo;
