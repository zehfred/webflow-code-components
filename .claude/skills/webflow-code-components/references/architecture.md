# Architecture

Understand how code components work internally and their architectural constraints.

## Overview

**Code components run as isolated React applications.** Each component mounts in its own [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM) container with a separate React root, creating a sandboxed environment that prevents conflicts with the main page or other components.

## Shadow DOM Isolation

Each code component renders inside Shadow DOM, which creates a boundary that:

- **Encapsulates styles** - Component styles won't affect the page
- **Protects from page styles** - Page styles won't override component styles
- **Isolates DOM** - Component DOM is separate from page DOM
- **Creates security boundary** - Scripts and styles are contained

### What This Means for Development

```
Page DOM
├── Webflow Site Structure
├── Shadow Root (Component 1) ← Isolated
│   └── Your React App
│       └── Component Tree
├── Shadow Root (Component 2) ← Isolated
│   └── Your React App
│       └── Component Tree
└── More Webflow Elements
```

**You must explicitly import:**
- ✅ Component styles (CSS modules, styled-components)
- ✅ External stylesheets you want to use
- ✅ Site variables (via CSS custom properties)

**You cannot access:**
- ❌ Site classes from Webflow
- ❌ Global styles on the page
- ❌ Other components' styles or state

See [Styling Components](./styling.md) for how to work with styles in Shadow DOM.

## Separate React Roots

Each code component instance runs in its own React root with `createRoot()`. This means:

### State Isolation

```tsx
// ❌ This DOES NOT WORK across components
import { createContext } from 'react';

const ThemeContext = createContext();

// Component A provides context
<ThemeContext.Provider value="dark">
  ...
</ThemeContext.Provider>

// Component B CANNOT access it (different React root)
const theme = useContext(ThemeContext);  // undefined
```

**React Context does not work between code components.**

### No Shared State

Each component has its own:
- React Context
- State management (Redux, Zustand, etc.)
- Effect cleanup
- Event handlers

To share state between components, see [Component Communication](./component-communication.md).

### Composing Components with Slots

When using slots, child components still render in their own Shadow DOM:

```tsx
// Parent component with slot
<ParentComponent>
  <ChildComponent />  ← Renders in its own Shadow Root
</ParentComponent>
```

**Warning:** Parent and child cannot share state through React Context even when composed.

## Server-Side Rendering (SSR)

Webflow supports SSR for code components. SSR generates initial HTML on the server, improving perceived performance and SEO. After the page loads, Webflow hydrates the component in the browser to make it interactive.

### SSR is Enabled by Default

```tsx
declareComponent(MyComponent, {
  name: 'My Component',
  // SSR is ON by default
});
```

### Disabling SSR

Disable SSR when your component requires client-only features:

```tsx
declareComponent(Chart, {
  name: 'Chart',
  options: {
    ssr: false,  // Component only renders client-side
  },
});
```

### When to Disable SSR

Disable SSR if your component uses:

#### 1. Browser APIs

```tsx
// Component uses window, document, localStorage, etc.
const MyComponent = () => {
  const [data, setData] = useState(() => {
    return localStorage.getItem('data');  // Not available on server
  });

  useEffect(() => {
    const handleResize = () => {
      // Uses window
      setWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
  }, []);

  // ...
};
```

**Solution:** Disable SSR or guard with `typeof window !== 'undefined'`

#### 2. Dynamic or Personalized Content

```tsx
// Component shows user-specific data
const Dashboard = () => {
  const userId = getUserId();  // Requires client context
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(setUserData);
  }, [userId]);

  // ...
};
```

#### 3. Heavy Interactive UI

```tsx
// WebGL, Canvas, complex animations
const ThreeScene = () => {
  useEffect(() => {
    const scene = new THREE.Scene();  // WebGL not available on server
    const renderer = new THREE.WebGLRenderer({ canvas });
    // ...
  }, []);

  return <canvas ref={canvasRef} />;
};
```

#### 4. Non-Deterministic Output

