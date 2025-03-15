# Fixing the Vendure Admin Client Package

This document outlines the changes made to fix the package configuration and provides instructions for testing.

## Changes Made

1. **Fixed package.json**:
   - Removed `"type": "module"` to use CommonJS format
   - Changed export format from `"import"` to `"default"`
   - Added clean script to properly clean the dist directory

2. **Fixed tsconfig.json**:
   - Changed `"rootDir"` from `"."` to `"./src"` 
   - Updated include paths to only include source code
   - Created separate tsconfig.test.json for tests

3. **Added Helper Scripts**:
   - `build.sh` - Builds the package and verifies the output
   - `link-to-admin.sh` - Links the package to the admin project

## How to Test

1. First, make the scripts executable:
   ```bash
   bash fix-permissions.sh
   ```

2. Build the package:
   ```bash
   ./build.sh
   ```

3. Link to the admin project (uses --legacy-peer-deps to handle React version conflicts):
   ```bash
   ./link-to-admin.sh
   ```

4. Test in the admin project:
   ```bash
   cd /Users/symanticreative/shopeazy-final/admin
   npm run dev
   ```

## Alternative Installation Method

If npm link doesn't work, you can install directly from the local directory:

```bash
cd /Users/symanticreative/shopeazy-final/admin
npm uninstall @symanticreative/vendure-admin-client
npm install --save /Users/symanticreative/shopeazy-final/vendure-admin-client --legacy-peer-deps
```

## Handling Peer Dependency Issues

The admin project uses React 19, which can cause peer dependency conflicts with some packages. The updated scripts use `--legacy-peer-deps` to handle this, but if you encounter persistent issues:

1. Make sure the package.json peerDependencies includes React 19:
   ```json
   "peerDependencies": {
     "react": ">=17.0.0 || ^19.0.0"
   }
   ```

2. If specific packages are causing conflicts, you may need to update them in the admin project:
   ```bash
   cd /Users/symanticreative/shopeazy-final/admin
   npm update package-with-conflict --legacy-peer-deps
   ```

## Troubleshooting

If you still encounter "Module not found" errors:

1. Check that the package is properly built by looking for `dist/index.js`
2. Verify that the client module correctly imports `VendureAdminClientFactory` 
3. Try restarting the Next.js server with `npm run dev`
4. Clear Next.js cache by running `rm -rf .next` in the admin directory
