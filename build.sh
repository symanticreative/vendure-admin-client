#!/bin/bash
set -e

echo "🔧 Setting up vendure-admin-client package..."

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
npm install

# Step 2: Clean any existing build
echo "🧹 Cleaning build directory..."
rm -rf dist

# Step 3: Build the package
echo "🏗️ Building package..."
npm run build

# Step 4: Verify the build
echo "🔍 Verifying build..."
if [ -d "dist" ] && [ -f "dist/index.js" ]; then
  echo "✅ Build successful - output files exist in dist/"
else
  echo "❌ Build failed - dist/index.js not found"
  exit 1
fi

echo "📝 Creating simple example client..."
cat > example-client.js << EOF
const { VendureAdminClientFactory } = require('./dist');

// Create a client instance
const client = VendureAdminClientFactory.createClient({
  apiUrl: 'https://api.shopeazy.co/admin-api',
});

console.log('Created VendureAdminClient instance successfully');
console.log(client);
EOF

echo "🧪 Testing the build..."
node example-client.js

echo "🎉 Build process complete!"
