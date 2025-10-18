# Best Practices

Recommendations and patterns for building high-quality Webflow code components.

## Component Design

### Keep Components Focused

Each component should have a single, clear purpose.

```tsx
// ✅ Good - Focused component
export const Button = ({ text, onClick }: ButtonProps) => {
  return <button onClick={onClick}>{text}</button>;
};

// ❌ Avoid - Doing too much
export const ButtonWithModalAndForm = ({ ... }) => {
  // Button + Modal + Form logic all in one
};
```

**Benefits:**
- Easier to maintain
- More reusable
- Simpler to test
- Better performance

### Use TypeScript

Always use TypeScript for type safety:

```tsx
// ✅ Good - Type-safe
export interface ButtonProps {
  text: string;
  variant: 'primary' | 'secondary';
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ text, variant, onClick }) => {
  return <button className={variant} onClick={onClick}>{text}</button>;
};

// ❌ Avoid - No types
export const Button = ({ text, variant, onClick }) => {
  return <button>{text}</button>;
};
```

### Provide Sensible Defaults

Components should work immediately when added:

```tsx
// ✅ Good - Works out of the box
export const Card = ({
  title = 'Card Title',
  variant = 'elevated',
  padding = 'medium'
}: CardProps) => {
  // ...
};

// In .webflow.tsx
props: {
  title: props.Text({
    name: 'Title',
    defaultValue: 'Card Title'  // Designer sees content immediately
  })
}

// ❌ Avoid - Empty by default
export const Card = ({ title, variant, padding }: CardProps) => {
  return <div>{title}</div>;  // Shows nothing until configured
};
```

### Handle Edge Cases

Anticipate and handle edge cases:

```tsx
// ✅ Good - Handles all cases
export const ImageGallery = ({ images = [] }: GalleryProps) => {
  if (images.length === 0) {
    return <div className="empty">No images to display</div>;
  }

  return (
    <div className="gallery">
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`Image ${i + 1}`}
          onError={(e) => {
            // Handle broken images
            e.currentTarget.src = '/placeholder.png';
          }}
        />
      ))}
    </div>
  );
};

// ❌ Crashes with empty array
export const ImageGallery = ({ images }: GalleryProps) => {
  return (
    <div>
      {images.map(src => <img src={src} />)}
    </div>
  );
};
```

## Prop Design

### Use Descriptive Prop Names

Make props self-explanatory:

```tsx
// ✅ Good - Clear names
interface CardProps {
  title: string;
  description: string;
  imageUrl?: string;
  showButton: boolean;
  buttonText: string;
}

// ❌ Unclear names
interface CardProps {
  t: string;
  d: string;
  img?: string;
  btn: boolean;
  btnTxt: string;
}
```

### Group Related Props

Use the `group` property in prop definitions:

```tsx
// ✅ Good - Organized
export default declareComponent(Card, {
  name: 'Card',
  props: {
    // Content group
    title: props.Text({ name: 'Title', group: 'Content' }),
    description: props.RichText({ name: 'Description', group: 'Content' }),

    // Button group
    buttonVisible: props.Visibility({ name: 'Show Button', group: 'Button' }),
    buttonText: props.Text({ name: 'Text', group: 'Button' }),
    buttonLink: props.Link({ name: 'Link', group: 'Button' }),

    // Style group
    variant: props.Variant({ name: 'Variant', group: 'Style' }),
    elevation: props.Boolean({ name: 'Shadow', group: 'Style' }),
  },
});
```

### Add Helpful Tooltips

Guide designers with clear tooltips:

```tsx
// ✅ Good - Helpful guidance
animationDuration: props.Number({
  name: 'Duration',
  defaultValue: 0.3,
  min: 0.1,
  max: 2,
  decimals: 1,
  tooltip: 'Animation duration in seconds. Lower values = faster animations.'
}),

// ❌ No guidance
animationDuration: props.Number({
  name: 'Duration',
  defaultValue: 0.3
}),
```

### Use Appropriate Prop Types

Choose the right prop type for the data:

