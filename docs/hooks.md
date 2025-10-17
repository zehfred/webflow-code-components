# Webflow Hooks

Access Webflow-specific context and information in your React components.

## useWebflowContext

Get information about the current Webflow environment, including the designer mode, interactive state, and locale.

### Syntax

```typescript
useWebflowContext(): WebflowContext

interface WebflowContext {
  mode: WebflowMode;
  interactive: boolean;
  locale: string | null;
}

type WebflowMode =
  | "design"
  | "build"
  | "edit"
  | "preview"
  | "component-preview"
  | "comment"
  | "analyze"
  | "publish";
```

### Returns

| Property | Type | Description |
|----------|------|-------------|
| `mode` | `WebflowMode` | Current Webflow mode |
| `interactive` | `boolean` | Whether component is in interactive state |
| `locale` | `string \| null` | Current locale ISO string, or `null` if not set |

### Webflow Modes

| Mode | Description |
|------|-------------|
| `design` | Designer is editing the component |
| `build` | Building/publishing the site |
| `edit` | Editor mode |
| `preview` | Previewing the site |
| `component-preview` | Previewing in component panel |
| `comment` | Commenting mode |
| `analyze` | Analysis mode |
| `publish` | Published site |

## When to Use

Use `useWebflowContext` when you need to:

- **Adapt behavior** based on designer vs. published mode
- **Control interactivity** - Disable features in non-interactive states
- **Handle localization** - Render locale-specific content
- **Provide helpful defaults** - Show expanded states in designer

## Examples

### Conditional Rendering Based on Interactive State

Open an accordion by default in design mode so designers can see the content:

```tsx
import { useWebflowContext } from '@webflow/react';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';

interface FAQItemProps {
  question: string;
  answer: string;
}

export const FAQItem = ({ question, answer }: FAQItemProps) => {
  const { interactive } = useWebflowContext();

  return (
    <Accordion defaultExpanded={!interactive}>
      <AccordionSummary>
        {question}
      </AccordionSummary>
      <AccordionDetails>
        {answer}
      </AccordionDetails>
    </Accordion>
  );
};
```

**Why this helps:**
- Designers see full content in Designer (`interactive = false`)
- Users get normal collapsed state on published site (`interactive = true`)

### Disable Interactions in Designer

Prevent drag handlers from interfering with Designer controls:

```tsx
import { useWebflowContext } from '@webflow/react';
import { useState } from 'react';

export const DraggableCard = ({ children }: { children: React.ReactNode }) => {
  const { interactive } = useWebflowContext();
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleDrag = (e: React.DragEvent) => {
    if (!interactive) return;  // Don't interfere with Designer

    setPosition({
      x: e.clientX,
      y: e.clientY,
    });
  };

  return (
    <div
      draggable={interactive}  // Only draggable on published site
      onDrag={handleDrag}
      style={{
        transform: interactive
          ? `translate(${position.x}px, ${position.y}px)`
          : undefined,
      }}
    >
      {children}
    </div>
  );
};
```

### Locale-Aware Content

Automatically switch content based on the user's locale:

```tsx
import { useWebflowContext } from '@webflow/react';

const translations = {
  en: {
    title: 'Welcome to our site',
    description: 'Discover our products and services',
    cta: 'Get started',
  },
  es: {
    title: 'Bienvenido a nuestro sitio',
    description: 'Descubre nuestros productos y servicios',
    cta: 'Comenzar ahora',
  },
  fr: {
    title: 'Bienvenue sur notre site',
    description: 'Découvrez nos produits et services',
    cta: 'Commencer maintenant',
  },
};

export const LocalizedHero = () => {
  const { locale } = useWebflowContext();

  // Default to English if locale not set or not supported
  const content = translations[locale as keyof typeof translations] || translations.en;

  return (
    <div className="hero">
      <h1>{content.title}</h1>
      <p>{content.description}</p>
      <button>{content.cta}</button>
    </div>
  );
};
```

### Format Numbers Based on Locale

Use locale for number and currency formatting:

```tsx
import { useWebflowContext } from '@webflow/react';

interface PriceProps {
  amount: number;
  currency?: string;
}

export const Price = ({ amount, currency = 'USD' }: PriceProps) => {
  const { locale } = useWebflowContext();

  const formatted = new Intl.NumberFormat(locale || 'en-US', {
    style: 'currency',
    currency,
  }).format(amount);

  return <span className="price">{formatted}</span>;
};

// Usage
<Price amount={99.99} currency="USD" />
// en-US: "$99.99"
// es-ES: "99,99 US$"
// fr-FR: "99,99 $US"
```

### Show Placeholder Content in Designer

Display helpful placeholders when content is empty:

