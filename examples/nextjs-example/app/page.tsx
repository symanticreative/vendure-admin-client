'use client'

import { useState } from 'react';
import LoginForm from '../components/LoginForm';
import Dashboard from '../components/Dashboard';

/**
 * Main page component
 */
export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <main className="container">
      {!isLoggedIn ? (
        <LoginForm onLogin={() => setIsLoggedIn(true)} />
      ) : (
        <Dashboard />
      )}
    </main>
  );
}