```tsx
// ✅ Good - Correct types
props: {
  count: props.Number({ name: 'Count' }),              // Numbers
  visible: props.Boolean({ name: 'Visible' }),         // Toggles
  variant: props.Variant({                             // Limited choices
    name: 'Style',
    options: ['small', 'medium', 'large']
  }),
  children: props.Slot({ name: 'Content' }),           // Flexible content
  imageUrl: props.Image({ name: 'Image' }),            // Images
  link: props.Link({ name: 'Link' }),                  // URLs
}

// ❌ Wrong types
props: {
  count: props.Text({ name: 'Count' }),                // Should be Number
  visible: props.Text({ name: 'Visible' }),            // Should be Boolean
  variant: props.Text({ name: 'Style' }),              // Should be Variant
}
```

## Styling

### Use Site Variables

Connect to Webflow's design system:

```css
/* ✅ Good - Uses site variables */
.button {
  background-color: var(--colors-primary, #007bff);
  padding: var(--spacing-md, 16px);
  border-radius: var(--radii-md, 4px);
  font-family: var(--fonts-body, sans-serif);
}

/* ❌ Hardcoded values */
.button {
  background-color: #007bff;
  padding: 16px;
  border-radius: 4px;
  font-family: Arial;
}
```

### Always Provide Fallbacks

Ensure components work even without site variables:

```css
/* ✅ Good - Has fallback */
color: var(--text-color, #000000);

/* ❌ Could be undefined */
color: var(--text-color);
```

### Use CSS Modules

Prevent style conflicts with scoped styles:

```tsx
// ✅ Good - Scoped
import styles from './Button.module.css';
<button className={styles.button}>{text}</button>

// ❌ Global namespace pollution
import './Button.css';
<button className="button">{text}</button>
```

### Respect User Preferences

Support accessibility preferences:

```css
/* Respect reduced motion */
.animated {
  transition: transform 0.3s ease;
}

@media (prefers-reduced-motion: reduce) {
  .animated {
    transition: none;
  }
}

/* Support dark mode */
.card {
  background-color: var(--card-bg, #ffffff);
  color: var(--card-text, #000000);
}
```

### Mobile-First Responsive Design

Start with mobile and enhance:

```css
/* ✅ Good - Mobile first */
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

## Performance

### Minimize Bundle Size

Keep your component library lightweight:

```tsx
// ✅ Good - Only import what you need
import { useState } from 'react';

// ❌ Imports entire library
import _ from 'lodash';

// ✅ Better - Import specific function
import debounce from 'lodash/debounce';
```

### Use React.memo for Expensive Components

Prevent unnecessary re-renders:

```tsx
// ✅ Good - Memoized
import { memo } from 'react';

export const ExpensiveChart = memo(({ data }: ChartProps) => {
  // Complex rendering logic
  return <div>{/* Chart */}</div>;
});

// ❌ Re-renders on every parent update
export const ExpensiveChart = ({ data }: ChartProps) => {
  // Complex rendering logic
  return <div>{/* Chart */}</div>;
};
```

### Clean Up Side Effects

Always clean up event listeners and timers:

```tsx
// ✅ Good - Proper cleanup
useEffect(() => {
  const handler = () => { /* ... */ };
  window.addEventListener('scroll', handler);
  return () => window.removeEventListener('scroll', handler);
}, []);

// ❌ Memory leak
useEffect(() => {
  window.addEventListener('scroll', () => { /* ... */ });
}, []);
```

### Lazy Load Heavy Features

Use dynamic imports for large dependencies:

```tsx
// ✅ Good - Lazy loaded
import { lazy, Suspense } from 'react';

const HeavyChart = lazy(() => import('./HeavyChart'));

export const ChartWrapper = (props: ChartProps) => {
  return (
    <Suspense fallback={<div>Loading chart...</div>}>
      <HeavyChart {...props} />
    </Suspense>
  );
};

