'use client';

import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>TODO App - Main Page</h1>
      <p>Welcome to the TODO application!</p>
      
      <div style={{ marginTop: '20px' }}>
        <h2>Available Routes:</h2>
        <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
          <li style={{ marginBottom: '10px' }}>
            <Link href="/signup" style={{ color: '#3b82f6', textDecoration: 'underline' }}>
              Sign Up Page
            </Link>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <Link href="/signin" style={{ color: '#3b82f6', textDecoration: 'underline' }}>
              Sign In Page
            </Link>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <Link href="/dashboard" style={{ color: '#3b82f6', textDecoration: 'underline' }}>
              Dashboard
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}