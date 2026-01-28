'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface BackButtonProps {
  href?: string; // Optional href for Link-based back button
  onClick?: () => void; // Optional onClick handler for custom back behavior
  className?: string; // Optional additional classes
  label?: string; // Optional custom label
}

const BackButton: React.FC<BackButtonProps> = ({
  href = '/',
  onClick,
  className = '',
  label = 'Back'
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <div className={`mb-6 ${className}`}>
      <button
        onClick={handleClick}
        className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        {label}
      </button>
    </div>
  );
};

export default BackButton;