// ❌ Always loaded (even if not shown)
import { HeavyChart } from './HeavyChart';
```

### Optimize Images

Handle images efficiently:

```tsx
// ✅ Good - Optimized
<img
  src={imageUrl}
  alt={alt}
  loading="lazy"
  decoding="async"
  onError={(e) => {
    e.currentTarget.src = '/placeholder.png';
  }}
/>

// Add responsive images
<img
  srcSet={`
    ${imageUrl}?w=400 400w,
    ${imageUrl}?w=800 800w,
    ${imageUrl}?w=1200 1200w
  `}
  sizes="(max-width: 768px) 100vw, 50vw"
  src={imageUrl}
  alt={alt}
/>
```

## Data Fetching

### Handle All States

Always manage loading, error, and empty states:

```tsx
// ✅ Good - All states handled
export const DataComponent = ({ apiUrl }: Props) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl]);

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!data || data.length === 0) return <EmptyState />;

  return <DataDisplay data={data} />;
};

// ❌ Missing states
export const DataComponent = ({ apiUrl }: Props) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(apiUrl).then(res => res.json()).then(setData);
  }, [apiUrl]);

  return <div>{data.map(/* ... */)}</div>;
};
```

### Use Abort Controller

Cancel requests when component unmounts:

```tsx
// ✅ Good - Cancels on unmount
useEffect(() => {
  const controller = new AbortController();

  fetch(apiUrl, { signal: controller.signal })
    .then(res => res.json())
    .then(setData)
    .catch(err => {
      if (err.name !== 'AbortError') {
        setError(err.message);
      }
    });

  return () => controller.abort();
}, [apiUrl]);

// ❌ Request continues after unmount
useEffect(() => {
  fetch(apiUrl)
    .then(res => res.json())
    .then(setData);
}, [apiUrl]);
```

### Validate API Responses

Never trust external data:

```tsx
// ✅ Good - Validates response
const data = await response.json();

if (!Array.isArray(data.items)) {
  throw new Error('Invalid response format');
}

if (!data.items.every(item => item.id && item.name)) {
  throw new Error('Missing required fields');
}

// ❌ Assumes valid structure
const data = await response.json();
data.items.map(item => item.name);  // Could crash
```

## Accessibility

### Use Semantic HTML

Choose appropriate HTML elements:

```tsx
// ✅ Good - Semantic
<article className={styles.card}>
  <h2>{title}</h2>
  <p>{description}</p>
  <button onClick={handleClick}>Learn More</button>
</article>

// ❌ Non-semantic
<div className={styles.card}>
  <div>{title}</div>
  <div>{description}</div>
  <div onClick={handleClick}>Learn More</div>
</div>
```

### Add ARIA Labels

Provide context for screen readers:

```tsx
// ✅ Good - Accessible
<button
  onClick={onClose}
  aria-label="Close dialog"
>
  ×
</button>

<img
  src={imageUrl}
  alt={`Photo of ${productName}`}
/>

// ❌ No context
<button onClick={onClose}>×</button>
<img src={imageUrl} />
```

### Support Keyboard Navigation

Make interactive elements keyboard accessible:

```tsx
// ✅ Good - Keyboard accessible
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  Click me
</div>

// ❌ Not keyboard accessible
<div onClick={handleClick}>Click me</div>
```

### Ensure Color Contrast

Use sufficient contrast ratios:

```css
/* ✅ Good - High contrast */
.button {
  background-color: #0066cc;
  color: #ffffff;
}

/* ❌ Poor contrast */
.button {
  background-color: #cccccc;
  color: #d0d0d0;
}
```

## Error Handling

### Provide Clear Error Messages

Help users understand what went wrong:

```tsx
// ✅ Good - Specific message
catch (error) {
  if (error.response?.status === 404) {
    setError('Data not found. Please check your API URL.');
  } else if (error.response?.status === 429) {
    setError('Too many requests. Please try again later.');
  } else {
    setError('Failed to load data. Please try again.');
  }
}

// ❌ Generic message
catch (error) {
  setError('Error');
}
```

### Use Error Boundaries

Catch errors in component tree:

```tsx
// ErrorBoundary.tsx
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. Please refresh the page.</div>;
    }

    return this.props.children;
  }
}

