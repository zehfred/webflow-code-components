# Styling Components

Learn how to style code components within Shadow DOM constraints.

## Overview

Code components render in [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM), which creates an isolated styling boundary. This prevents style conflicts but requires specific approaches to styling.

## How Shadow DOM Affects Styling

Shadow DOM creates a boundary where:

- ✅ **Your component styles don't leak** - Won't affect the rest of the page
- ✅ **Page styles don't leak in** - Page CSS won't override your styles
- ❌ **Site classes don't work** - Webflow classes aren't available
- ✅ **You control everything** - Complete style encapsulation

## Adding Styles

### Import in .webflow.tsx

Always import styles in your `.webflow.tsx` definition file:

```tsx
// Button.webflow.tsx
import { declareComponent } from '@webflow/react';
import { props } from '@webflow/data-types';
import { Button } from './Button';
import './Button.module.css';  // ← Import here!

export default declareComponent(Button, { /* ... */ });
```

**Why?** The `.webflow.tsx` file is the entry point for bundling. Styles imported here are included in your component bundle.

## CSS Capabilities

| Feature | Works? | How to Use |
|---------|--------|------------|
| **Component CSS** | ✅ Yes | Import in `.webflow.tsx` |
| **CSS Modules** | ✅ Yes | Standard CSS Module syntax |
| **Site Variables** | ✅ Yes | `var(--variable-name, fallback)` |
| **Inherited Properties** | ✅ Yes | Use `inherit` value |
| **Tag Selectors** | ✅ Yes | Enable with `applyTagSelectors: true` |
| **Site Classes** | ❌ No | Use component-specific classes |
| **Global Styles** | ❌ No | Must be explicitly imported |

## Using Site Variables

Reference Webflow site variables using CSS custom properties:

```css
/* Button.module.css */
.button {
  /* Use site variable with fallback */
  background-color: var(--colors-primary, #007bff);
  color: var(--colors-text, #ffffff);
  border-radius: var(--radii-md, 4px);
  font-family: var(--fonts-body, sans-serif);
}
```

### Getting Variable Names

1. Open Webflow Designer
2. Go to Variables panel
3. Find your variable
4. Click the three-dot menu
5. Select "Copy CSS"

This gives you the exact variable name:

```css
var(--colors-primary)
var(--spacing-md)
var(--fonts-heading)
```

### Always Provide Fallbacks

```css
/* ✅ Good - Has fallback */
color: var(--colors-text, #000000);

/* ❌ Risky - No fallback */
color: var(--colors-text);
```

## Inherited Properties

CSS properties set to `inherit` work across Shadow DOM boundaries:

```css
/* Card.module.css */
.card {
  font-family: inherit;  /* Inherits from parent element */
  color: inherit;
  line-height: inherit;
}
```

**Common inherited properties:**
- `font-family`
- `font-size`
- `font-weight`
- `color`
- `line-height`
- `text-align`
- `visibility`

**Example:**

```html
<!-- Page HTML -->
<div style="font-family: 'Inter', sans-serif; color: #333;">
  <your-component />  <!-- Inherits font-family and color -->
</div>
```

```css
/* Component CSS */
.component {
  font-family: inherit;  /* Gets 'Inter' from parent */
  color: inherit;        /* Gets #333 from parent */
}
```

## Tag Selectors

Enable site-wide tag selector styles (h1, p, button, etc.) with `applyTagSelectors`:

```tsx
// Article.webflow.tsx
import { declareComponent } from '@webflow/react';
import { Article } from './Article';
import './Article.module.css';

export default declareComponent(Article, {
  name: 'Article',
  options: {
    applyTagSelectors: true,  // ← Enable tag selectors
  },
});
```

Now your component inherits styles for HTML tags defined in Webflow:

```tsx
// Article.tsx
export const Article = ({ title, content }: ArticleProps) => {
  return (
    <article>
      <h1>{title}</h1>        {/* Gets h1 styles from Webflow */}
      <p>{content}</p>         {/* Gets p styles from Webflow */}
    </article>
  );
};
```

### When to Enable