```tsx
// Renders differently each time
const RandomQuote = () => {
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  // Server renders one quote, client might render different quote
  return <p>{quote}</p>;
};
```

**Hydration mismatch:** Server HTML won't match client render.

### When to Keep SSR Enabled

Keep SSR for:

- **Static content** - Text, images, layouts
- **SEO benefit** - Content that should be indexed
- **Performance** - Faster initial paint
- **Deterministic rendering** - Same output every time

```tsx
// ✅ Good candidate for SSR
const HeroSection = ({ title, subtitle, image }: HeroProps) => {
  return (
    <section className="hero">
      <img src={image} alt="" />
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </section>
  );
};
```

### Guarding Browser APIs

If you need SSR but use some browser APIs:

```tsx
const MyComponent = () => {
  const [width, setWidth] = useState(1200);  // Default for SSR

  useEffect(() => {
    // Only runs on client
    if (typeof window !== 'undefined') {
      setWidth(window.innerWidth);

      const handleResize = () => setWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);

      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return <div>Width: {width}px</div>;
};
```

## React Server Components

**React Server Components are NOT supported.** Code components must use standard React client components.

```tsx
// ❌ This does NOT work
'use server';

export default async function MyComponent() {
  const data = await fetch('...');
  return <div>{data}</div>;
}
```

```tsx
// ✅ Use client-side data fetching instead
'use client';  // Or omit this directive

export default function MyComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('...')
      .then(res => res.json())
      .then(setData);
  }, []);

  return <div>{data}</div>;
}
```

## Component Lifecycle

Understanding the component lifecycle in Webflow:

### 1. Build Time

```
Developer Machine
├── Write React component
├── Create .webflow.tsx definition
├── Run `npx webflow library share`
└── Bundle uploaded to Webflow
```

### 2. Design Time

```
Webflow Designer
├── Component appears in panel
├── Designer adds to canvas
├── Designer configures props
└── Preview renders component (SSR + hydration)
```

### 3. Publish Time

```
Published Site
├── HTML generated (if SSR enabled)
├── Page loads
├── Component bundle loads
├── React hydrates component
└── Component becomes interactive
```

## Performance Considerations

### Bundle Size

- **Maximum: 50MB per library**
- **Recommendation: Keep under 10MB**
- Components are downloaded by users' browsers

**Optimization tips:**
- Tree-shake unused code
- Minimize dependencies
- Use dynamic imports for heavy features
- Optimize images and assets

### Multiple Component Instances

Each component instance creates:
- New React root
- New Shadow DOM
- Separate event listeners
- Individual state management

**Be mindful of:**
- Memory usage with many instances
- Duplicate code execution
- Resource cleanup in `useEffect`

### Lazy Loading

For heavy components, consider code splitting:

```tsx
import { lazy, Suspense } from 'react';

const HeavyChart = lazy(() => import('./HeavyChart'));

export const ChartWrapper = (props: ChartProps) => {
  return (
    <Suspense fallback={<div>Loading chart...</div>}>
      <HeavyChart {...props} />
    </Suspense>
  );
};
```

## Architectural Constraints Summary

| Feature | Supported | Alternative |
|---------|-----------|-------------|
| React Context across components | ❌ | [Component Communication](./component-communication.md) |
| Global Redux/Zustand store | ❌ | URL params, localStorage, Nano Stores |
| Site classes | ❌ | Component-specific CSS, CSS variables |
| Browser APIs | ⚠️ | Guard with SSR check or disable SSR |
| Server Components | ❌ | Client components with data fetching |
| CSS-in-JS | ✅ | May need Shadow DOM config |
| TypeScript | ✅ | Fully supported |

## Next Steps

- **[Component Communication](./component-communication.md)** - Share state between components
- **[Styling](./styling.md)** - Work with Shadow DOM styles
- **[Data Fetching](./data-fetching.md)** - Fetch external data
- **[Best Practices](./best-practices.md)** - Optimization tips
