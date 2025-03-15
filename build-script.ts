/**
 * This script just adds a more detailed entry point for debugging
 */
// Make sure TypeScript compiles this file first
console.log('Starting build process...');

// Run the TypeScript compiler
require('child_process').execSync('npx tsc', { stdio: 'inherit' });

console.log('Build completed!');
