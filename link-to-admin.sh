#!/bin/bash
set -e

ADMIN_DIR="/Users/symanticreative/shopeazy-final/admin"
THIS_DIR="/Users/symanticreative/shopeazy-final/vendure-admin-client"

echo "🔗 Linking vendure-admin-client to the admin project..."

# Make sure our package is built
echo "🏗️ Building package first..."
cd "$THIS_DIR"
if [ ! -d "node_modules" ]; then
  npm install
fi
npm run build

# Link the package
echo "🔗 Creating npm link..."
npm link

# Go to admin project and link
echo "🔗 Linking to admin project..."
cd "$ADMIN_DIR"
echo "Using --legacy-peer-deps to avoid React version conflicts..."
npm link @symanticreative/vendure-admin-client --legacy-peer-deps

echo "✅ Linking complete! The admin project now uses your local vendure-admin-client package."
echo ""
echo "To test, run 'npm run dev' in the admin project."
echo ""
echo "🚫 If you get a 'Module not found' error, try these steps:"
echo "1. Make sure both projects use compatible import/export styles"
echo "2. Check that all import paths are correct"
echo "3. In admin project, try direct local installation:"
echo "   - npm uninstall @symanticreative/vendure-admin-client"
echo "   - npm install --save /Users/symanticreative/shopeazy-final/vendure-admin-client --legacy-peer-deps"
echo ""
echo "🔄 If you're still having React peer dependency issues:"
echo "1. Edit vendure-admin-client/package.json to update React peer dependency:"
echo "   \"peerDependencies\": { \"react\": \">=17.0.0 || ^19.0.0\" }"
echo "2. Then run the build.sh and link-to-admin.sh scripts again"