```tsx
import { useWebflowContext } from '@webflow/react';

interface ImageGalleryProps {
  images?: string[];
}

export const ImageGallery = ({ images = [] }: ImageGalleryProps) => {
  const { mode } = useWebflowContext();
  const isDesignMode = mode === 'design' || mode === 'component-preview';

  if (images.length === 0 && isDesignMode) {
    return (
      <div className="gallery-placeholder">
        <p>Add images to see your gallery</p>
        <p>Drag images into the Images slot above</p>
      </div>
    );
  }

  if (images.length === 0) {
    return null;  // Hide empty gallery on published site
  }

  return (
    <div className="gallery">
      {images.map((src, i) => (
        <img key={i} src={src} alt={`Gallery image ${i + 1}`} />
      ))}
    </div>
  );
};
```

### Debug Mode Based on Environment

Add debug information in designer mode:

```tsx
import { useWebflowContext } from '@webflow/react';

interface ChartProps {
  data: number[];
}

export const Chart = ({ data }: ChartProps) => {
  const { mode } = useWebflowContext();
  const showDebug = mode === 'design';

  return (
    <div className="chart">
      <svg>{/* Chart rendering */}</svg>

      {showDebug && (
        <div className="debug-info">
          <h4>Debug Info</h4>
          <p>Data points: {data.length}</p>
          <p>Min: {Math.min(...data)}</p>
          <p>Max: {Math.max(...data)}</p>
        </div>
      )}
    </div>
  );
};
```

### Conditional Animation

Respect prefers-reduced-motion and designer mode:

```tsx
import { useWebflowContext } from '@webflow/react';
import { useState, useEffect } from 'react';

export const AnimatedCard = ({ children }: { children: React.ReactNode }) => {
  const { interactive } = useWebflowContext();
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
  }, []);

  const shouldAnimate = interactive && !reducedMotion;

  return (
    <div
      className={`card ${shouldAnimate ? 'animated' : 'static'}`}
      style={{
        transition: shouldAnimate ? 'transform 0.3s ease' : 'none',
      }}
    >
      {children}
    </div>
  );
};
```

## Best Practices

### 1. Use for Designer Experience

Enhance the designer's workflow:

```tsx
// ✅ Good - Shows content in designer
const { interactive } = useWebflowContext();
<Accordion defaultExpanded={!interactive} />

// ❌ Don't hide functionality unnecessarily
const { mode } = useWebflowContext();
if (mode === 'publish') return <MyComponent />
return null;  // Designer sees nothing
```

### 2. Provide Fallbacks

Always handle cases where locale/mode aren't set:

```tsx
// ✅ Good - Has fallback
const { locale } = useWebflowContext();
const content = translations[locale] || translations.en;

// ❌ Could crash
const { locale } = useWebflowContext();
const content = translations[locale];  // Undefined if locale not in translations
```

### 3. Don't Overuse Mode Checks

Only use mode when necessary:

```tsx
// ✅ Good - Necessary for UX
const { interactive } = useWebflowContext();
<input disabled={!interactive} />

// ❌ Unnecessary - Component should work same everywhere
const { mode } = useWebflowContext();
const buttonText = mode === 'design' ? 'Design Button' : 'Button';
```

### 4. Consider All Modes

Test behavior across different modes:

```tsx
// ✅ Good - Handles all cases
const { mode } = useWebflowContext();
const isEditMode = ['design', 'edit', 'component-preview'].includes(mode);

// ❌ Too specific
const { mode } = useWebflowContext();
if (mode === 'design') { /* ... */ }
```

## Common Patterns

### Pattern: Designer Helpers

```tsx
const DesignerHelper = ({ condition, message }: {
  condition: boolean;
  message: string;
}) => {
  const { mode } = useWebflowContext();
  const showHelper = ['design', 'component-preview'].includes(mode);

  if (!condition || !showHelper) return null;

  return (
    <div className="designer-helper">
      ⚠️ {message}
    </div>
  );
};

// Usage
<DesignerHelper
  condition={!images || images.length === 0}
  message="Add images to display the gallery"
/>
```

### Pattern: Locale Provider

```tsx
import { createContext, useContext } from 'react';
import { useWebflowContext } from '@webflow/react';

const LocaleContext = createContext('en');

export const LocaleProvider = ({ children }: { children: React.ReactNode }) => {
  const { locale } = useWebflowContext();
  return (
    <LocaleContext.Provider value={locale || 'en'}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => useContext(LocaleContext);
```

### Pattern: Interactive Guard

```tsx
export const useInteractiveGuard = () => {
  const { interactive } = useWebflowContext();

  return (callback: () => void) => {
    if (!interactive) return;
    callback();
  };
};

// Usage
const handleClick = useInteractiveGuard();

<button onClick={() => handleClick(() => {
  console.log('Only runs on published site');
})}>
  Click me
</button>
```

## Next Steps

- **[Component Declaration](./component-declaration.md)** - Define component metadata
- **[Architecture](./architecture.md)** - Understand modes and rendering
- **[Best Practices](./best-practices.md)** - More patterns and tips