// Usage
<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```

## Designer Environment Detection

### Why Detection Is Needed

Interactive components (modals, dropdowns, tooltips, etc.) can trap designers in the Webflow Designer canvas. When designers click trigger buttons to select or edit them, the component's functionality activates instead - opening a modal they can't close, showing a dropdown that blocks the interface, etc.

**The Problem:**
```tsx
// ❌ This modal opens when designer clicks trigger button
useEffect(() => {
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-modal-trigger]');
    if (trigger) {
      openModal();  // Traps designer in modal!
    }
  });
}, []);
```

### Why `showInDesigner` Prop Isn't Enough

Many components have a `showInDesigner` prop to show the component in the Designer for editing. However, this only controls **visibility**, not **functionality**:

```tsx
// ❌ showInDesigner shows modal, but interactions still work
interface Props {
  showInDesigner?: boolean;  // Controls display only
}

// Modal is visible for editing, BUT:
// - Clicking triggers still opens modal
// - Event listeners are still attached
// - Designers get trapped
```

### The Solution: useWebflowContext Hook

Use Webflow's official `useWebflowContext()` hook to detect the current environment:

```tsx
import { useWebflowContext } from '@webflow/react';

export const Modal = ({ id, showInDesigner }: ModalProps) => {
  const { mode } = useWebflowContext();

  // Detect current environment
  const isInDesignerCanvas = mode === 'design';
  const isInPreviewMode = mode === 'preview';

  // Disable interactions in Designer canvas
  useEffect(() => {
    if (isInDesignerCanvas) return; // ✅ Don't attach listeners

    const handleTriggerClick = (e: MouseEvent) => {
      const trigger = e.target.closest(`[data-modal-trigger="${id}"]`);
      if (trigger) openModal();
    };

    document.addEventListener('click', handleTriggerClick);
    return () => document.removeEventListener('click', handleTriggerClick);
  }, [id, isInDesignerCanvas]);

  return <div>...</div>;
};
```

### Available Modes

The `mode` property from `useWebflowContext()` returns:
- `"design"` - Designer canvas/edit mode (block interactions)
- `"preview"` - Designer preview mode (allow interactions)
- `"build"`, `"edit"`, `"publish"`, `"comment"`, `"analyze"` - Other modes
- `undefined` - Published site (allow interactions)

### What to Disable in Designer Canvas

When `mode === 'design'`:
- ✅ Disable event listeners (click, keydown, scroll)
- ✅ Disable user-triggered actions
- ✅ Disable focus trapping
- ✅ Disable scroll blocking
- ✅ Disable URL hash changes

### What NOT to Disable

Keep working for editing:
- ✅ Component rendering
- ✅ `showInDesigner` visibility control
- ✅ Static styling
- ✅ Layout
- ✅ CSS animations/transitions

### Complete Example

Full implementation with `useWebflowContext()`:

```tsx
import { useState, useEffect } from 'react';
import { useWebflowContext } from '@webflow/react';

