# Troubleshooting

Common issues and solutions for Webflow code components.

## Getting Started Issues

### Components Don't Appear in Webflow

**Problem:** After running `npx webflow library share`, components don't show up in the Designer.

**Solutions:**

1. **Check glob pattern** - Verify files match the pattern in `webflow.json`:
   ```bash
   # List matching files
   ls src/**/*.webflow.tsx
   ```

2. **Verify file extension** - Must be `.webflow.tsx` or `.webflow.ts`

3. **Check for compilation errors** - Look for errors in terminal output

4. **Verify workspace** - Make sure you're in the correct Webflow workspace

5. **Refresh Designer** - Close and reopen the Designer

6. **Check library name** - Go to Add panel → Libraries → Your library name

### Authentication Fails

**Problem:** CLI can't authenticate with Webflow.

**Solutions:**

1. **Verify workspace token:**
   ```bash
   cat .env | grep WEBFLOW_WORKSPACE_API_TOKEN
   ```

2. **Check workspace permissions** - You must be a Workspace Admin

3. **Try manual authentication:**
   ```bash
   npx webflow library share --api-token wf_your_token_here
   ```

4. **Regenerate token:**
   - Go to Workspace → Apps & Integrations → Manage
   - Generate new Workspace API token
   - Update `.env` file

### Import Command Fails

**Problem:** `npx webflow library share` command errors out.

**Solutions:**

1. **Check CLI installation:**
   ```bash
   npm list @webflow/webflow-cli
   ```

2. **Reinstall CLI:**
   ```bash
   npm uninstall @webflow/webflow-cli
   npm install --save-dev @webflow/webflow-cli
   ```

3. **Clear npm cache:**
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Run with verbose logging:**
   ```bash
   npx webflow library share --verbose
   ```

## Styling Issues

### Styles Not Showing

**Problem:** Component renders but has no styles.

**Solutions:**

1. **Import styles in `.webflow.tsx`** (not just `.tsx`):
   ```tsx
   // ✅ Correct
   // Button.webflow.tsx
   import './Button.module.css';

   // ❌ Wrong - styles not bundled
   // Button.tsx
   import './Button.module.css';
   ```

2. **Check Shadow DOM** - Use browser DevTools:
   - Inspect element
   - Look for `#shadow-root`
   - Verify styles are inside Shadow DOM

3. **Verify CSS Module import:**
   ```tsx
   // ✅ Correct
   import styles from './Button.module.css';

   // ❌ Wrong extension
   import styles from './Button.css';
   ```

4. **Check for TypeScript errors:**
   ```bash
   npm run tsc --noEmit
   ```

### Site Classes Don't Work

**Problem:** Webflow classes don't apply to component.

**Explanation:** Site classes are not available in Shadow DOM by design.

**Solutions:**

1. **Use component-specific classes:**
   ```tsx
   // Instead of Webflow classes
   <div className={styles.container}>
   ```

2. **Use site variables:**
   ```css
   .container {
     background-color: var(--colors-primary, #007bff);
   }
   ```

3. **Use inherited properties:**
   ```css
   .text {
     font-family: inherit;
     color: inherit;
   }
   ```

4. **Enable tag selectors** (if using semantic HTML):
   ```tsx
   declareComponent(Component, {
     options: {
       applyTagSelectors: true,
     },
   });
   ```

### CSS Variables Not Working

**Problem:** Site variables don't appear in component.

**Solutions:**

1. **Get correct variable name** from Webflow:
   - Variables panel → Three dots → Copy CSS

2. **Always provide fallback:**
   ```css
   /* ✅ With fallback */
   color: var(--colors-text, #000000);

   /* ❌ No fallback */
   color: var(--colors-text);
   ```

3. **Check variable exists** - Variable must be defined in Webflow site

4. **Re-import component** after changing variables in Webflow

## Component Not Rendering

### Component Shows Error in Designer

**Problem:** Component shows error message or blank.

**Solutions:**

1. **Check browser console** - Open DevTools and look for errors

2. **Verify props are defined:**
   ```tsx
   // ✅ Handle undefined props
   export const Button = ({ text = 'Default' }: ButtonProps) => {
     return <button>{text}</button>;
   };
   ```

3. **Check for missing dependencies:**
   ```bash
   npm install
   ```

4. **Verify single root element** - Components must have one root:
   ```tsx
   // ✅ Single root
   return <div>...</div>;

   // ❌ Fragment not supported
   return <><div>...</div><div>...</div></>;
   ```

