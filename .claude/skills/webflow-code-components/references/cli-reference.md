# Webflow CLI Reference

Complete reference for the Webflow CLI commands and options.

## Overview

The Webflow CLI is the command-line interface for importing React components into Webflow. Use it to:

- Bundle components into importable libraries
- Import libraries to your Webflow Workspace
- Test components locally
- Debug bundling issues

## Installation

```bash
npm i --save-dev @webflow/webflow-cli
```

Install locally to your project to use `npx` commands.

## Commands

### library share

Import your component library to Webflow.

```bash
npx webflow library share [options]
```

This command will:
1. Check for authentication (prompt if needed)
2. Bundle your components
3. Ask you to confirm components to share
4. Upload to your Workspace

#### Options

| Option | Description | Default |
|--------|-------------|---------|
| `--manifest <path>` | Path to `webflow.json` file | Scans current directory |
| `--api-token <token>` | Workspace API token | Uses `WEBFLOW_WORKSPACE_API_TOKEN` from `.env` |
| `--no-input` | Skip interactive prompts (for CI/CD) | Interactive mode |
| `--verbose` | Show detailed output for debugging | Normal output |
| `--dev` | Bundle in development mode (no minification) | Production mode |

#### Examples

**Basic import:**
```bash
npx webflow library share
```

**With custom manifest location:**
```bash
npx webflow library share --manifest ./config/webflow.json
```

**With specific API token:**
```bash
npx webflow library share --api-token wf_12345...
```

**CI/CD mode (no prompts):**
```bash
npx webflow library share --no-input
```

**Debug mode:**
```bash
npx webflow library share --verbose --dev
```

### library bundle

Bundle your library locally for testing and debugging.

```bash
npx webflow library bundle --public-path <url> [options]
```

This creates a `dist` folder with your bundled library that you can serve locally.

#### Options

| Option | Description | Required |
|--------|-------------|----------|
| `--public-path <url>` | URL where you'll serve the library | Yes |
| `--force` | Continue compiling even with warnings | No |
| `--dev` | Disable minification and enable source maps | No |
| `--debug-bundler` | Print final webpack configuration | No |

#### Examples

**Basic local bundle:**
```bash
npx webflow library bundle --public-path http://localhost:4000/
```

**Development bundle with debugging:**
```bash
npx webflow library bundle --public-path http://localhost:4000/ --dev --debug-bundler
```

**Force bundle despite warnings:**
```bash
npx webflow library bundle --public-path http://localhost:4000/ --force
```

### library log

Get debug information for your last library import.

```bash
npx webflow library log
```

Shows:
- Import status
- Warnings and errors
- Bundle size
- Component list

## Authentication

### Environment Variable

Add your Workspace API token to `.env`:

```bash
WEBFLOW_WORKSPACE_API_TOKEN=wf_12345...
```

**Security:** Always add `.env` to `.gitignore`.

### Interactive Authentication

If no token is found, the CLI will:
1. Open a browser window
2. Ask you to authorize the workspace
3. Save the token to `.env`

### Manual Authentication

Pass token directly via command:

```bash
npx webflow library share --api-token wf_12345...
```

### Getting Your Workspace API Token

1. Open your Webflow workspace
2. Navigate to **Apps & Integrations**
3. Click **Manage** in sidebar
4. Scroll to **Workspace API Access**
5. Click **Generate API Token**
6. Copy token

**Note:** You must be a Workspace Admin to generate tokens.

## CI/CD Integration

Use the CLI in automated workflows:

### Basic GitHub Actions Example

```yaml
name: Deploy Components

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Import to Webflow
        env:
          WEBFLOW_WORKSPACE_API_TOKEN: ${{ secrets.WEBFLOW_TOKEN }}
        run: npx webflow library share --no-input
```

### Change Detection

Implement change detection to avoid removing components unintentionally:

```yaml
- name: Check for changes
  id: changes
  run: |
    if git diff --name-only HEAD^ HEAD | grep -q "src/components/.*\.webflow\.tsx"; then
      echo "changed=true" >> $GITHUB_OUTPUT
    fi

- name: Import to Webflow
  if: steps.changes.outputs.changed == 'true'
  run: npx webflow library share --no-input
```

### Best Practices for CI/CD

1. **Use secrets for API tokens**
   ```yaml
   env:
     WEBFLOW_WORKSPACE_API_TOKEN: ${{ secrets.WEBFLOW_TOKEN }}
   ```

2. **Add `--no-input` flag**
   ```bash
   npx webflow library share --no-input
   ```

3. **Implement change detection**
   - Only share when components actually changed
   - Prevents accidental component removal

4. **Cache node_modules**
   ```yaml
   - name: Cache dependencies
     uses: actions/cache@v3
     with:
       path: node_modules
       key: ${{ runner.os }}-node-${{ hashFiles('package-lock.json') }}
   ```

5. **Use verbose logging for debugging**
   ```bash
   npx webflow library share --no-input --verbose
   ```

## Bundle Limits