export const Modal = ({ id, showInDesigner }: ModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mode } = useWebflowContext();

  const isInDesignerCanvas = mode === 'design';

  // Open/close functions (auto-blocked in canvas)
  const openModal = () => {
    if (isInDesignerCanvas) return;
    setIsOpen(true);
  };

  const closeModal = () => {
    if (isInDesignerCanvas) return;
    setIsOpen(false);
  };

  // Trigger clicks - disabled in canvas
  useEffect(() => {
    if (isInDesignerCanvas) return;

    const handleClick = (e: MouseEvent) => {
      const trigger = e.target.closest(`[data-modal-trigger="${id}"]`);
      if (trigger) {
        e.preventDefault();
        openModal();
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [id, isInDesignerCanvas]);

  // ESC key - disabled in canvas
  useEffect(() => {
    if (!isOpen || isInDesignerCanvas) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isInDesignerCanvas]);

  // Show in designer or when open
  const shouldShow = showInDesigner || isOpen;

  return (
    <div style={{ display: shouldShow ? 'block' : 'none' }}>
      {/* Modal content */}
    </div>
  );
};
```

### Key Benefits

**Official API:**
- ✅ Built specifically for mode detection
- ✅ Maintained by Webflow
- ✅ Automatically updates on mode changes

**Automatic Reactivity:**
- ✅ Component re-renders when mode changes
- ✅ No manual polling or URL checking
- ✅ No stale closure issues

**Simple & Reliable:**
- ✅ One line to detect mode
- ✅ Works in Canvas, Preview, and Published
- ✅ Much cleaner than iframe detection

### Key Takeaways

**Do:**
- ✅ Use `useWebflowContext()` for mode detection
- ✅ Check `mode === 'design'` to detect canvas
- ✅ Disable ALL event listeners when in canvas
- ✅ Keep `showInDesigner` for visibility control
- ✅ Add `isInDesignerCanvas` to useEffect dependencies

**Don't:**
- ❌ Don't use iframe detection or URL polling
- ❌ Don't rely only on `showInDesigner` for behavior
- ❌ Don't disable rendering/styling in Designer
- ❌ Don't forget to guard helper functions

## Testing

### Test Components in Isolation

Test each component independently:

```tsx
// ✅ Good - Isolated test
describe('Button', () => {
  it('renders text correctly', () => {
    render(<Button text="Click me" variant="primary" />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button text="Click" onClick={handleClick} />);

    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Test Edge Cases

Cover unusual scenarios:

```tsx
describe('ImageGallery', () => {
  it('handles empty array', () => {
    render(<ImageGallery images={[]} />);
    expect(screen.getByText('No images')).toBeInTheDocument();
  });

  it('handles broken image URLs', () => {
    render(<ImageGallery images={['https://broken.url/image.jpg']} />);
    // Test fallback behavior
  });
});
```

## Documentation

### Add JSDoc Comments

Document complex components:

```tsx
/**
 * A flexible card component for displaying content.
 *
 * @example
 * ```tsx
 * <Card
 *   title="My Card"
 *   description="Card description"
 *   variant="elevated"
 * />
 * ```
 */
export interface CardProps {
  /** The card title */
  title: string;
  /** The card description */
  description: string;
  /** Visual style variant */
  variant: 'elevated' | 'flat';
}
```

### Include Usage Examples

Show designers how to use components:

```tsx
/**
 * ═══════════════════════════════════════════════════════════════
 * 🎯 HOW TO USE THIS COMPONENT
 * ═══════════════════════════════════════════════════════════════
 *
 * 1. Add the component to your canvas
 * 2. Configure the props in the right panel:
 *    - Title: Main heading text
 *    - Description: Supporting text
 *    - Variant: Choose 'elevated' for shadow or 'flat' for border
 *
 * 3. Optional: Add content to the slot
 *
 * ═══════════════════════════════════════════════════════════════
 */
```

## Version Control

### Use Meaningful Commit Messages

```bash
# ✅ Good
git commit -m "Add loading state to ProductList component"
git commit -m "Fix button hover color in dark mode"

# ❌ Unclear
git commit -m "Update component"
git commit -m "Fix bug"
```

### Tag Releases

```bash
git tag -a v1.2.0 -m "Add dark mode support"
git push --tags
```

## Summary Checklist

Before importing a component:

- [ ] TypeScript types defined
- [ ] Default values provided
- [ ] Props have clear names and tooltips
- [ ] Styles use site variables with fallbacks
- [ ] Loading and error states handled
- [ ] Accessibility features implemented
- [ ] Performance optimized
- [ ] Edge cases handled
- [ ] Documentation added
- [ ] Tested in multiple browsers
- [ ] Bundle size checked

## Next Steps

- **[Getting Started](./getting-started.md)** - Create your first component
- **[Component Declaration](./component-declaration.md)** - Define components properly
- **[Troubleshooting](./troubleshooting.md)** - Fix common issues