5. **Check SSR compatibility** - Disable SSR if using browser APIs:
   ```tsx
   declareComponent(Component, {
     options: {
       ssr: false,
     },
   });
   ```

### Component Works Locally But Not in Webflow

**Problem:** Component works in development but fails after import.

**Solutions:**

1. **Check for environment variables:**
   ```tsx
   // ❌ Won't work
   const API_URL = process.env.REACT_APP_API_URL;

   // ✅ Use props instead
   interface Props {
     apiUrl: string;
   }
   ```

2. **Verify bundle size** - Must be under 50MB:
   ```bash
   npx webflow library bundle --public-path http://localhost:4000/
   ls -lh dist/
   ```

3. **Check for absolute imports** that might not resolve

4. **Test with production bundle:**
   ```bash
   npx webflow library bundle --public-path http://localhost:4000/
   npx serve dist -p 4000
   ```

## State and Data Issues

### State Doesn't Persist Between Components

**Problem:** Can't share state using React Context.

**Explanation:** Each component has its own React root. Context doesn't work across components.

**Solutions:**

Use alternative state sharing methods:

1. **URL Parameters:**
   ```tsx
   const url = new URL(window.location.href);
   url.searchParams.set('filter', 'active');
   window.history.pushState({}, '', url);
   ```

2. **localStorage:**
   ```tsx
   localStorage.setItem('theme', 'dark');
   const theme = localStorage.getItem('theme');
   ```

3. **Nano Stores:**
   ```bash
   npm install nanostores @nanostores/react
   ```

4. **Custom Events:**
   ```tsx
   window.dispatchEvent(new CustomEvent('update', { detail: data }));
   ```

See [Component Communication](./component-communication.md) for detailed examples.

### API Requests Fail

**Problem:** Fetch requests return CORS errors or fail.

**Solutions:**

1. **Check CORS headers** - API must allow cross-origin requests:
   ```
   Access-Control-Allow-Origin: *
   ```

2. **Use public endpoints only:**
   ```tsx
   // ✅ Public endpoint
   fetch('https://api.example.com/public/data');

   // ❌ Protected endpoint (won't work)
   fetch('https://api.example.com/admin/data', {
     headers: { 'Authorization': 'Bearer token' }
   });
   ```

3. **Handle network errors:**
   ```tsx
   fetch(url)
     .catch(err => {
       if (!navigator.onLine) {
         setError('No internet connection');
       } else {
         setError('Network error');
       }
     });
   ```

4. **Verify API URL** - Check for typos

See [Data Fetching](./data-fetching.md) for more details.

## Build and Bundle Issues

### Bundle Size Too Large

**Problem:** Bundle exceeds 50MB limit.

**Solutions:**

1. **Check current size:**
   ```bash
   npx webflow library bundle --public-path http://localhost:4000/
   du -sh dist/
   ```

2. **Remove unused dependencies:**
   ```bash
   npm uninstall unused-package
   ```

3. **Use dynamic imports:**
   ```tsx
   const HeavyComponent = lazy(() => import('./HeavyComponent'));
   ```

4. **Optimize images** - Compress before bundling

5. **Analyze bundle:**
   ```bash
   npm install --save-dev webpack-bundle-analyzer
   ```

6. **Enable tree shaking** - Remove unused exports

### TypeScript Errors

**Problem:** TypeScript compilation fails.

**Solutions:**

1. **Run TypeScript check:**
   ```bash
   npx tsc --noEmit
   ```

2. **Fix type errors** shown in output

3. **Check tsconfig.json** configuration

4. **Install missing type definitions:**
   ```bash
   npm install --save-dev @types/react @types/node
   ```

### Webpack Configuration Issues

**Problem:** Custom webpack config causes errors.

**Solutions:**

1. **Test without custom config** - Temporarily remove `bundleConfig` from `webflow.json`

2. **Check webpack.webflow.js syntax:**
   ```js
   module.exports = {
     // Valid webpack config
   };
   ```

3. **Print final config:**
   ```bash
   npx webflow library bundle --public-path http://localhost:4000/ --debug-bundler
   ```

4. **Start with minimal config:**
   ```js
   module.exports = {
     mode: 'development',
   };
   ```

## Performance Issues

### Component Loads Slowly

**Problem:** Component takes long time to render.

**Solutions:**

1. **Enable SSR** (if disabled):
   ```tsx
   declareComponent(Component, {
     options: {
       ssr: true,  // Default
     },
   });
   ```

