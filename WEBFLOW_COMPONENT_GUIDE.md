# Creating Webflow Components from React Components

A comprehensive guide to converting existing React components into Webflow code components using DevLink.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
3. [Component Structure](#component-structure)
4. [Creating a Webflow Component Definition](#creating-a-webflow-component-definition)
5. [Available Prop Types](#available-prop-types)
6. [Testing Your Components](#testing-your-components)
7. [Publishing to Webflow](#publishing-to-webflow)
8. [Best Practices](#best-practices)
9. [Examples](#examples)

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

### Important Notes on Props

1. **Keep it simple**: Webflow best supports Text, Number, and Variant prop types
2. **No descriptions on prop fields**: The API doesn't support description fields within prop definitions
3. **Boolean values**: Use Variant with ["true", "false"] options for boolean-like behavior
4. **Arrays**: For complex props like color arrays, handle them in your React component and expose simplified controls

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

### 5. Dependencies

- **External libraries**: Can be used, but bundle size matters
- **Common libraries**: GSAP, OGL, and similar are fine
- **Keep bundle size small**: Users will download your components

---

## Examples

### Example 1: Interactive Dot Grid

A complex component with animations and mouse interactions:

```tsx
// DotGrid.tsx
import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import './DotGrid.css';

export interface DotGridProps {
  dotSize?: number;
  gap?: number;
  baseColor?: string;
  backgroundColor?: string;
  multicolor?: boolean;
  colorPalette?: string[];
}

const DotGrid: React.FC<DotGridProps> = ({
  dotSize = 10,
  gap = 15,
  baseColor = '#5227FF',
  backgroundColor = 'transparent',
  multicolor = false,
  colorPalette = ['#FF0000', '#00FF00', '#0000FF'],
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Implementation...
  
  return (
    <section style={{ backgroundColor }}>
      <canvas ref={canvasRef} />
    </section>
  );
};

export default DotGrid;
```

```tsx
// DotGrid.webflow.tsx
import DotGrid from './DotGrid';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

export default declareComponent(DotGrid, {
  name: 'DotGrid',
  description: 'Interactive dot grid with mouse tracking',
  group: 'Interactive',
  props: {
    dotSize: props.Number({
      name: 'Dot Size',
      defaultValue: 10,
      min: 1,
      max: 50,
    }),
    gap: props.Number({
      name: 'Gap',
      defaultValue: 15,
      min: 1,
      max: 100,
    }),
    // Add more props...
  },
});
```

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

3. **Styling issues**
   - Ensure CSS files are imported in your component
   - Check that styles don't conflict with Webflow's styles
   - Use specific class names to avoid conflicts

4. **Build errors**
   - Check Node.js version (20+ required)
   - Verify all dependencies are installed
   - Look for TypeScript errors in your components

---

## Resources

- [Webflow DevLink Documentation](https://developers.webflow.com/code-components/introduction)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

---

## Summary

Converting React components to Webflow components involves:

1. ✅ Creating your React component with TypeScript interfaces
2. ✅ Creating a `.webflow.tsx` declaration file
3. ✅ Configuring props using Webflow's prop types
4. ✅ Testing locally with a showcase app
5. ✅ Publishing to Webflow using the CLI
6. ✅ Installing and using in Webflow projects

With this workflow, you can build powerful, reusable components in React and make them available to designers in Webflow's visual editor!

---

**Happy component building! 🎨**


