# Creating Webflow Components from React Components

A comprehensive guide to converting existing React components into Webflow code components using DevLink.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
3. [Component Structure](#component-structure)
4. [Creating a Webflow Component Definition](#creating-a-webflow-component-definition)
5. [Available Prop Types](#available-prop-types)
6. [Using Slots and Collection Lists](#using-slots-and-collection-lists)
7. [Testing Your Components](#testing-your-components)
8. [Publishing to Webflow](#publishing-to-webflow)
9. [Best Practices](#best-practices)
10. [Examples](#examples)
11. [Troubleshooting](#troubleshooting)
12. [Quick Reference](#quick-reference)

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
├── components/
│   ├── YourComponent.tsx          # Your React component
│   ├── YourComponent.css          # Component styles
│   └── YourComponent.webflow.tsx  # Webflow component definition
└── webflow.json                    # Webflow configuration
```

### Example React Component

Here's a simple React component that we'll convert to a Webflow component:

```tsx
// Badge.tsx
import React from 'react';
import './Badge.css';

interface BadgeProps {
  text: string;
  variant: 'Light' | 'Dark';
}

export const Badge: React.FC<BadgeProps> = ({ text, variant }) => (
  <span
    style={{
      backgroundColor: variant === 'Light' ? '#eee' : '#000',
      borderRadius: '1em',
      color: variant === 'Light' ? '#000' : '#fff',
      display: 'inline-block',
      fontSize: '14px',
      lineHeight: 2,
      padding: '0 1em',
    }}
  >
    {text}
  </span>
);
```

---

## Creating a Webflow Component Definition

To make a React component available in Webflow, you need to create a `.webflow.tsx` file that declares the component and its props.

### Basic Structure

Create a file named `YourComponent.webflow.tsx` alongside your component:

```tsx
import YourComponent from './YourComponent';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

export default declareComponent(YourComponent, {
  name: 'YourComponent',
  description: 'A brief description of what this component does',
  group: 'Category',
  props: {
    // Define your props here
  },
});
```

### Badge Example

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
});
```

---

## Available Prop Types

Webflow provides several prop types that you can use to create configurable components. Here's a comprehensive list:

### Text

For string inputs:

```tsx
text: props.Text({
  name: "Text",
  defaultValue: "Default text",
})
```

### Number

For numeric inputs with optional constraints:

```tsx
count: props.Number({
  name: "Count",
  defaultValue: 100,
  min: 0,
  max: 1000,
})
```

### Variant (Select)

For dropdown selection:

```tsx
size: props.Variant({
  name: "Size",
  options: ["Small", "Medium", "Large"],
  defaultValue: "Medium",
})
```

### Color

For color picker (Note: Webflow may not support all advanced prop types. Stick to basic types):

```tsx
// Use Text for colors and validate in your component
backgroundColor: props.Text({
  name: "Background Color",
  defaultValue: "#ffffff",
})
```

### Boolean Props

Webflow doesn't have a native checkbox or boolean prop type. Use Text props with "0" or "1" values:

```tsx
// In your .webflow.tsx file
moveOnHover: props.Text({
  name: "Move On Hover",
  defaultValue: "0",  // "0" = false, "1" = true
})
```

Then parse in your React component:

```tsx
// In your .tsx file
interface MyComponentProps {
  moveOnHover?: boolean | string;  // Accept both types
}

const MyComponent: React.FC<MyComponentProps> = ({
  moveOnHover = false
}) => {
  // Parse string to boolean
  const parsedMoveOnHover = typeof moveOnHover === 'string' 
    ? moveOnHover === '1' 
    : moveOnHover;
  
  // Use parsedMoveOnHover in your logic
  if (parsedMoveOnHover) {
    // ...
  }
};
```

### Array Props (Colors, Lists, etc.)

For array props like color palettes, use a single Text prop with comma-separated values:

```tsx
// In your .webflow.tsx file
particleColors: props.Text({
  name: "Particle Colors",
  defaultValue: "#ffffff,#ff0000,#00ff00",
})
```

Parse in your React component:

```tsx
interface MyComponentProps {
  particleColors?: string | string[];  // Accept both types
}

const MyComponent: React.FC<MyComponentProps> = ({
  particleColors
}) => {
  // Parse comma-separated string to array
  const parsedColors = typeof particleColors === 'string' 
    ? particleColors.split(',').map(c => c.trim()).filter(Boolean)
    : particleColors;
  
  // Use parsedColors array
  parsedColors?.forEach(color => {
    // ...
  });
};
```

This approach allows users to enter:
- Single value: `"#ff0000"`
- Multiple values: `"#ff0000,#00ff00,#0000ff"`
- The component adapts to however many values are provided

### Important Notes on Props

1. **Keep it simple**: Webflow best supports Text, Number, and Variant prop types
2. **No descriptions on prop fields**: The API doesn't support description fields within prop definitions
3. **Boolean values**: Use Text with "0"/"1" and parse to boolean in your component
4. **Arrays**: Use comma-separated Text values and parse to arrays in your component
5. **Dual type support**: Always accept both the native type and string type in your TypeScript interface

---

## Using Slots and Collection Lists

Slots are a powerful feature that allows users to place content (including Webflow Collection Lists) inside your components. This is perfect for creating components that need to work with dynamic CMS data.

### What are Slots?

Slots let users drop Webflow elements, Collection Lists, or other components directly into your component. Think of them as "content areas" that designers can fill in the Webflow Designer.

### Declaring a Slot

To add a slot to your component, use `props.Slot()` in your Webflow component definition:

```tsx
// YourComponent.webflow.tsx
export default declareComponent(YourComponent, {
  name: 'Your Component',
  description: 'A component with a slot',
  group: 'Content',
  props: {
    children: props.Slot({
      name: 'Content',
      tooltip: 'Add your content here. You can add Collection Lists, images, text, or other elements.'
    }),
    // Other props...
  },
});
```

### Accessing Slot Content in React

In your React component, accept the `children` prop and render it:

```tsx
interface YourComponentProps {
  children?: any;
  // Other props...
}

const YourComponent = ({ children }: YourComponentProps) => {
  return (
    <div className="your-component">
      {/* Your component content */}
      <div className="slot-content">
        {children}
      </div>
    </div>
  );
};
```

### Extracting Data from Collection Lists in Slots

When users place a Collection List inside your slot, you often want to extract specific data (like image URLs) from it. This requires querying the DOM after it renders.

#### Important: Shadow DOM Considerations

Webflow uses Shadow DOM for code components, which means you need special techniques to access slotted content:

1. **Regular DOM query won't work** - `querySelector` from your ref won't see slotted content
2. **You need to find the slot element** - Query for `<slot>` and use `assignedElements()`
3. **Timing matters** - Content may not be available immediately; use delays and listeners

#### Complete Example: Extracting Images from a Collection List

Here's a complete working example of a component that extracts images from a Collection List:

```tsx
// ImageGrid.tsx
import React, { useEffect, useRef, useState } from 'react';
import './ImageGrid.css';

interface ImageGridProps {
  children?: any;
  columns?: number;
}

const ImageGrid = ({ children, columns = 3 }: ImageGridProps) => {
  const slotRef = useRef(null);
  const [extractedImages, setExtractedImages] = useState<string[]>([]);

  // Extract images from slot (Collection List)
  useEffect(() => {
    const extractImages = () => {
      if (!slotRef.current) {
        console.log('[ImageGrid] slotRef.current is null');
        return;
      }

      console.log('[ImageGrid] Attempting to extract images...');
      
      // Try multiple approaches to find the slot
      let slotElement = slotRef.current.querySelector('slot');
      
      // If not found, try finding from shadow root
      if (!slotElement && slotRef.current.getRootNode) {
        const root: any = slotRef.current.getRootNode();
        if (root && root.host) {
          console.log('[ImageGrid] Found shadow root');
          slotElement = root.querySelector('slot[name="children"]') || root.querySelector('slot');
        }
      }
      
      if (slotElement) {
        console.log('[ImageGrid] Found slot element');
        // Shadow DOM: get assigned elements from the slot
        const assignedElements = (slotElement as any).assignedElements?.({ flatten: true }) || [];
        console.log('[ImageGrid] Assigned elements:', assignedElements.length);
        const imgElements: HTMLImageElement[] = [];
        
        // Search for images in assigned elements
        assignedElements.forEach((element: any) => {
          if (element.tagName === 'IMG') {
            imgElements.push(element as HTMLImageElement);
          } else {
            // Search for images within the element (Collection List items)
            const imgs: NodeListOf<HTMLImageElement> = element.querySelectorAll('img');
            Array.from(imgs).forEach(img => imgElements.push(img));
          }
        });
        
        console.log('[ImageGrid] Found images:', imgElements.length);
        const imageUrls = imgElements.map(img => img.src).filter(src => src);
        if (imageUrls.length > 0) {
          console.log('[ImageGrid] Setting images:', imageUrls);
          setExtractedImages(imageUrls);
        }
      } else {
        console.log('[ImageGrid] No slot found, trying regular DOM');
        // Fallback: Regular DOM query
        const imgElements = slotRef.current.querySelectorAll('img');
        console.log('[ImageGrid] Regular DOM images:', imgElements.length);
        const imageUrls = Array.from(imgElements).map((img: any) => img.src).filter((src: string) => src);
        if (imageUrls.length > 0) {
          setExtractedImages(imageUrls);
        }
      }
    };

    // Try immediately
    extractImages();
    
    // Try after delays to ensure DOM is ready
    const timeoutId1 = setTimeout(extractImages, 100);
    const timeoutId2 = setTimeout(extractImages, 300);
    const timeoutId3 = setTimeout(extractImages, 1000);
    
    // Also listen for slot changes
    if (slotRef.current) {
      const slotElement = slotRef.current.querySelector('slot');
      if (slotElement) {
        const handleSlotChange = () => {
          console.log('[ImageGrid] Slot changed');
          extractImages();
        };
        (slotElement as any).addEventListener?.('slotchange', handleSlotChange);
        
        return () => {
          clearTimeout(timeoutId1);
          clearTimeout(timeoutId2);
          clearTimeout(timeoutId3);
          (slotElement as any).removeEventListener?.('slotchange', handleSlotChange);
        };
      }
    }
    
    return () => {
      clearTimeout(timeoutId1);
      clearTimeout(timeoutId2);
      clearTimeout(timeoutId3);
    };
  }, [children]);

  return (
    <div className="image-grid">
      {/* Hidden slot for Collection List */}
      <div ref={slotRef} style={{ display: 'none' }}>
        {children}
      </div>

      {/* Render extracted images in a grid */}
      <div 
        className="grid-container"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: '1rem'
        }}
      >
        {extractedImages.map((src, index) => (
          <div key={index} className="grid-item">
            <img src={src} alt={`Grid item ${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGrid;
```

```tsx
// ImageGrid.webflow.tsx
import ImageGrid from './ImageGrid';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

export default declareComponent(ImageGrid, {
  name: 'Image Grid',
  description: 'A grid that extracts images from a Collection List and displays them.',
  group: 'Gallery',
  props: {
    children: props.Slot({
      name: 'Images',
      tooltip: 'Add a Collection List here with images. The component will automatically extract and display all images in a grid.'
    }),
    columns: props.Number({
      name: 'Columns',
      defaultValue: 3,
      min: 1,
      max: 6,
    }),
  },
});
```

### How Users Will Use This in Webflow

1. **Drag the component** onto the canvas
2. **Inside the slot**, add a Collection List element
3. **Bind the Collection List** to a CMS collection (e.g., "Gallery", "Portfolio")
4. **Inside the Collection List Item**, add an Image element
5. **Bind the Image** to the collection's image field
6. **The component automatically** extracts all images and displays them in the custom grid

### Key Techniques for Slot Content Extraction

#### 1. Reference the slot container

```tsx
const slotRef = useRef(null);

// In render:
<div ref={slotRef} style={{ display: 'none' }}>
  {children}
</div>
```

**Note**: The slot is hidden because you'll render the extracted content separately in your custom layout.

#### 2. Find the slot element

```tsx
// Try direct query
let slotElement = slotRef.current.querySelector('slot');

// If not found, try shadow root
if (!slotElement && slotRef.current.getRootNode) {
  const root: any = slotRef.current.getRootNode();
  if (root && root.host) {
    slotElement = root.querySelector('slot[name="children"]') || root.querySelector('slot');
  }
}
```

#### 3. Get assigned elements

```tsx
if (slotElement) {
  const assignedElements = (slotElement as any).assignedElements?.({ flatten: true }) || [];
  
  // Process each assigned element
  assignedElements.forEach((element: any) => {
    // Extract data you need
  });
}
```

#### 4. Extract specific elements (like images)

```tsx
const imgElements: HTMLImageElement[] = [];

assignedElements.forEach((element: any) => {
  if (element.tagName === 'IMG') {
    // Direct image element
    imgElements.push(element as HTMLImageElement);
  } else {
    // Search within Collection List items
    const imgs: NodeListOf<HTMLImageElement> = element.querySelectorAll('img');
    Array.from(imgs).forEach(img => imgElements.push(img));
  }
});

// Extract URLs
const imageUrls = imgElements.map(img => img.src).filter(src => src);
```

#### 5. Handle timing with delays and listeners

```tsx
useEffect(() => {
  const extractData = () => {
    // Extraction logic here
  };

  // Try multiple times with increasing delays
  extractData();
  const timeout1 = setTimeout(extractData, 100);
  const timeout2 = setTimeout(extractData, 300);
  const timeout3 = setTimeout(extractData, 1000);

  // Listen for slot changes
  const slotElement = slotRef.current?.querySelector('slot');
  if (slotElement) {
    const handleSlotChange = () => extractData();
    (slotElement as any).addEventListener?.('slotchange', handleSlotChange);
    
    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
      (slotElement as any).removeEventListener?.('slotchange', handleSlotChange);
    };
  }

  return () => {
    clearTimeout(timeout1);
    clearTimeout(timeout2);
    clearTimeout(timeout3);
  };
}, [children]);
```

### Best Practices for Slots

1. **Always provide fallback content**: Show something useful when the slot is empty
2. **Use hidden containers**: Hide the slot container and render extracted content in your custom layout
3. **Add console logging**: During development, log what you're finding to debug Shadow DOM issues
4. **Try multiple times**: Content may not be ready immediately; use delays
5. **Listen for changes**: Use `slotchange` event to detect when content is added dynamically
6. **Check both Shadow and Light DOM**: Try both approaches to find the slot element
7. **Filter empty values**: Always filter out undefined/null values from extracted data

### Debugging Slot Content

Add console logs to understand what's happening:

```tsx
console.log('[Component] slotRef:', slotRef.current);
console.log('[Component] Found slot element:', !!slotElement);
console.log('[Component] Assigned elements:', assignedElements.length);
console.log('[Component] Found images:', imageUrls);
```

Open the browser console when testing in Webflow to see these logs and debug extraction issues.

### Alternative: Using Props Instead of Slots

If you want users to configure content via props instead of slots, you can combine both approaches:

```tsx
interface ComponentProps {
  children?: any;  // Slot for Collection List
  imageUrls?: string;  // JSON fallback: '["url1", "url2"]'
}

// Priority: slot images > prop images > default
const finalImages = extractedImages.length > 0 
  ? extractedImages 
  : (imageUrls ? JSON.parse(imageUrls) : defaultImages);
```

This gives users flexibility to either:
- Use the visual Collection List slot (easier for designers)
- Paste a JSON array of URLs (for quick testing)

---

## Testing Your Components

### Create a Local Showcase

Create an `App.js` file to test your components locally before publishing:

```jsx
import React, { useState } from 'react';
import { Badge } from './components/Badge';

function App() {
  const [text, setText] = useState('Hello World');
  const [variant, setVariant] = useState('Light');

  return (
    <div style={{ padding: '20px' }}>
      <h1>Component Showcase</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <label>
          Text:
          <input 
            value={text} 
            onChange={(e) => setText(e.target.value)} 
          />
        </label>
        
        <label>
          Variant:
          <select 
            value={variant} 
            onChange={(e) => setVariant(e.target.value)}
          >
            <option>Light</option>
            <option>Dark</option>
          </select>
        </label>
      </div>

      <Badge text={text} variant={variant} />
    </div>
  );
}

export default App;
```

Run your development server:

```bash
npm start
```

---

## Publishing to Webflow

### 1. Install Webflow CLI

```bash
npm install -g @webflow/cli
```

### 2. Authenticate with Webflow

```bash
npx wf auth
```

This will open your browser to authenticate with your Webflow account.

### 3. Build and Publish Your Components

```bash
npx wf publish
```

This command will:
- Bundle your components
- Upload them to Webflow
- Make them available as a shared library in your workspace

### 4. Install Components in Webflow

1. Open your Webflow project
2. Navigate to the **Assets** panel
3. Click **Libraries** (book icon)
4. Find your published library
5. Click **Install** to add it to your site
6. Drag components from the **Add** panel onto your canvas

---

## Best Practices

### 1. Component Design

- **Keep components focused**: Each component should do one thing well
- **Make components reusable**: Use props to make components flexible
- **Include sensible defaults**: Ensure components work out-of-the-box
- **Handle edge cases**: Validate props and handle missing data gracefully

### 2. Props Configuration

- **Use clear naming**: Prop names should be descriptive and self-explanatory
- **Provide defaults**: Always set reasonable default values
- **Group related props**: Use consistent naming patterns for related properties
- **Document behavior**: Use the component description to explain functionality

### 3. Styling

- **Use CSS files**: Keep styles in separate CSS files for maintainability
- **Avoid inline styles**: Use CSS classes for better performance
- **Support customization**: Allow background colors, text colors, and other common styles to be configured
- **Use CSS variables**: Consider using CSS variables for themeable properties

### 4. Performance

- **Optimize renders**: Use `useMemo` and `useCallback` for expensive computations
- **Lazy load when possible**: Use React.lazy for code splitting
- **Clean up effects**: Always clean up event listeners and timers in useEffect
- **Minimize dependencies**: Keep dependency arrays small and specific

### 5. Event Listeners and Mouse Interactions

**Important**: For components that respond to mouse/pointer movement in Webflow:

- ✅ **DO**: Use `window.addEventListener('pointermove', ...)` for reliable mouse tracking
- ❌ **DON'T**: Use `container.addEventListener('mousemove', ...)` - may not work in Webflow

**Why?** Container-level mouse events may not fire reliably in Webflow's environment due to DOM structure, layering, and z-index issues.

**Example:**

```tsx
useEffect(() => {
  const handlePointerMove = (e: PointerEvent) => {
    // Calculate relative position if needed
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      // Use x, y for your logic
    }
  };

  // Use window-level listener
  window.addEventListener('pointermove', handlePointerMove);

  return () => {
    window.removeEventListener('pointermove', handlePointerMove);
  };
}, [dependencies]);
```

This pattern ensures your interactive components work both in standalone React and within Webflow.

### 6. Dependencies

- **External libraries**: Can be used, but bundle size matters
- **Common libraries**: GSAP, OGL, and similar are fine
- **Keep bundle size small**: Users will download your components

---

## Examples

### Example 1: WebGL Particles with Boolean and Array Props

A comprehensive example showing how to handle boolean props, array props, and mouse interactions:

```tsx
// Particles.tsx
import React, { useEffect, useRef } from 'react';
import './Particles.css';

interface ParticlesProps {
  particleCount?: number;
  speed?: number;
  particleColors?: string | string[];  // Accept both types
  moveParticlesOnHover?: boolean | string;  // Accept both types
  alphaParticles?: boolean | string;  // Accept both types
  disableRotation?: boolean | string;  // Accept both types
}

const Particles: React.FC<ParticlesProps> = ({
  particleCount = 200,
  speed = 0.1,
  particleColors,
  moveParticlesOnHover = false,
  alphaParticles = false,
  disableRotation = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse string-based props from Webflow
  const parsedMoveOnHover = typeof moveParticlesOnHover === 'string' 
    ? moveParticlesOnHover === '1' 
    : moveParticlesOnHover;
  
  const parsedAlphaParticles = typeof alphaParticles === 'string' 
    ? alphaParticles === '1' 
    : alphaParticles;
  
  const parsedDisableRotation = typeof disableRotation === 'string' 
    ? disableRotation === '1' 
    : disableRotation;
  
  const parsedColors = typeof particleColors === 'string' 
    ? particleColors.split(',').map(c => c.trim()).filter(Boolean)
    : particleColors;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Use window-level pointer events for Webflow compatibility
    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      // Use x, y for particle movement
    };

    if (parsedMoveOnHover) {
      window.addEventListener('pointermove', handlePointerMove);
    }

    // Render logic using parsedColors, parsedAlphaParticles, etc.
    
    return () => {
      if (parsedMoveOnHover) {
        window.removeEventListener('pointermove', handlePointerMove);
      }
    };
  }, [particleCount, speed, particleColors, moveParticlesOnHover, 
      alphaParticles, disableRotation]);

  return <div ref={containerRef} className="particles-container" />;
};

export default Particles;
```

```tsx
// Particles.webflow.tsx
import Particles from './Particles';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

export default declareComponent(Particles, {
  name: 'Particles',
  description: 'A WebGL particle system with customizable colors and animations',
  group: 'Interactive',
  props: {
    particleCount: props.Number({
      name: 'Particle Count',
      defaultValue: 200,
      min: 10,
      max: 1000,
    }),
    speed: props.Number({
      name: 'Speed',
      defaultValue: 0.1,
      min: 0,
      max: 2,
    }),
    particleColors: props.Text({
      name: 'Particle Colors',
      defaultValue: '#ffffff,#ff0000,#00ff00',
    }),
    moveParticlesOnHover: props.Text({
      name: 'Move On Hover',
      defaultValue: '0',  // "0" = false, "1" = true
    }),
    alphaParticles: props.Text({
      name: 'Alpha Particles',
      defaultValue: '0',
    }),
    disableRotation: props.Text({
      name: 'Disable Rotation',
      defaultValue: '0',
    }),
  },
});
```

**Key Features:**
- Boolean props using Text with "0"/"1" values
- Array prop using comma-separated colors
- Dual type support in TypeScript interface
- Window-level pointer events for Webflow compatibility
- Parsing logic to convert strings to appropriate types

### Example 2: Simple Card Component

A straightforward component with basic props:

```tsx
// Card.tsx
import React from 'react';
import './Card.css';

interface CardProps {
  title: string;
  description: string;
  imageUrl?: string;
  variant?: 'default' | 'featured';
}

export const Card: React.FC<CardProps> = ({
  title,
  description,
  imageUrl,
  variant = 'default'
}) => (
  <div className={`card card--${variant}`}>
    {imageUrl && <img src={imageUrl} alt={title} />}
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);
```

```tsx
// Card.webflow.tsx
import { Card } from './Card';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

export default declareComponent(Card, {
  name: 'Card',
  description: 'A flexible card component',
  group: 'Content',
  props: {
    title: props.Text({
      name: "Title",
      defaultValue: "Card Title",
    }),
    description: props.Text({
      name: "Description",
      defaultValue: "Card description goes here",
    }),
    imageUrl: props.Text({
      name: "Image URL",
      defaultValue: "",
    }),
    variant: props.Variant({
      name: "Variant",
      options: ["default", "featured"],
      defaultValue: "default",
    }),
  },
});
```

---

## Troubleshooting

### Common Issues

1. **Component not appearing in Webflow**
   - Check your `webflow.json` glob pattern
   - Ensure the `.webflow.tsx` file is in the correct location
   - Try running `npx wf publish` again

2. **Props not working**
   - Verify prop names match between React component and Webflow declaration
   - Check that default values are provided
   - Remove unsupported fields like `description` from prop definitions

3. **Boolean props not working**
   - Don't use `props.Boolean()` - it doesn't exist
   - Use `props.Text()` with "0" and "1" values
   - Parse strings to booleans in your component: `value === '1'`
   - Update TypeScript interface to accept `boolean | string`

4. **Array props not working**
   - Use `props.Text()` with comma-separated values
   - Parse strings to arrays: `value.split(',').map(c => c.trim())`
   - Update TypeScript interface to accept `string | string[]` or `string | number[]`

5. **Mouse interactions not working in Webflow**
   - Don't use `container.addEventListener('mousemove', ...)`
   - Use `window.addEventListener('pointermove', ...)` instead
   - This ensures events fire reliably in Webflow's environment
   - Still calculate relative coordinates using `getBoundingClientRect()`

6. **Styling issues**
   - Ensure CSS files are imported in your component
   - Check that styles don't conflict with Webflow's styles
   - Use specific class names to avoid conflicts

7. **Build errors**
   - Check Node.js version (20+ required)
   - Verify all dependencies are installed
   - Look for TypeScript errors in your components

8. **Slot content not extracting (Collection Lists)**
   - Add console.log statements to debug what's being found
   - Ensure you're querying for the `<slot>` element, not direct children
   - Try both direct query and shadow root approaches
   - Use `assignedElements({ flatten: true })` to get slotted content
   - Add multiple timeouts (100ms, 300ms, 1000ms) to handle timing issues
   - Listen for `slotchange` events to catch dynamically added content
   - Verify the slot container has a ref attached
   - Check browser console for your debug logs

9. **Collection List images not appearing**
   - Verify images are being extracted (check console logs)
   - Ensure you're filtering out empty/undefined URLs: `.filter(src => src)`
   - Check that state is being set correctly: `setExtractedImages(imageUrls)`
   - Verify your component re-renders when state updates
   - Make sure the Collection List is actually inside the slot in Webflow
   - Test with a simple array first to ensure rendering works

---

## Resources

- [Webflow DevLink Documentation](https://developers.webflow.com/code-components/introduction)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

---

## Quick Reference

### Prop Type Patterns

| JavaScript Type | Webflow Prop Type | Example Default | Parsing in Component |
|----------------|------------------|-----------------|---------------------|
| `string` | `props.Text()` | `"Hello"` | Direct use |
| `number` | `props.Number()` | `100` | Direct use |
| `boolean` | `props.Text()` | `"0"` or `"1"` | `value === '1'` |
| `string[]` | `props.Text()` | `"a,b,c"` | `value.split(',').map(c => c.trim())` |
| Enum/Union | `props.Variant()` | `"option1"` | Direct use |
| Content Area | `props.Slot()` | N/A | Extract via DOM query |

### TypeScript Interface Pattern

```tsx
interface MyComponentProps {
  // Native types work in React, strings work in Webflow
  name?: string;                    // Text prop
  count?: number;                   // Number prop
  isActive?: boolean | string;      // Text prop with "0"/"1"
  colors?: string | string[];       // Text prop with comma-separated values
  size?: 'small' | 'medium';        // Variant prop
  children?: any;                   // Slot prop for content area
}
```

### Event Listener Pattern for Webflow

```tsx
// ❌ Don't: Container-level events
container.addEventListener('mousemove', handler);

// ✅ Do: Window-level events
window.addEventListener('pointermove', handler);
```

### Slot Extraction Pattern for Collection Lists

```tsx
// Step 1: Create ref and state
const slotRef = useRef(null);
const [extractedData, setExtractedData] = useState([]);

// Step 2: Find slot element (try both approaches)
let slotElement = slotRef.current.querySelector('slot');
if (!slotElement && slotRef.current.getRootNode) {
  const root = slotRef.current.getRootNode();
  if (root && root.host) {
    slotElement = root.querySelector('slot[name="children"]') || root.querySelector('slot');
  }
}

// Step 3: Get assigned elements and extract data
if (slotElement) {
  const assignedElements = slotElement.assignedElements?.({ flatten: true }) || [];
  assignedElements.forEach((element) => {
    // Extract images, text, or other data from element
    const imgs = element.querySelectorAll('img');
    // Process extracted data...
  });
}

// Step 4: Try with delays and listen for changes
useEffect(() => {
  extractData();
  const t1 = setTimeout(extractData, 100);
  const t2 = setTimeout(extractData, 300);
  // Also add slotchange listener...
  return () => { clearTimeout(t1); clearTimeout(t2); };
}, [children]);
```

---

## Summary

Converting React components to Webflow components involves:

1. ✅ Creating your React component with TypeScript interfaces
2. ✅ Creating a `.webflow.tsx` declaration file
3. ✅ Configuring props using Webflow's prop types (Text, Number, Variant, Slot)
4. ✅ Adding parsing logic for boolean and array props
5. ✅ Implementing slot extraction for Collection Lists (using Shadow DOM techniques)
6. ✅ Using window-level event listeners for mouse interactions
7. ✅ Testing locally with a showcase app
8. ✅ Publishing to Webflow using the CLI
9. ✅ Installing and using in Webflow projects

With this workflow, you can build powerful, reusable components in React and make them available to designers in Webflow's visual editor - including components that work seamlessly with Webflow's CMS and Collection Lists!

---

**Happy component building! 🎨**