2. **Reduce bundle size** - See "Bundle Size Too Large" above

3. **Lazy load heavy features:**
   ```tsx
   const Chart = lazy(() => import('./Chart'));
   ```

4. **Optimize images:**
   - Use appropriate formats (WebP, AVIF)
   - Compress images
   - Use lazy loading

5. **Minimize re-renders:**
   ```tsx
   const MemoizedComponent = memo(Component);
   ```

### Multiple Instances Slow Page

**Problem:** Page slows down with many component instances.

**Solutions:**

1. **Clean up effects:**
   ```tsx
   useEffect(() => {
     const handler = () => { /* ... */ };
     window.addEventListener('scroll', handler);
     return () => window.removeEventListener('scroll', handler);
   }, []);
   ```

2. **Debounce expensive operations:**
   ```tsx
   const debouncedUpdate = useMemo(
     () => debounce(updateValue, 300),
     []
   );
   ```

3. **Use `React.memo`** for expensive components

4. **Virtualize long lists** with libraries like `react-window`

## Browser Compatibility

### Component Works in Chrome But Not Safari

**Problem:** Component fails in certain browsers.

**Solutions:**

1. **Check for unsupported APIs:**
   ```tsx
   // ✅ Check for support
   if ('IntersectionObserver' in window) {
     // Use IntersectionObserver
   }
   ```

2. **Add polyfills** for missing features

3. **Test in multiple browsers** during development

4. **Use standard APIs** instead of experimental ones

5. **Check Shadow DOM support** (all modern browsers support it)

## Component Updates

### Changes Not Appearing After Re-import

**Problem:** Updated component doesn't reflect changes in Webflow.

**Solutions:**

1. **Hard refresh Designer:**
   - Close Webflow Designer completely
   - Clear browser cache
   - Reopen Designer

2. **Verify import succeeded:**
   ```bash
   npx webflow library log
   ```

3. **Check component was actually changed:**
   ```bash
   git diff
   ```

4. **Clear local build:**
   ```bash
   rm -rf dist node_modules/.cache
   npm run build
   ```

### Old Component Instances Break

**Problem:** Existing component instances show errors after update.

**Causes:**
- Changed prop names
- Removed required props
- Changed prop types

**Solutions:**

1. **Keep backward compatibility** - Don't remove props:
   ```tsx
   // ✅ Add new prop, keep old one
   interface Props {
     text: string;
     label?: string;  // New optional prop
   }

   // ❌ Breaking change
   interface Props {
     label: string;  // Renamed from 'text'
   }
   ```

2. **Use default values:**
   ```tsx
   const Component = ({
     text = '',
     variant = 'primary'
   }: Props) => {
     // ...
   };
   ```

3. **Migrate gradually:**
   - Support both old and new props
   - Update instances in Designer
   - Remove old props in next version

## Getting Help

If you're still stuck:

1. **Check error messages** carefully - They usually indicate the problem

2. **Use verbose logging:**
   ```bash
   npx webflow library share --verbose
   ```

3. **Test locally:**
   ```bash
   npx webflow library bundle --public-path http://localhost:4000/ --dev
   ```

4. **Check browser console** for runtime errors

5. **Verify all prerequisites:**
   - Node.js installed
   - Dependencies installed
   - Workspace token configured
   - Webflow.json exists

6. **Consult official docs:**
   - [Webflow Code Components](https://developers.webflow.com/code-components)
   - [CLI Reference](./cli-reference.md)
   - [Architecture](./architecture.md)

7. **Create minimal reproduction:**
   - Start with simplest possible component
   - Add complexity gradually
   - Identify what breaks it

## Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| `WEBFLOW_WORKSPACE_API_TOKEN not found` | Missing .env file | Add token to `.env` |
| `Failed to authenticate` | Invalid token or permissions | Verify token and admin access |
| `Bundle size exceeds limit` | Bundle > 50MB | Reduce bundle size |
| `Cannot find module` | Missing dependency | Run `npm install` |
| `Component not found` | Glob pattern mismatch | Check `webflow.json` pattern |
| `CORS error` | API doesn't allow cross-origin | Add CORS headers on API |
| `Hydration mismatch` | SSR/client render different | Disable SSR or fix rendering |

## Next Steps

- **[Best Practices](./best-practices.md)** - Avoid common pitfalls
- **[CLI Reference](./cli-reference.md)** - Detailed command documentation
- **[Architecture](./architecture.md)** - Understand how components work