**Enable when:**
- Using semantic HTML (h1-h6, p, a, etc.)
- Want consistent typography with site
- Component is content-heavy

**Disable when:**
- Custom styled components
- Need full style control
- Using a design system

## CSS Modules

CSS Modules are fully supported and recommended:

```tsx
// Button.tsx
import React from 'react';
import styles from './Button.module.css';

export const Button = ({ text, variant }: ButtonProps) => {
  return (
    <button className={`${styles.button} ${styles[variant]}`}>
      {text}
    </button>
  );
};
```

```css
/* Button.module.css */
.button {
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s;
}

.primary {
  background-color: var(--colors-primary, #007bff);
  color: white;
}

.secondary {
  background-color: var(--colors-secondary, #6c757d);
  color: white;
}
```

### Dot Notation vs Bracket Notation

By default, you need bracket notation for class names with hyphens:

```tsx
// Default behavior
import * as styles from './Button.module.css';

<div className={(styles as any)['my-button']} />
```

To enable dot notation, see [CLI Reference - CSS Modules](./cli-reference.md#css-modules).

## CSS-in-JS

CSS-in-JS libraries require special configuration for Shadow DOM. See examples below:

### Styled Components

```tsx
import styled from 'styled-components';

const Button = styled.button`
  padding: 12px 24px;
  background-color: ${props => props.variant === 'primary' ? '#007bff' : '#6c757d'};
  color: white;
  border: none;
  border-radius: 4px;
`;

export const MyButton = ({ text, variant }) => {
  return <Button variant={variant}>{text}</Button>;
};
```

**Note:** May require webpack configuration. See the [Webflow bundling docs](https://developers.webflow.com/code-components/bundling-and-import).

### Emotion

```tsx
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

export const MyComponent = () => {
  return (
    <div
      css={css`
        padding: 20px;
        background-color: var(--colors-background, #f5f5f5);
        border-radius: 8px;
      `}
    >
      Content
    </div>
  );
};
```

## Responsive Design

Use standard CSS media queries:

```css
/* Card.module.css */
.card {
  width: 100%;
  padding: 16px;
}

@media (min-width: 768px) {
  .card {
    width: 50%;
    padding: 24px;
  }
}

@media (min-width: 1200px) {
  .card {
    width: 33.333%;
    padding: 32px;
  }
}
```

## Animations and Transitions

CSS animations work normally within Shadow DOM:

```css
/* Spinner.module.css */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  animation: spin 1s linear infinite;
}

.button {
  transition: all 0.2s ease;
}

.button:hover {
  transform: scale(1.05);
}
```

### Respect prefers-reduced-motion

```css
.animated {
  transition: transform 0.3s ease;
}

@media (prefers-reduced-motion: reduce) {
  .animated {
    transition: none;
  }
}
```

Or in JavaScript:

```tsx
import { useEffect, useState } from 'react';

export const AnimatedCard = ({ children }) => {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return (
    <div className={reducedMotion ? 'static' : 'animated'}>
      {children}
    </div>
  );
};
```

## Dark Mode

Use CSS custom properties for theme switching:

```css
/* Component.module.css */
.card {
  background-color: var(--card-bg, #ffffff);
  color: var(--card-text, #000000);
}
```

Then let designers set variables in Webflow or use JavaScript:

```tsx
import { useEffect, useState } from 'react';

export const ThemedCard = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark';
    if (saved) setTheme(saved);
  }, []);

  return (
    <div
      className="card"
      style={{
        '--card-bg': theme === 'dark' ? '#1a1a1a' : '#ffffff',
        '--card-text': theme === 'dark' ? '#ffffff' : '#000000',
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
};
```

## Complete Example

Here's a fully styled component using best practices:

```tsx
// Card.tsx
import React from 'react';
import styles from './Card.module.css';

export interface CardProps {
  title: string;
  description: string;
  image?: string;
  variant: 'elevated' | 'flat';
}

export const Card: React.FC<CardProps> = ({
  title,
  description,
  image,
  variant
}) => {
  return (
    <article className={`${styles.card} ${styles[variant]}`}>
      {image && (
        <img src={image} alt="" className={styles.image} />
      )}
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>
    </article>
  );
};
```

```css
/* Card.module.css */
.card {
  /* Use site variables with fallbacks */
  border-radius: var(--radii-lg, 12px);
  overflow: hidden;
  transition: transform 0.2s ease;
  background-color: var(--colors-surface, #ffffff);
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .card {
    transition: none;
  }
}

.elevated {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.elevated:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

.flat {
  border: 1px solid var(--colors-border, #e0e0e0);
}

.image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.content {
  padding: var(--spacing-md, 16px);
}

.title {
  /* Inherit typography from site */
  font-family: inherit;
  font-size: var(--font-sizes-lg, 20px);
  color: var(--colors-text-primary, #1a1a1a);
  margin: 0 0 8px 0;
}

.description {
  font-family: inherit;
  font-size: var(--font-sizes-base, 16px);
  color: var(--colors-text-secondary, #666666);
  margin: 0;
  line-height: 1.6;
}

/* Responsive */
@media (max-width: 768px) {
  .image {
    height: 150px;
  }

  .content {
    padding: var(--spacing-sm, 12px);
  }
}
```

```tsx
// Card.webflow.tsx
import { declareComponent } from '@webflow/react';
import { props } from '@webflow/data-types';
import { Card } from './Card';
import './Card.module.css';  // ← Import styles here

export default declareComponent(Card, {
  name: 'Card',
  description: 'A flexible card component',
  group: 'Content',

  props: {
    title: props.Text({
      name: 'Title',
      defaultValue: 'Card Title',
    }),
    description: props.RichText({
      name: 'Description',
      defaultValue: 'Card description',
    }),
    image: props.Image({
      name: 'Image',
    }),
    variant: props.Variant({
      name: 'Style',
      options: ['elevated', 'flat'],
      defaultValue: 'elevated',
    }),
  },

  options: {
    applyTagSelectors: false,  // We're using custom styles
  },
});
```

## Best Practices

### 1. Use Site Variables

Connect to Webflow's design system:

```css
/* ✅ Good - Uses site variables */
.button {
  background-color: var(--colors-primary, #007bff);
  padding: var(--spacing-md, 16px);
}

/* ❌ Disconnected from site */
.button {
  background-color: #007bff;
  padding: 16px;
}
```

### 2. Provide Fallbacks

Always include fallback values:

```css
/* ✅ Safe */
color: var(--text-color, #000000);

/* ❌ Could be undefined */
color: var(--text-color);
```

### 3. Use Inheritance

Respect parent styles:

```css
/* ✅ Inherits site typography */
.text {
  font-family: inherit;
  color: inherit;
}

/* ❌ Overrides everything */
.text {
  font-family: Arial;
  color: #000;
}
```

### 4. Import in .webflow.tsx

```tsx
// ✅ Styles will be bundled
import './Component.module.css';

// ❌ Styles might not be included
// (if only imported in .tsx file)
```

### 5. Scope Your Styles

Use CSS Modules to prevent conflicts:

```tsx
// ✅ Scoped
import styles from './Button.module.css';
<button className={styles.button} />

// ❌ Global (could conflict)
import './Button.css';
<button className="button" />
```

## Troubleshooting

### Styles Not Showing

1. **Check import location**: Import in `.webflow.tsx`, not just `.tsx`
2. **Verify file extension**: Use `.module.css` for CSS Modules
3. **Check Shadow DOM**: Use browser DevTools to inspect Shadow DOM
4. **Verify bundle**: Run `npx webflow library bundle` locally to test

### Site Classes Not Working

Site classes from Webflow are not available in Shadow DOM. Use:
- Component-specific classes
- CSS Modules
- Site variables

### Variables Not Updating

Make sure:
- Variable name is correct (copy from Webflow)
- Fallback value is provided
- Component is re-imported after variable changes

## Next Steps

- **[Architecture](./architecture.md)** - Understand Shadow DOM isolation
- **[CLI Reference](./cli-reference.md)** - CSS Modules configuration
- **[Best Practices](./best-practices.md)** - More optimization tips
