/**
 * This file demonstrates how to initialize the client in a Next.js application.
 * This would typically be imported in your main layout or a middleware.
 */

import { getVendureClient } from './vendure-client';

/**
 * Initialize the API client on the server side
 * Call this function in your Next.js app's entry point
 */
export function initializeApp() {
  // Only run on the server side
  if (typeof window === 'undefined') {
    console.log('Initializing Vendure Admin Client...');
    
    try {
      // Initialize the singleton client
      getVendureClient();
      console.log('Vendure Admin Client initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Vendure Admin Client:', error);
    }
  }
}

/**
 * Example usage in a Next.js app entry point (app/layout.tsx):
 *
 * import { initializeApp } from '@/lib/app-initializer';
 * 
 * // Initialize the client
 * initializeApp();
 * 
 * export default function RootLayout({ children }: { children: React.ReactNode }) {
 *   return (
 *     <html lang="en">
 *       <body>{children}</body>
 *     </html>
 *   );
 * }
 */
