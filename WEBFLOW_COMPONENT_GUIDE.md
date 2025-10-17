# Creating Webflow Components from React Components

A comprehensive, production-tested guide to building React code components for Webflow. This guide is based on real-world implementation patterns and solutions to actual issues encountered when building Webflow code components.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
3. [Component Structure](#component-structure)
4. [The Two Styling Approaches](#the-two-styling-approaches)
   - [Approach 1: CSS Variables (Inherited)](#approach-1-css-variables-inherited-from-webflow)
   - [Approach 2: Component Props](#approach-2-component-props-interface-properties)
   - [Hybrid Approach](#hybrid-approach-best-of-both-worlds)
5. [Critical Issues & Solutions](#critical-issues--solutions)
6. [Component Options Reference](#component-options-reference)
7. [Shadow DOM Deep Dive](#shadow-dom-deep-dive)
8. [Available Prop Types](#available-prop-types)
9. [Using Slots and Collection Lists](#using-slots-and-collection-lists)
10. [Advanced Patterns](#advanced-patterns)
11. [Real-World Examples](#real-world-examples)
12. [Testing Your Components](#testing-your-components)
13. [Publishing to Webflow](#publishing-to-webflow)
14. [Troubleshooting](#troubleshooting)
15. [Best Practices Checklist](#best-practices-checklist)
16. [Quick Reference](#quick-reference)

---

## Prerequisites

Before you start, ensure you have:

- **Webflow Account**: Either a Workspace on Freelancer, Core, Growth, Agency, or Enterprise plan, OR a Webflow site with a CMS, Business, or Enterprise plan
- **Node.js 20+** and **npm 10+** installed
- **Basic knowledge** of React components and TypeScript
- **A Webflow site** where you can test components

---

## Project Setup

### 1. Create or Configure Your React Project

If starting fresh:

```bash
npx create-react-app code-components
cd code-components
```

### 2. Install Webflow Dependencies

```bash
npm install @webflow/react @webflow/data-types
```

### 3. Create webflow.json Configuration

Create a `webflow.json` file in your project root:

```json
{
  "library": {
    "name": "Your Component Library Name",
    "components": ["./src/**/*.webflow.@(js|jsx|mjs|ts|tsx)"]
  }
}
```

This configuration tells Webflow where to find your component definitions. The glob pattern will automatically detect any files ending with `.webflow.tsx` or `.webflow.jsx`.

---

## Component Structure

Your project should follow this structure:

```
src/
├── component/
│   ├── YourComponent.tsx          # Your React component
│   ├── YourComponent.css          # Component styles
│   └── YourComponent.webflow.tsx  # Webflow component definition
webflow.json                          # Webflow configuration
```

### Basic Component Example

```tsx
// component/Badge.tsx
import React from 'react';
import './Badge.css';

interface BadgeProps {
  text: string;
  variant: 'Light' | 'Dark';
}

export const Badge: React.FC<BadgeProps> = ({ text, variant }) => (
  <span className={`badge badge--${variant.toLowerCase()}`}>
    {text}
  </span>
);
```

### Basic Webflow Definition

```tsx
// Badge.webflow.tsx
import { Badge } from './Badge';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

export default declareComponent(Badge, {
  name: 'Badge',
  description: 'A badge with variants',
  group: 'Info',
  props: {
    text: props.Text({
      name: "Text",
      defaultValue: "Hello World",
    }),
    variant: props.Variant({
      name: "Variant",
      options: ["Light", "Dark"],
      defaultValue: "Light",
    }),
  },
  options: {
    applyTagSelectors: false,
    ssr: true,
  },
});
```

---

## The Two Styling Approaches

**Key Insight from Webflow**: There are two official, recommended approaches to styling Webflow code components. Understanding when to use each is critical for building maintainable components.

### Decision Matrix: Which Approach to Use?

| Use Case | Recommended Approach | Reason |
|----------|---------------------|---------|
| Brand colors, spacing, typography | CSS Variables | Centralized design system, easy global updates |
| Dynamic content styling | Component Props | Direct control, discoverable in UI |
| Advanced theming | CSS Variables | Designers can override without touching code |
| Animation parameters | Component Props | Clear controls, validation with min/max |
| Layout options | Component Props | Explicit options in dropdown |
| Responsive sizing | CSS Variables | Consistent across site |

---

### Approach 1: CSS Variables (Inherited from Webflow)

**Official Recommendation**: Use CSS Variables for design tokens like colors, spacing, and typography.

#### How It Works

CSS variables defined at the `:root` level in Webflow's Variables panel **automatically inherit** through Shadow DOM boundaries. This is confirmed by Webflow's official documentation.

#### Setting Up CSS Variables

**In Webflow Designer:**

1. Open your Webflow project
2. Go to **Style Panel** → **Variables** (or Project Settings → Variables)
3. Create variables for your component:
   - `--faq-question-color` → `#1a1a1a`
   - `--faq-question-font-size` → `18px`
   - `--faq-answer-color` → `#666666`
   - `--faq-border-radius` → `8px`
4. Use "Copy CSS" from the three-dot menu to get exact variable names

**In Your Component CSS:**

```css
/* FAQ.css */

/* ⚠️ CRITICAL: Do NOT define :host variables here!
   They will override inherited :root values from Webflow.
   Instead, use fallback values directly in var() declarations. */

.faq__item {
  border: 1px solid var(--faq-toggle-border-color, #e5e5e5);
  border-radius: var(--faq-border-radius, 0px);
}

.faq__trigger [data-faq-question] {
  font-family: var(--faq-question-font-family, inherit);
  font-size: var(--faq-question-font-size, inherit);
  font-weight: var(--faq-question-font-weight, inherit);
  color: var(--faq-question-color, #000000);
  padding: var(--faq-question-padding, 16px);
}

.faq__answer {
  color: var(--faq-answer-color, #000000);
  font-size: var(--faq-answer-font-size, 16px);
  padding: var(--faq-answer-padding, 0 16px 16px 16px);
}
```

**In Your Component:**

```tsx
// FAQ.tsx - No style props needed!
interface FAQProps {
  type?: 'single' | 'multiple';
  defaultOpenIndex?: number;
  children?: any;
  // No backgroundColor, textColor, fontSize props!
}

const FAQ = ({ type = 'single', defaultOpenIndex = 0, children }: FAQProps) => {
  // Component logic...
  return (
    <div className="faq">
      {/* Styles come from CSS variables, not props */}
    </div>
  );
};
```

#### Real-World Example: FAQ Component

This is from an actual production component in this project:

```tsx
// FAQ.webflow.tsx
export default declareComponent(FAQ, {
  name: 'FAQ Accordion',
  description: 'An accessible accordion. Styling is controlled via Webflow CSS Variables.',
  group: 'Interactive',
  props: {
    // Behavior props only - no styling props!
    children: props.Slot({
      name: 'FAQ Items',
      tooltip: 'Add a Collection List with data-faq-question and data-faq-answer attributes.'
    }),
    type: props.Text({
      name: 'Accordion Type',
      defaultValue: 'single',
    }),
    animationDuration: props.Number({
      name: 'Animation Speed',
      defaultValue: 0.3,
      min: 0.1,
      max: 2,
    })
  },
  options: {
    applyTagSelectors: false,
    ssr: false
  }
});
```

#### Pros & Cons

**✅ Pros:**
- Clean separation of concerns (design vs behavior)
- Centralized design system
- Designers can update colors/spacing globally without touching component code
- Less prop clutter in component interface
- Inherits from Webflow's design system automatically

**❌ Cons:**
- Requires users to know CSS variable names
- Not discoverable in component properties panel
- Requires documentation to explain which variables are available
- Users must go to Variables panel separately

**When to Use:**
- Brand colors, background colors, text colors
- Spacing (padding, margin, gap)
- Typography (font-family, font-size, font-weight)
- Border radius, borders
- Any value that should be consistent across multiple components

---

### Approach 2: Component Props (Interface Properties)

**Official Recommendation**: Use component props for dynamic content and behavior.

#### How It Works

Accept styling values as props in your component's interface, making them visible and configurable in Webflow's properties panel.

#### Implementation

```tsx
// Particles.tsx
interface ParticlesProps {
  particleCount?: number;
  particleBaseSize?: number;
  itemBackgroundColor?: string;  // Style prop
  borderRadius?: string;          // Style prop
}

const Particles: React.FC<ParticlesProps> = ({
  particleCount = 200,
  particleBaseSize = 100,
  itemBackgroundColor = '#111',
  borderRadius = '10px'
}) => {
  return (
    <div
      className="particle-item"
      style={{
        backgroundColor: itemBackgroundColor,
        borderRadius: borderRadius
      }}
    >
      {/* Component content */}
    </div>
  );
};
```

```tsx
// Particles.webflow.tsx
export default declareComponent(Particles, {
  name: 'Particles Background',
  description: 'WebGL particle system with customizable colors',
  group: 'Interactive',
  props: {
    particleCount: props.Number({
      name: 'Particle Count',
      defaultValue: 200,
      min: 10,
      max: 1000,
      group: 'Content'
    }),
    itemBackgroundColor: props.Text({
      name: 'Background Color',
      defaultValue: '#111',
      group: 'Style',
      tooltip: 'Hex color for particle background'
    }),
    borderRadius: props.Text({
      name: 'Border Radius',
      defaultValue: '10px',
      group: 'Style',
      tooltip: 'CSS border-radius value'
    })
  },
  options: {
    applyTagSelectors: false,
    ssr: false
  }
});
```

#### Organizing Props

Use the `group` parameter to organize props into logical sections:

```tsx
props: {
  // Content group
  particleCount: props.Number({
    name: 'Particle Count',
    defaultValue: 200,
    group: 'Content'
  }),

  // Style group
  backgroundColor: props.Text({
    name: 'Background Color',
    defaultValue: '#000',
    group: 'Style'
  }),

  // Animation group
  speed: props.Number({
    name: 'Speed',
    defaultValue: 0.1,
    group: 'Animation'
  })
}
```

#### Pros & Cons

**✅ Pros:**
- Discoverable in Webflow UI - users see all options
- Clear documentation with tooltips
- Type-safe with validation (min/max for numbers)
- Organized into groups
- Immediate visual feedback

**❌ Cons:**
- Can clutter the interface with many props
- Harder to maintain design system consistency
- Each component defines its own colors (no central theme)
- More props to manage and document

**When to Use:**
- Animation parameters (speed, duration, delay)
- Content configuration (count, size, layout)
- Component-specific styling that shouldn't be global
- When you need validation (min/max values)
- When discoverability is more important than centralization

---

### Hybrid Approach: Best of Both Worlds

**Recommended Pattern**: Combine both approaches for maximum flexibility.

#### Strategy

1. **Use Props for**: Primary controls, behavior, content configuration
2. **Use CSS Variables for**: Colors, spacing, typography, global design tokens
3. **Document both**: Explain which variables are available for advanced theming

#### Real Example: GridMotion Component

From this project - notice how it combines both approaches:

```tsx
// GridMotion.webflow.tsx
export default declareComponent(GridMotion, {
  name: 'Tilted Image Grid',
  description: 'Interactive 4×7 grid that reacts to mouse. Uses CSS variables for item styling.',
  group: 'Interactive',
  props: {
    // SLOT: For Collection List (primary UX)
    children: props.Slot({
      name: 'Images',
      tooltip: 'Add a Collection List with images here.'
    }),

    // PROPS: Animation behavior (not themeable)
    rotationAngle: props.Number({
      name: 'Rotation Angle',
      defaultValue: -15,
      min: -45,
      max: 45,
      group: 'Animation'
    }),
    maxMoveAmount: props.Number({
      name: 'Movement Intensity',
      defaultValue: 300,
      min: 0,
      max: 1000,
      group: 'Animation'
    }),

    // PROPS: Fallback styling (for initial setup)
    gradientColor: props.Text({
      name: 'Gradient Color',
      defaultValue: 'black',
      group: 'Style',
      tooltip: 'Background gradient. Can also use --grid-gradient-color variable.'
    }),
    itemBackgroundColor: props.Text({
      name: 'Item Background',
      defaultValue: '#111',
      group: 'Style',
      tooltip: 'Card background. Can also use --grid-item-bg variable.'
    })
  }
});
```

**CSS allows override via variables:**

```css
/* GridMotion.css */
.grid-item {
  /* Props provide defaults, CSS variables can override */
  background-color: var(--grid-item-bg, var(--item-bg-from-props));
  border-radius: var(--grid-item-radius, 10px);
}
```

**Component applies both:**

```tsx
// GridMotion.tsx
const GridMotion = ({
  itemBackgroundColor = '#111',
  borderRadius = '10px',
  ...otherProps
}) => {
  return (
    <div
      className="grid-item"
      style={{
        // Props set CSS custom properties
        ['--item-bg-from-props' as any]: itemBackgroundColor,
        borderRadius: borderRadius
      }}
    >
      {/* Content */}
    </div>
  );
};
```

#### Benefits of Hybrid

- ✅ Works out-of-the-box with prop defaults
- ✅ Advanced users can override with CSS variables
- ✅ Discoverability via props panel
- ✅ Global theming via variables panel
- ✅ Flexibility for different user skill levels

---

## Critical Issues & Solutions

These are **real issues** encountered in production. Understanding these will save you hours of debugging.

### Issue 1: Mouse Event Handling in Webflow

**Problem:** Container-level mouse events (`mousemove`, `mouseenter`, etc.) don't fire reliably in Webflow due to Shadow DOM, z-index stacking, and element layering.

**Symptoms:**
- Mouse tracking works in local dev but breaks in Webflow
- Events fire inconsistently or not at all
- Movement detection is laggy or missing

**❌ What Doesn't Work:**

```tsx
// DON'T DO THIS - unreliable in Webflow
useEffect(() => {
  const container = containerRef.current;
  if (!container) return;

  const handleMouseMove = (e: MouseEvent) => {
    // This may not fire reliably in Webflow!
    const x = e.clientX;
    const y = e.clientY;
  };

  container.addEventListener('mousemove', handleMouseMove);

  return () => {
    container.removeEventListener('mousemove', handleMouseMove);
  };
}, []);
```

**✅ What Works:**

```tsx
// DO THIS - use window-level listeners
useEffect(() => {
  const container = containerRef.current;
  if (!container) return;

  const handleMouseMove = (e: PointerEvent) => {
    // Calculate relative position to container
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;  // Normalized -1 to 1
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

    // Clamp values to prevent extreme movements
    const clampedX = Math.max(-1, Math.min(1, x));
    const clampedY = Math.max(-1, Math.min(1, y));

    // Use normalized coordinates
    updatePosition(clampedX, clampedY);
  };

  // Attach to window, not container
  window.addEventListener('pointermove', handleMouseMove);

  return () => {
    window.removeEventListener('pointermove', handleMouseMove);
  };
}, []);
```

**Key Points:**
- Use `window.addEventListener` instead of container-level listeners
- Use `pointermove` (modern) instead of `mousemove`
- Calculate relative coordinates using `getBoundingClientRect()`
- Always clamp normalized values to prevent edge cases

**Real Example:** See [Particles.tsx:166-176](src/components/Particles.tsx#L166-L176)

---

### Issue 2: Mouse Enter/Leave Tracking

**Problem:** Components continue animating or updating even when the mouse is outside the component area, causing unnecessary performance overhead and incorrect behavior.

**Symptoms:**
- Animations run constantly even when mouse is far away
- High CPU usage
- Particles/elements move when they shouldn't

**❌ What Doesn't Work:**

```tsx
// Mouse tracking runs all the time, even when mouse is not over component
useEffect(() => {
  const handleMouseMove = (e: PointerEvent) => {
    // This runs constantly, consuming resources
    updateAnimation(e.clientX, e.clientY);
  };

  window.addEventListener('pointermove', handleMouseMove);

  return () => {
    window.removeEventListener('pointermove', handleMouseMove);
  };
}, []);
```

**✅ What Works:**

```tsx
// Track when mouse enters/leaves component area
const isMouseInsideRef = useRef(false);

useEffect(() => {
  const container = containerRef.current;
  if (!container) return;

  const handleMouseEnter = () => {
    isMouseInsideRef.current = true;
  };

  const handleMouseLeave = () => {
    isMouseInsideRef.current = false;
    // Reset to default state when mouse leaves
    resetToCenter();
  };

  const handleMouseMove = (e: PointerEvent) => {
    // Only process if mouse is inside component
    if (!isMouseInsideRef.current) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    updateAnimation(x, y);
  };

  // Enter/leave listeners on container (these work fine)
  container.addEventListener('mouseenter', handleMouseEnter);
  container.addEventListener('mouseleave', handleMouseLeave);

  // Move listener on window (for reliable tracking)
  window.addEventListener('pointermove', handleMouseMove);

  return () => {
    container.removeEventListener('mouseenter', handleMouseEnter);
    container.removeEventListener('mouseleave', handleMouseLeave);
    window.removeEventListener('pointermove', handleMouseMove);
  };
}, []);
```

**Key Points:**
- Use a ref to track mouse inside/outside state
- `mouseenter` and `mouseleave` work reliably on container
- Early return in `mousemove` handler if mouse is outside
- Reset state when mouse leaves (prevents stuck states)
- Significantly improves performance

**Real Example:** See [DotGrid.tsx:297-307](src/components/DotGrid.tsx#L297-L307)

---

### Issue 3: Shadow DOM Slot Content Extraction

**Problem:** Collection List content placed in a slot is not accessible via normal DOM queries due to Shadow DOM encapsulation.

**Symptoms:**
- `querySelector('img')` returns empty array
- Content exists visually but can't be accessed programmatically
- State never updates with extracted content

**❌ What Doesn't Work:**

```tsx
// Direct queries don't see slotted content
const slotRef = useRef(null);

useEffect(() => {
  // This won't find slotted content!
  const images = slotRef.current.querySelectorAll('img');
  console.log(images.length); // 0 (even if images are visible)
}, [children]);
```

**✅ What Works - Multi-Strategy Extraction:**

```tsx
const slotRef = useRef(null);
const [extractedImages, setExtractedImages] = useState<string[]>([]);

useEffect(() => {
  const extractImages = () => {
    if (!slotRef.current) return;

    let searchContainer: HTMLElement | null = null;

    // STRATEGY 1: Find slot element in Shadow DOM
    let slotElement = slotRef.current.querySelector('slot');

    // STRATEGY 2: Try shadow root if direct query fails
    if (!slotElement && slotRef.current.getRootNode) {
      const root: any = slotRef.current.getRootNode();
      if (root && root.host) {
        slotElement = root.querySelector('slot[name="children"]') || root.querySelector('slot');
      }
    }

    if (slotElement) {
      // STRATEGY 3: Use assignedElements to get slotted content
      const assignedElements = (slotElement as any).assignedElements?.({ flatten: true }) || [];
      const imgElements: HTMLImageElement[] = [];

      // STRATEGY 4: Search within assigned elements
      assignedElements.forEach((element: any) => {
        if (element.tagName === 'IMG') {
          // Direct image
          imgElements.push(element as HTMLImageElement);
        } else {
          // Search for images within Collection List items
          const imgs: NodeListOf<HTMLImageElement> = element.querySelectorAll('img');
          Array.from(imgs).forEach(img => imgElements.push(img));
        }
      });

      const imageUrls = imgElements.map(img => img.src).filter(src => src);
      if (imageUrls.length > 0) {
        setExtractedImages(imageUrls);
      }
    } else {
      // STRATEGY 5: Fallback to regular DOM (non-Shadow environments)
      const imgElements = slotRef.current.querySelectorAll('img');
      const imageUrls = Array.from(imgElements).map((img: any) => img.src).filter((src: string) => src);
      if (imageUrls.length > 0) {
        setExtractedImages(imageUrls);
      }
    }
  };

  // STRATEGY 6: Try immediately
  extractImages();

  // STRATEGY 7: Try with increasing delays (DOM may not be ready)
  const timeout1 = setTimeout(extractImages, 100);
  const timeout2 = setTimeout(extractImages, 300);
  const timeout3 = setTimeout(extractImages, 1000);

  // STRATEGY 8: Listen for slot changes
  if (slotRef.current) {
    const slotElement = slotRef.current.querySelector('slot');
    if (slotElement) {
      const handleSlotChange = () => extractImages();
      (slotElement as any).addEventListener?.('slotchange', handleSlotChange);

      return () => {
        clearTimeout(timeout1);
        clearTimeout(timeout2);
        clearTimeout(timeout3);
        (slotElement as any).removeEventListener?.('slotchange', handleSlotChange);
      };
    }
  }

  return () => {
    clearTimeout(timeout1);
    clearTimeout(timeout2);
    clearTimeout(timeout3);
  };
}, [children]);
```

**Key Points:**
- Query for `<slot>` element, not for content directly
- Use `assignedElements({ flatten: true })` to get slotted content
- Try multiple approaches (shadow root, regular DOM)
- Use multiple timeouts (100ms, 300ms, 1000ms) - content may not be ready immediately
- Listen for `slotchange` events to catch dynamic updates
- Always filter out empty/undefined values

**Real Example:** See [GridMotion.tsx:46-120](src/components/GridMotion.tsx#L46-L120)

---

### Issue 4: Prop Type Limitations

**Problem:** Webflow doesn't provide native Boolean, Array, or Color picker prop types.

**Symptoms:**
- `props.Boolean()` throws error or doesn't exist
- No way to pass arrays
- Can't validate colors

**✅ Workaround Patterns:**

#### Boolean Props

```tsx
// ✅ In .webflow.tsx
moveOnHover: props.Text({
  name: 'Move On Hover',
  defaultValue: '0',  // "0" = false, "1" = true
  tooltip: 'Set to 1 to enable, 0 to disable'
})

// ✅ In .tsx (component)
interface MyComponentProps {
  moveOnHover?: boolean | string;  // Accept both types
}

const MyComponent = ({ moveOnHover = false }: MyComponentProps) => {
  // Parse string to boolean
  const parsedMoveOnHover = typeof moveOnHover === 'string'
    ? moveOnHover === '1'
    : moveOnHover;

  if (parsedMoveOnHover) {
    // Use boolean value
  }
};
```

#### Array Props (Colors, Lists)

```tsx
// ✅ In .webflow.tsx
particleColors: props.Text({
  name: 'Particle Colors',
  defaultValue: '#ffffff,#ff0000,#00ff00',
  tooltip: 'Comma-separated hex colors'
})

// ✅ In .tsx (component)
interface MyComponentProps {
  particleColors?: string | string[];  // Accept both types
}

const MyComponent = ({ particleColors }: MyComponentProps) => {
  // Parse comma-separated string to array
  const parsedColors = typeof particleColors === 'string'
    ? particleColors.split(',').map(c => c.trim()).filter(Boolean)
    : particleColors;

  parsedColors?.forEach(color => {
    // Use array of colors
  });
};
```

**Real Example:** See [Particles.tsx:119-125](src/components/Particles.tsx#L119-L125)

---

### Issue 5: SSR and Browser APIs

**Problem:** Components using browser-only APIs (WebGL, Canvas, `window`, `document`) crash during server-side rendering.

**Symptoms:**
- `window is not defined` errors
- `document is not defined` errors
- Canvas/WebGL context errors during build

**✅ Solution:**

```tsx
// In .webflow.tsx
export default declareComponent(MyComponent, {
  name: 'My Component',
  options: {
    ssr: false  // Disable server-side rendering
  }
});
```

**When to Disable SSR:**
- WebGL components (three.js, OGL, etc.)
- Canvas-based animations
- Components using `window`, `document`, `localStorage`
- Real-time data components
- User-specific dashboards

**When to Keep SSR Enabled:**
- Static content components
- SEO-important content
- Components that benefit from initial HTML

**Real Example:** All interactive components in this project have `ssr: false`

---

## Component Options Reference

Configure component behavior with the `options` object in your Webflow declaration.

### Available Options

```tsx
export default declareComponent(MyComponent, {
  name: 'My Component',
  description: 'Component description',
  group: 'Category',
  props: { /* ... */ },
  options: {
    // Server-side rendering
    ssr: false,

    // Tag selector inheritance
    applyTagSelectors: false,
  }
});
```

---

### `ssr: boolean`

**Default:** `true`

Controls whether the component is server-side rendered.

**Set to `false` when:**
- Component uses `window`, `document`, `localStorage`, `sessionStorage`
- Component uses browser APIs: Canvas, WebGL, Web Audio, Geolocation
- Component uses third-party libraries that require browser environment
- Component has user-specific content that shouldn't be in initial HTML
- Component is purely interactive with no SEO benefit

**Set to `true` (default) when:**
- Component renders static content
- Component benefits from initial HTML for SEO
- Component doesn't use browser-specific APIs
- First paint performance matters

```tsx
// Example: WebGL component (requires browser)
export default declareComponent(Particles, {
  name: 'Particles',
  options: {
    ssr: false  // Uses WebGL - browser only
  }
});

// Example: Static content component
export default declareComponent(Badge, {
  name: 'Badge',
  options: {
    ssr: true  // Can render on server
  }
});
```

---

### `applyTagSelectors: boolean`

**Default:** `false`

Controls whether Webflow's site-wide tag selectors (styles applied to `h1`, `p`, `button`, etc.) should automatically apply to your component's HTML tags.

**Set to `false` (default) when:**
- You want complete style isolation
- You want your component to look identical across all sites
- Site styles might conflict with your component's design
- You're providing a branded/designed component

**Set to `true` when:**
- You want your component to inherit site typography
- You want buttons/headings to match site styles
- You're building a component that should feel native to each site
- Consistency with site design is more important than component isolation

```tsx
// Example: Isolated component
export default declareComponent(CustomButton, {
  name: 'Custom Button',
  options: {
    applyTagSelectors: false  // Don't inherit site button styles
  }
});

// Example: Site-adaptive component
export default declareComponent(ContentCard, {
  name: 'Content Card',
  options: {
    applyTagSelectors: true  // Inherit site h1, p, button styles
  }
});
```

**Visual Example:**

```tsx
// With applyTagSelectors: false
<h1>My Heading</h1>  // Uses component's own styles only

// With applyTagSelectors: true
<h1>My Heading</h1>  // Inherits font-family, font-size, color from site's h1 tag selector
```

---

### Prop Organization Options

Use these in individual prop definitions:

```tsx
props: {
  myProp: props.Number({
    name: 'My Prop',           // Display name in UI
    defaultValue: 100,          // Default value
    min: 0,                     // Minimum value (Number only)
    max: 1000,                  // Maximum value (Number only)
    decimals: 1,                // Decimal places (Number only)
    group: 'Animation',         // Group in properties panel
    tooltip: 'Controls speed'   // Tooltip on hover
  })
}
```

**Groups organize props** into collapsible sections:

```tsx
props: {
  // Content group
  title: props.Text({
    name: 'Title',
    group: 'Content'
  }),
  description: props.Text({
    name: 'Description',
    group: 'Content'
  }),

  // Style group
  backgroundColor: props.Text({
    name: 'Background',
    group: 'Style'
  }),

  // Animation group
  speed: props.Number({
    name: 'Speed',
    group: 'Animation'
  })
}
```

---

## Shadow DOM Deep Dive

Understanding Shadow DOM is **critical** for building Webflow components. Shadow DOM affects styling, event handling, and content extraction.

### What is Shadow DOM?

Shadow DOM creates an isolated DOM subtree that:
- Has its own scope for styles (styles don't leak in or out)
- Has its own scope for IDs (no ID conflicts)
- Provides encapsulation (component internals are hidden)

**Why Webflow Uses Shadow DOM:**
- Prevents your component styles from affecting the page
- Prevents page styles from breaking your component
- Allows same component to be used multiple times without conflicts
- Creates portable, self-contained components

### How Shadow DOM Affects Your Component

#### 1. Style Isolation

```css
/* ❌ External styles DON'T affect your component */
.my-class {
  color: red;  /* Won't apply to elements inside your component */
}

/* ✅ Your component styles DON'T affect the page */
.my-class {
  color: blue;  /* Only affects elements in your component */
}
```

#### 2. CSS Variables DOPASS Through

```css
/* ✅ CSS Variables defined at :root INHERIT into Shadow DOM */
:root {
  --brand-color: #0066cc;
}

/* Inside your component */
.button {
  background: var(--brand-color);  /* This works! */
}
```

**Critical:** Do NOT redefine variables with `:host` in component CSS:

```css
/* ❌ DON'T DO THIS - overrides inherited values */
:host {
  --brand-color: #000000;  /* Overrides Webflow's value! */
}

/* ✅ DO THIS - use fallback values instead */
.button {
  background: var(--brand-color, #0066cc);  /* Inherits or falls back */
}
```

#### 3. Inherited CSS Properties Work

Some CSS properties inherit through Shadow DOM boundaries:

```css
/* These properties inherit from parent */
font-family: inherit;  /* ✅ Works */
font-size: inherit;    /* ✅ Works */
color: inherit;        /* ✅ Works */
line-height: inherit;  /* ✅ Works */
```

Example:

```tsx
// If component is inside a div with font-family: 'Inter'
<div style="font-family: 'Inter', sans-serif">
  <my-component>
    <!-- This will use Inter font if set to inherit -->
    <p style="font-family: inherit">Text</p>
  </my-component>
</div>
```

#### 4. Slot Content Lives in Light DOM

When you use `props.Slot()`, the content placed in the slot remains in the "light DOM" (the regular DOM), not the Shadow DOM. This is why you need special techniques to access it:

```tsx
// Slot container in your component (Shadow DOM)
<div ref={slotRef}>
  {children}
</div>

// Content placed in slot (Light DOM - lives outside Shadow DOM)
<img src="photo.jpg" />
<div class="collection-item">
  <img src="photo2.jpg" />
</div>
```

To access slot content, you must:
1. Find the `<slot>` element
2. Use `assignedElements()` to get the light DOM content

```tsx
const slotElement = slotRef.current.querySelector('slot');
const lightDOMContent = slotElement.assignedElements({ flatten: true });
```

---

## Available Prop Types

Webflow provides several prop types for configuring components:

### Text

For string inputs:

```tsx
title: props.Text({
  name: "Title",
  defaultValue: "Default text",
  group: "Content",
  tooltip: "The main heading"
})
```

**Use for:**
- Text content
- URLs
- Color values (hex codes)
- CSS values (e.g., "10px", "1rem")
- Comma-separated lists
- Boolean values as "0"/"1"

---

### Number

For numeric inputs with optional constraints:

```tsx
count: props.Number({
  name: "Count",
  defaultValue: 100,
  min: 0,
  max: 1000,
  decimals: 0,
  group: "Settings"
})
```

**Parameters:**
- `min`: Minimum value (optional)
- `max`: Maximum value (optional)
- `decimals`: Number of decimal places (optional, default: 0)

**Use for:**
- Counts, quantities
- Pixel values
- Animation speeds
- Percentages (0-100)
- Angles (0-360)

---

### Variant

For dropdown selection:

```tsx
size: props.Variant({
  name: "Size",
  options: ["Small", "Medium", "Large"],
  defaultValue: "Medium",
  group: "Style"
})
```

**Use for:**
- Style variants
- Layout options
- Predefined choices
- Enum-like values

**Note:** Values are strings. In your TypeScript interface:

```tsx
interface MyComponentProps {
  size?: 'Small' | 'Medium' | 'Large';
}
```

---

### Slot

For content areas where users can place elements:

```tsx
children: props.Slot({
  name: "Content",
  tooltip: "Add Collection Lists, images, or other elements here"
})
```

**Use for:**
- Collection List integration
- Custom content areas
- Dynamic content injection
- Child components

**In your component:**

```tsx
interface MyComponentProps {
  children?: any;  // ReactNode
}

const MyComponent = ({ children }: MyComponentProps) => {
  return (
    <div>
      {children}
    </div>
  );
};
```

**See:** [Using Slots and Collection Lists](#using-slots-and-collection-lists)

---

### Boolean Props (Workaround)

**Problem:** No native `props.Boolean()` exists.

**Solution:** Use `props.Text()` with "0"/"1":

```tsx
// In .webflow.tsx
isActive: props.Text({
  name: "Is Active",
  defaultValue: "0",  // "0" = false, "1" = true
  tooltip: "Set to 1 to enable"
})

// In .tsx
interface MyComponentProps {
  isActive?: boolean | string;  // Accept both
}

const MyComponent = ({ isActive = false }: MyComponentProps) => {
  const parsed = typeof isActive === 'string'
    ? isActive === '1'
    : isActive;

  if (parsed) {
    // Enabled
  }
};
```

---

### Array Props (Workaround)

**Problem:** No native `props.Array()` exists.

**Solution:** Use `props.Text()` with comma-separated values:

```tsx
// In .webflow.tsx
colors: props.Text({
  name: "Colors",
  defaultValue: "#ff0000,#00ff00,#0000ff",
  tooltip: "Comma-separated hex colors"
})

// In .tsx
interface MyComponentProps {
  colors?: string | string[];  // Accept both
}

const MyComponent = ({ colors }: MyComponentProps) => {
  const parsedColors = typeof colors === 'string'
    ? colors.split(',').map(c => c.trim()).filter(Boolean)
    : colors;

  parsedColors?.forEach(color => {
    // Use each color
  });
};
```

---

## Using Slots and Collection Lists

Slots enable users to place Webflow Collection Lists and other content inside your components. This section covers the complete pattern for extracting and using slotted content.

### Basic Slot Setup

```tsx
// YourComponent.webflow.tsx
export default declareComponent(YourComponent, {
  name: 'Your Component',
  props: {
    children: props.Slot({
      name: 'Content',
      tooltip: 'Add Collection List or other elements here'
    })
  }
});

// YourComponent.tsx
interface YourComponentProps {
  children?: any;
}

const YourComponent = ({ children }: YourComponentProps) => {
  return (
    <div>
      {children}  {/* Renders slotted content as-is */}
    </div>
  );
};
```

---

### Extracting Collection List Data

When you need to extract specific data (images, text, etc.) from a Collection List:

#### Complete Working Pattern

```tsx
import React, { useEffect, useRef, useState } from 'react';

interface MyComponentProps {
  children?: any;
}

const MyComponent = ({ children }: MyComponentProps) => {
  const slotRef = useRef<HTMLDivElement>(null);
  const [extractedImages, setExtractedImages] = useState<string[]>([]);

  useEffect(() => {
    const extractImages = () => {
      if (!slotRef.current) return;

      // Strategy 1: Find slot element
      let slotElement = slotRef.current.querySelector('slot');

      // Strategy 2: Try shadow root
      if (!slotElement && slotRef.current.getRootNode) {
        const root: any = slotRef.current.getRootNode();
        if (root && root.host) {
          slotElement = root.querySelector('slot[name="children"]') ||
                       root.querySelector('slot');
        }
      }

      if (slotElement) {
        // Strategy 3: Get assigned elements
        const assignedElements = (slotElement as any).assignedElements?.({
          flatten: true
        }) || [];

        const imgElements: HTMLImageElement[] = [];

        // Strategy 4: Extract images
        assignedElements.forEach((element: any) => {
          if (element.tagName === 'IMG') {
            imgElements.push(element as HTMLImageElement);
          } else {
            const imgs: NodeListOf<HTMLImageElement> = element.querySelectorAll('img');
            Array.from(imgs).forEach(img => imgElements.push(img));
          }
        });

        const imageUrls = imgElements
          .map(img => img.src)
          .filter(src => src);

        if (imageUrls.length > 0) {
          setExtractedImages(imageUrls);
        }
      } else {
        // Strategy 5: Fallback to regular DOM
        const imgElements = slotRef.current.querySelectorAll('img');
        const imageUrls = Array.from(imgElements)
          .map((img: any) => img.src)
          .filter((src: string) => src);

        if (imageUrls.length > 0) {
          setExtractedImages(imageUrls);
        }
      }
    };

    // Try immediately
    extractImages();

    // Try with delays
    const timeout1 = setTimeout(extractImages, 100);
    const timeout2 = setTimeout(extractImages, 300);
    const timeout3 = setTimeout(extractImages, 1000);

    // Listen for changes
    if (slotRef.current) {
      const slotElement = slotRef.current.querySelector('slot');
      if (slotElement) {
        const handleSlotChange = () => extractImages();
        (slotElement as any).addEventListener?.('slotchange', handleSlotChange);

        return () => {
          clearTimeout(timeout1);
          clearTimeout(timeout2);
          clearTimeout(timeout3);
          (slotElement as any).removeEventListener?.('slotchange', handleSlotChange);
        };
      }
    }

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  }, [children]);

  return (
    <div>
      {/* Hidden slot container */}
      <div ref={slotRef} style={{ display: 'none' }}>
        {children}
      </div>

      {/* Render extracted content in custom layout */}
      <div className="custom-layout">
        {extractedImages.map((src, index) => (
          <img key={index} src={src} alt={`Image ${index + 1}`} />
        ))}
      </div>
    </div>
  );
};
```

---

### How Users Use This in Webflow

1. Drag your component onto canvas
2. Inside the slot area, add a **Collection List** component
3. Connect Collection List to a CMS collection
4. Inside Collection List Item, add an **Image** element
5. Bind Image to collection's image field
6. Component automatically extracts all images

Your component receives the images and can display them in any custom layout!

---

### Extracting Other Data Types

#### Text Content

```tsx
const textElements = element.querySelectorAll('[data-text-field]');
const textContent = Array.from(textElements).map(el => el.textContent).filter(Boolean);
```

#### Attributes

```tsx
const items = assignedElements.map(element => ({
  question: element.querySelector('[data-faq-question]')?.textContent || '',
  answer: element.querySelector('[data-faq-answer]')?.textContent || ''
}));
```

#### Mixed Content

```tsx
assignedElements.forEach((element: any) => {
  const data = {
    image: element.querySelector('img')?.src,
    title: element.querySelector('h3')?.textContent,
    description: element.querySelector('p')?.textContent,
    link: element.querySelector('a')?.href
  };
  extractedData.push(data);
});
```

---

## Advanced Patterns

### Performance Optimization

#### Throttling Mouse Events

```tsx
const throttle = (func: (...args: any[]) => void, limit: number) => {
  let lastCall = 0;
  return function (this: any, ...args: any[]) {
    const now = performance.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      func.apply(this, args);
    }
  };
};

useEffect(() => {
  const handleMouseMove = (e: MouseEvent) => {
    // Expensive operation
  };

  const throttledMove = throttle(handleMouseMove, 16); // ~60fps
  window.addEventListener('mousemove', throttledMove);

  return () => {
    window.removeEventListener('mousemove', throttledMove);
  };
}, []);
```

**Real Example:** [DotGrid.tsx:10-19](src/components/DotGrid.tsx#L10-L19)

---

#### ResizeObserver for Container Sizing

```tsx
useEffect(() => {
  const container = containerRef.current;
  if (!container) return;

  const handleResize = () => {
    const { width, height } = container.getBoundingClientRect();
    // Update component dimensions
  };

  let resizeObserver: ResizeObserver | null = null;

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
  } else {
    // Fallback for older browsers
    window.addEventListener('resize', handleResize);
  }

  // Initial size
  handleResize();

  return () => {
    if (resizeObserver) {
      resizeObserver.disconnect();
    } else {
      window.removeEventListener('resize', handleResize);
    }
  };
}, []);
```

**Real Example:** [Particles.tsx:147-164](src/components/Particles.tsx#L147-L164)

---

### Animation Cleanup

Always clean up animations, timers, and event listeners:

```tsx
useEffect(() => {
  let animationFrameId: number;

  const animate = () => {
    // Animation logic
    animationFrameId = requestAnimationFrame(animate);
  };

  animationFrameId = requestAnimationFrame(animate);

  return () => {
    cancelAnimationFrame(animationFrameId);
  };
}, []);
```

**Real Example:** [Particles.tsx:237-284](src/components/Particles.tsx#L237-L284)

---

### GSAP Lag Smoothing

When using GSAP in Webflow:

```tsx
import { gsap } from 'gsap';

useEffect(() => {
  // Disable lag smoothing to prevent jerky animations
  gsap.ticker.lagSmoothing(0);

  // Your GSAP animations...
}, []);
```

**Real Example:** [GridMotion.tsx:147](src/components/GridMotion.tsx#L147)

---

## Real-World Examples

### Example 1: FAQ Component (CSS Variables Approach)

Complete production component using CSS variables for all styling:

**Component Implementation:**

```tsx
// FAQ.tsx
import React, { useState } from 'react';
import './FAQ.css';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQProps {
  type?: 'single' | 'multiple';
  animationDuration?: number;
  children?: any;
}

const FAQ = ({
  type = 'single',
  animationDuration = 0.3,
  children
}: FAQProps) => {
  const [items, setItems] = useState<FAQItem[]>([]);
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  // Extract FAQ items from Collection List (see Issue 3)
  // ... extraction logic ...

  const toggleItem = (itemId: string) => {
    if (type === 'single') {
      setOpenItems(openItems.has(itemId) ? new Set() : new Set([itemId]));
    } else {
      const newOpenItems = new Set(openItems);
      if (newOpenItems.has(itemId)) {
        newOpenItems.delete(itemId);
      } else {
        newOpenItems.add(itemId);
      }
      setOpenItems(newOpenItems);
    }
  };

  return (
    <div className="faq">
      <div ref={slotRef} style={{ display: 'none' }}>
        {children}
      </div>

      {items.map((item) => (
        <div
          key={item.id}
          className={`faq__item ${openItems.has(item.id) ? 'faq__item--open' : ''}`}
        >
          <button
            className="faq__trigger"
            onClick={() => toggleItem(item.id)}
            aria-expanded={openItems.has(item.id)}
          >
            <span className="faq__question">{item.question}</span>
            <span className="faq__icon">▼</span>
          </button>

          <div
            className="faq__content"
            style={{
              transitionDuration: `${animationDuration}s`
            }}
          >
            <div className="faq__answer">
              {item.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FAQ;
```

**Styles (CSS Variables):**

```css
/* FAQ.css */

/* NOTE: Do NOT define :host variables - they override Webflow's :root values */

.faq__item {
  border: 1px solid var(--faq-toggle-border-color, #e5e5e5);
  border-radius: var(--faq-border-radius, 0px);
}

.faq__trigger {
  background: none;
  cursor: pointer;
  padding: var(--faq-question-padding, 16px);
}

.faq__trigger:hover {
  background-color: var(--faq-toggle-hover-color, #f9f9f9);
}

.faq__question {
  font-family: var(--faq-question-font-family, inherit);
  font-size: var(--faq-question-font-size, inherit);
  font-weight: var(--faq-question-font-weight, inherit);
  color: var(--faq-question-color, #000000);
}

.faq__answer {
  font-family: var(--faq-answer-font-family, inherit);
  color: var(--faq-answer-color, #000000);
  font-size: var(--faq-answer-font-size, 16px);
  padding: var(--faq-answer-padding, 0 16px 16px 16px);
}
```

**Webflow Declaration:**

```tsx
// FAQ.webflow.tsx
import FAQ from './FAQ';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

export default declareComponent(FAQ, {
  name: 'FAQ Accordion',
  description: 'Accessible accordion component. Style with CSS variables in Webflow Variables panel.',
  group: 'Interactive',
  props: {
    children: props.Slot({
      name: 'FAQ Items',
      tooltip: 'Add Collection List with data-faq-question and data-faq-answer attributes'
    }),
    type: props.Text({
      name: 'Accordion Type',
      defaultValue: 'single',
      group: 'Behavior'
    }),
    animationDuration: props.Number({
      name: 'Animation Speed',
      defaultValue: 0.3,
      min: 0.1,
      max: 2,
      group: 'Animation'
    })
  },
  options: {
    applyTagSelectors: false,
    ssr: false
  }
});
```

**How Users Style It in Webflow:**

1. Go to **Variables** panel
2. Create variables:
   - `--faq-question-color` → `#1a1a1a`
   - `--faq-question-font-size` → `18px`
   - `--faq-answer-color` → `#666666`
   - `--faq-border-radius` → `8px`
3. Component automatically uses these values
4. Update variables to restyle all FAQs globally

---

### Example 2: Particles Component (Props Approach)

WebGL component with full prop configuration:

```tsx
// Particles.tsx
import React, { useEffect, useRef } from 'react';
import { Renderer, Camera, Geometry, Program, Mesh } from 'ogl';
import './Particles.css';

interface ParticlesProps {
  particleCount?: number;
  particleSpread?: number;
  speed?: number;
  particleColors?: string | string[];
  moveParticlesOnHover?: boolean | string;
  particleBaseSize?: number;
  cameraDistance?: number;
  disableRotation?: boolean | string;
}

const Particles: React.FC<ParticlesProps> = ({
  particleCount = 200,
  particleSpread = 10,
  speed = 0.1,
  particleColors,
  moveParticlesOnHover = false,
  particleBaseSize = 100,
  cameraDistance = 20,
  disableRotation = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isMouseInsideRef = useRef(false);

  // Parse string props from Webflow
  const parsedMoveOnHover = typeof moveParticlesOnHover === 'string'
    ? moveParticlesOnHover === '1'
    : moveParticlesOnHover;

  const parsedDisableRotation = typeof disableRotation === 'string'
    ? disableRotation === '1'
    : disableRotation;

  const parsedColors = typeof particleColors === 'string'
    ? particleColors.split(',').map(c => c.trim()).filter(Boolean)
    : particleColors;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Setup WebGL renderer
    const renderer = new Renderer({
      depth: false,
      alpha: true,
      dpr: window.devicePixelRatio || 1
    });
    const gl = renderer.gl;
    container.appendChild(gl.canvas);

    // Setup camera
    const camera = new Camera(gl, { fov: 15 });
    camera.position.set(0, 0, cameraDistance);

    // Handle resize
    const resize = () => {
      const width = Math.max(container.clientWidth, window.innerWidth);
      const height = Math.max(container.clientHeight, window.innerHeight);
      renderer.setSize(width, height);
      camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
    };

    // Use ResizeObserver for better performance
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(container);
    } else {
      window.addEventListener('resize', resize, false);
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(resize);
    });

    // Mouse tracking (window-level for Webflow compatibility)
    const handleMouseMove = (e: PointerEvent) => {
      if (!isMouseInsideRef.current) return;

      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      mouseRef.current = {
        x: Math.max(-1, Math.min(1, x)),
        y: Math.max(-1, Math.min(1, y))
      };
    };

    const handleMouseEnter = () => {
      isMouseInsideRef.current = true;
    };

    const handleMouseLeave = () => {
      isMouseInsideRef.current = false;
      mouseRef.current = { x: 0, y: 0 };
    };

    if (parsedMoveOnHover) {
      window.addEventListener('pointermove', handleMouseMove);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    // Create particles geometry and program
    // ... WebGL setup code ...

    // Animation loop
    let animationFrameId: number;
    let lastTime = performance.now();
    let elapsed = 0;

    const update = (t: number) => {
      animationFrameId = requestAnimationFrame(update);
      const delta = t - lastTime;
      lastTime = t;
      elapsed += delta * speed;

      if (parsedMoveOnHover) {
        particles.position.x = -mouseRef.current.x;
        particles.position.y = -mouseRef.current.y;
      }

      if (!parsedDisableRotation) {
        particles.rotation.z += 0.01 * speed;
      }

      renderer.render({ scene: particles, camera });
    };

    animationFrameId = requestAnimationFrame(update);

    // Cleanup
    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener('resize', resize);
      }
      if (parsedMoveOnHover) {
        window.removeEventListener('pointermove', handleMouseMove);
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
      if (container.contains(gl.canvas)) {
        container.removeChild(gl.canvas);
      }
    };
  }, [
    particleCount,
    particleSpread,
    speed,
    particleColors,
    moveParticlesOnHover,
    particleBaseSize,
    cameraDistance,
    disableRotation
  ]);

  return <div ref={containerRef} className="particles-container" />;
};

export default Particles;
```

**Webflow Declaration:**

```tsx
// Particles.webflow.tsx
import Particles from './Particles';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

export default declareComponent(Particles, {
  name: 'Particles Background',
  description: 'A WebGL particle system with customizable colors and animations',
  group: 'Interactive',
  props: {
    particleCount: props.Number({
      name: 'Particle Count',
      defaultValue: 200,
      min: 10,
      max: 1000,
      group: 'Content'
    }),
    particleSpread: props.Number({
      name: 'Particle Spread',
      defaultValue: 10,
      min: 1,
      max: 50,
      group: 'Content'
    }),
    speed: props.Number({
      name: 'Speed',
      defaultValue: 0.1,
      min: 0,
      max: 2,
      group: 'Animation'
    }),
    particleColors: props.Text({
      name: 'Particle Colors',
      defaultValue: '#ffffff,#ffffff,#ffffff',
      group: 'Style',
      tooltip: 'Comma-separated hex colors'
    }),
    moveParticlesOnHover: props.Text({
      name: 'Move On Hover',
      defaultValue: '0',
      group: 'Behavior',
      tooltip: 'Set to 1 to enable'
    }),
    particleBaseSize: props.Number({
      name: 'Base Size',
      defaultValue: 100,
      min: 10,
      max: 300,
      group: 'Style'
    }),
    cameraDistance: props.Number({
      name: 'Camera Distance',
      defaultValue: 20,
      min: 5,
      max: 50,
      group: 'Advanced'
    }),
    disableRotation: props.Text({
      name: 'Disable Rotation',
      defaultValue: '0',
      group: 'Behavior',
      tooltip: 'Set to 1 to disable'
    }),
  },
  options: {
    applyTagSelectors: false,
    ssr: false,  // WebGL requires browser
  },
});
```

**Key Features:**
- Boolean parsing (`moveParticlesOnHover`)
- Array parsing (`particleColors`)
- Window-level mouse events
- Mouse enter/leave tracking
- Proper cleanup
- ResizeObserver
- WebGL with `ssr: false`

---

## Testing Your Components

### Local Development

Create an `App.tsx` to test components:

```tsx
import React, { useState } from 'react';
import { Particles } from './components/Particles';
import { FAQ } from './components/FAQ';

function App() {
  const [particleCount, setParticleCount] = useState(200);
  const [speed, setSpeed] = useState(0.1);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Component Showcase</h1>

      <section>
        <h2>Particles</h2>
        <label>
          Count: <input
            type="number"
            value={particleCount}
            onChange={(e) => setParticleCount(Number(e.target.value))}
          />
        </label>
        <label>
          Speed: <input
            type="number"
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          />
        </label>

        <div style={{ height: '400px', background: '#000' }}>
          <Particles
            particleCount={particleCount}
            speed={speed}
            particleColors="#ffffff,#ff0000,#00ff00"
            moveParticlesOnHover={true}
          />
        </div>
      </section>

      <section>
        <h2>FAQ</h2>
        <FAQ type="single" animationDuration={0.3}>
          {/* Test with static content */}
          <div data-faq-question>What is this?</div>
          <div data-faq-answer>This is a test answer.</div>
        </FAQ>
      </section>
    </div>
  );
}

export default App;
```

Run:

```bash
npm start
```

---

## Publishing to Webflow

### 1. Install Webflow CLI

```bash
npm install -g @webflow/cli
```

### 2. Authenticate

```bash
npx wf auth
```

Opens browser to authenticate with Webflow account.

### 3. Publish Components

```bash
npx wf publish
```

This command:
- Bundles your components
- Uploads to Webflow
- Makes them available in your workspace

### 4. Install in Webflow Site

1. Open Webflow project
2. Go to **Assets** panel
3. Click **Libraries** (book icon)
4. Find your published library
5. Click **Install**
6. Drag components from **Add** panel

---

## Troubleshooting

### Component Not Appearing in Webflow

**Check:**
- [ ] `webflow.json` glob pattern includes `.webflow.tsx` files
- [ ] File is in correct location matching glob
- [ ] `npx wf publish` completed successfully
- [ ] Library is installed in the site (Assets → Libraries)
- [ ] No build errors in terminal

**Fix:**
```bash
# Republish
npx wf publish

# Check webflow.json
{
  "library": {
    "components": ["./src/**/*.webflow.@(js|jsx|ts|tsx)"]
  }
}
```

---

### Props Not Working

**Check:**
- [ ] Prop names match between `.tsx` and `.webflow.tsx`
- [ ] Default values are provided
- [ ] No unsupported fields (like `description` in prop definitions)
- [ ] TypeScript interface accepts both native type and string

**Fix:**
```tsx
// ✅ Good
interface Props {
  isActive?: boolean | string;  // Accept both
}

// Parse in component
const parsed = typeof isActive === 'string' ? isActive === '1' : isActive;
```

---

### Boolean Props Not Working

**Check:**
- [ ] Using `props.Text()` not `props.Boolean()` (doesn't exist)
- [ ] Default value is `"0"` or `"1"` (string)
- [ ] Component parses string to boolean
- [ ] Interface accepts `boolean | string`

**Fix:**
```tsx
// In .webflow.tsx
isEnabled: props.Text({
  name: 'Is Enabled',
  defaultValue: '0'  // String!
})

// In .tsx
interface Props {
  isEnabled?: boolean | string;
}

const Component = ({ isEnabled = false }: Props) => {
  const parsed = typeof isEnabled === 'string' ? isEnabled === '1' : isEnabled;
};
```

---

### Mouse Events Not Working

**Check:**
- [ ] Using `window.addEventListener('pointermove')` not container-level
- [ ] Calculating relative coordinates with `getBoundingClientRect()`
- [ ] Clamping normalized values
- [ ] Cleanup in useEffect return

**Fix:**
```tsx
useEffect(() => {
  const handleMove = (e: PointerEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      // Use x...
    }
  };

  window.addEventListener('pointermove', handleMove);  // Window!

  return () => {
    window.removeEventListener('pointermove', handleMove);
  };
}, []);
```

---

### Slot Content Not Extracting

**Check:**
- [ ] Querying for `<slot>` element not direct children
- [ ] Using `assignedElements({ flatten: true })`
- [ ] Trying both shadow root and regular DOM
- [ ] Multiple timeouts (100ms, 300ms, 1000ms)
- [ ] Listening for `slotchange` events
- [ ] Filtering empty values
- [ ] Console logging to debug

**Fix:**
```tsx
// Find slot
let slotElement = slotRef.current.querySelector('slot');
if (!slotElement && slotRef.current.getRootNode) {
  const root = slotRef.current.getRootNode();
  slotElement = root.querySelector('slot');
}

// Get assigned elements
const assigned = slotElement.assignedElements?.({ flatten: true }) || [];

// Try with delays
extractData();
setTimeout(extractData, 100);
setTimeout(extractData, 300);
setTimeout(extractData, 1000);
```

---

### CSS Variables Not Working

**Check:**
- [ ] NOT defining `:host` variables in component CSS
- [ ] Using `var(--variable-name, fallback)` syntax
- [ ] Variables defined at `:root` in Webflow Variables panel
- [ ] Using "Copy CSS" to get exact variable names

**Fix:**
```css
/* ❌ DON'T: This overrides Webflow's values */
:host {
  --my-color: #000;
}

/* ✅ DO: This inherits from Webflow */
.my-element {
  color: var(--my-color, #000);  /* Fallback only */
}
```

---

### SSR Errors

**Check:**
- [ ] Component uses browser APIs (window, document, canvas)
- [ ] `ssr: false` in component options
- [ ] No direct window/document access at module level

**Fix:**
```tsx
// In .webflow.tsx
export default declareComponent(MyComponent, {
  name: 'My Component',
  options: {
    ssr: false  // Disable for browser-only components
  }
});
```

---

## Best Practices Checklist

### Component Design
- [ ] Component has single, clear purpose
- [ ] Sensible defaults provided
- [ ] Edge cases handled (null, undefined, empty)
- [ ] Responsive to container size

### Props
- [ ] Clear, descriptive names
- [ ] Organized into groups
- [ ] Tooltips for complex options
- [ ] Validation (min/max for numbers)
- [ ] Boolean props use Text with "0"/"1"
- [ ] Array props use comma-separated Text

### Styling
- [ ] Decided: CSS Variables vs Props vs Hybrid
- [ ] NO `:host` variables in CSS (if using CSS Variables approach)
- [ ] CSS variables have fallback values
- [ ] Component works with both approaches
- [ ] Documented which CSS variables are available

### Events
- [ ] Mouse events on `window`, not container
- [ ] Mouse enter/leave tracking implemented
- [ ] Relative coordinates calculated correctly
- [ ] Values clamped to prevent extremes

### Performance
- [ ] Event listeners throttled if needed
- [ ] ResizeObserver for container sizing
- [ ] Animation frames cleaned up
- [ ] Effect dependencies minimal and specific

### Shadow DOM
- [ ] Slot extraction uses `assignedElements()`
- [ ] Multiple timing strategies (immediate + delays)
- [ ] `slotchange` listener added
- [ ] Both Shadow DOM and Light DOM approaches tried
- [ ] Empty values filtered

### SSR
- [ ] `ssr: false` if using browser APIs
- [ ] No window/document at module level
- [ ] Graceful degradation if possible

### Cleanup
- [ ] All event listeners removed
- [ ] All timeouts cleared
- [ ] All animation frames cancelled
- [ ] All observers disconnected

---

## Quick Reference

### Prop Type Patterns

| Type | Webflow Prop | Example Default | Parse in Component |
|------|--------------|-----------------|-------------------|
| string | `props.Text()` | `"Hello"` | Direct use |
| number | `props.Number()` | `100` | Direct use |
| boolean | `props.Text()` | `"0"` or `"1"` | `value === '1'` |
| string[] | `props.Text()` | `"a,b,c"` | `value.split(',').map(c => c.trim())` |
| enum | `props.Variant()` | `"option1"` | Direct use |
| ReactNode | `props.Slot()` | N/A | Extract via DOM |

### TypeScript Interface Pattern

```tsx
interface MyComponentProps {
  name?: string;                      // Text
  count?: number;                     // Number
  isActive?: boolean | string;        // Text ("0"/"1")
  colors?: string | string[];         // Text (comma-separated)
  size?: 'small' | 'medium';          // Variant
  children?: any;                     // Slot
}
```

### Event Listener Pattern

```tsx
// ❌ Don't
container.addEventListener('mousemove', handler);

// ✅ Do
window.addEventListener('pointermove', handler);
```

### Slot Extraction Pattern

```tsx
// Find slot
let slot = ref.current.querySelector('slot');
if (!slot) {
  const root = ref.current.getRootNode();
  slot = root.querySelector('slot');
}

// Get content
const elements = slot.assignedElements?.({ flatten: true }) || [];

// Extract data
elements.forEach(el => {
  // Process...
});

// Try with delays
extract();
setTimeout(extract, 100);
setTimeout(extract, 300);
```

### CSS Variables Pattern

```css
/* Component CSS */
.element {
  /* Inherit from Webflow, fallback to default */
  color: var(--my-color, #000000);

  /* DO NOT use :host */
}
```

---

## Summary

Building Webflow components successfully requires understanding:

1. ✅ **Two styling approaches**: CSS Variables (for design tokens) + Props (for behavior)
2. ✅ **Window-level events**: Mouse tracking must use `window.addEventListener`
3. ✅ **Mouse enter/leave**: Track when mouse is inside component
4. ✅ **Shadow DOM extraction**: Multi-strategy approach for Collection Lists
5. ✅ **Prop workarounds**: Text props for booleans and arrays
6. ✅ **SSR configuration**: Disable for browser-only components
7. ✅ **CSS variables**: Use fallbacks, not `:host` definitions
8. ✅ **Component options**: `applyTagSelectors` and `ssr` flags
9. ✅ **Cleanup patterns**: Always remove listeners and cancel animations
10. ✅ **Performance**: Throttling, ResizeObserver, efficient updates

With these patterns, you can build powerful, reusable React components that work seamlessly in Webflow's visual editor!

---

**Happy building! 🎨**