| Limit | Value |
|-------|-------|
| Maximum bundle size | 50MB |
| Recommended size | < 10MB |
| Timeout | 10 minutes |

### Optimizing Bundle Size

```bash
# Check current bundle size
npx webflow library bundle --public-path http://localhost:4000/
ls -lh dist/

# Analyze bundle
npm install --save-dev webpack-bundle-analyzer
```

Then add to `webpack.webflow.js`:

```js
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin()
  ]
};
```

## CSS Modules

By default, CSS Modules require bracket notation for hyphenated classes:

```tsx
import * as styles from './Button.module.css';
<div className={(styles as any)['my-button']} />
```

### Enable Dot Notation

Create `webpack.webflow.js` in your project root:

```js
module.exports = {
  module: {
    rules: (currentRules) => {
      return currentRules.map((rule) => {
        // Find CSS rule
        if (
          rule.test instanceof RegExp &&
          rule.test.test('test.css') &&
          Array.isArray(rule.use)
        ) {
          for (const [index, loader] of rule.use.entries()) {
            // Find css-loader
            if (typeof loader === 'object' && loader?.ident === 'css-loader') {
              const options = typeof loader.options === 'object' ? loader.options : {};
              rule.use[index] = {
                ...loader,
                options: {
                  ...options,
                  modules: {
                    exportLocalsConvention: 'as-is',
                    namedExport: false,  // Enable dot notation
                  },
                },
              };
            }
          }
        }
        return rule;
      });
    },
  },
};
```

Now use dot notation:

```tsx
import styles from './Button.module.css';
<div className={styles.myButton} />
```

## Debugging

### Enable Development Mode

Disable minification to see readable errors:

```bash
# Via CLI flag
npx webflow library bundle --public-path http://localhost:4000/ --dev

# Via webpack config
module.exports = {
  mode: 'development'
};
```

### Inspect Webpack Config

Print the final webpack configuration:

```bash
npx webflow library bundle --public-path http://localhost:4000/ --debug-bundler
```

### Local Testing

1. **Bundle locally:**
   ```bash
   npx webflow library bundle --public-path http://localhost:4000/ --dev
   ```

2. **Serve the dist folder:**
   ```bash
   npx serve dist -p 4000
   ```

3. **Test in browser:**
   Open `http://localhost:4000`

### Common Issues

#### Bundle fails

```bash
# Get detailed error output
npx webflow library share --verbose

# Check for TypeScript errors
npm run tsc --noEmit

# Try development mode
npx webflow library bundle --public-path http://localhost:4000/ --dev
```

#### Authentication errors

```bash
# Verify token exists
cat .env | grep WEBFLOW_WORKSPACE_API_TOKEN

# Try manual auth
npx webflow library share --api-token wf_12345...

# Check token permissions (must be Workspace Admin)
```

#### Component not appearing

```bash
# Verify glob pattern matches files
ls src/**/*.webflow.tsx

# Check webflow.json configuration
cat webflow.json

# Get import logs
npx webflow library log
```

## Configuration Files

### webflow.json

Required configuration file in project root:

```json
{
  "library": {
    "name": "My Component Library",
    "components": ["./src/**/*.webflow.@(js|jsx|mjs|ts|tsx)"],
    "bundleConfig": "./webpack.webflow.js"
  }
}
```

| Field | Description | Required |
|-------|-------------|----------|
| `library.name` | Library name in Webflow | Yes |
| `library.components` | Glob pattern for component files | Yes |
| `library.bundleConfig` | Path to webpack config | No |

### webpack.webflow.js

Optional webpack configuration override:

```js
module.exports = {
  // Override mode
  mode: 'development',

  // Modify rules
  module: {
    rules: (currentRules) => {
      // Customize rules
      return currentRules;
    },
  },

  // Add plugins
  plugins: [
    // Your plugins
  ],

  // Modify resolve
  resolve: {
    alias: {
      '@components': './src/components',
    },
  },
};
```

## Troubleshooting

### Authentication Issues

**Problem:** Authentication fails

**Solutions:**
- Verify you're a Workspace Admin
- Check token is correct in `.env`
- Try `--api-token` flag
- Run with `--verbose` for details

### Component Removal Warning

**Problem:** CLI warns about removing components

**Cause:** Component file was renamed or moved

**Solution:**
- Rename back to original name, or
- Accept that old component will be removed

**Note:** Renaming creates a new component in Webflow. Existing instances of the old component will break.

### Bundle Too Large

**Problem:** Bundle exceeds 50MB

**Solutions:**
- Remove unused dependencies
- Use dynamic imports
- Optimize images
- Enable tree shaking
- Run bundle analyzer

### Network Errors

**Problem:** Upload fails due to network

**Solutions:**
- Check internet connection
- Try again (temporary issue)
- Use `--verbose` to see details
- Check firewall settings

## Next Steps

- **[Getting Started](./getting-started.md)** - Setup and first component
- **[Component Declaration](./component-declaration.md)** - Define components
- **[Troubleshooting](./troubleshooting.md)** - More solutions
