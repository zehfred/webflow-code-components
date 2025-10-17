# Component Declaration

Reference for the `declareComponent` function used to create code component definitions.

## Overview

The `declareComponent` function maps your React component to Webflow, defining metadata, props, and configuration options that control how the component appears and behaves in the Webflow Designer.

## Syntax

```typescript
declareComponent(Component, data): void;
```

### Parameters

- **`Component`** - The React component to declare
- **`data`** - Configuration object with metadata, props, and options

## Data Object

The `data` object defines your component's configuration:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | string | Yes | Component name in the Designer |
| `description` | string | No | Description shown in component panel |
| `group` | string | No | Group name for organizing components |
| `props` | object | No | Prop definitions for the Designer |
| `options` | object | No | Advanced configuration options |

## Basic Example

```tsx
import { declareComponent } from '@webflow/react';
import { props } from '@webflow/data-types';
import { Button } from './Button';

export default declareComponent(Button, {
  name: 'Button',
  description: 'A customizable button component',
  group: 'Interactive',

  props: {
    text: props.Text({
      name: 'Button Text',
      defaultValue: 'Click me',
    }),
    variant: props.Variant({
      name: 'Style',
      options: ['primary', 'secondary'],
    }),
  },
});
```

## Metadata Properties

### name (required)

The component name as it appears in the Webflow Designer component panel.

```tsx
declareComponent(Button, {
  name: 'Button',  // Shows as "Button" in Designer
  // ...
});
```

**Best practices:**
- Use title case
- Keep it short and descriptive
- Match the React component name when possible

### description (optional)

A brief description to help designers understand the component's purpose.

```tsx
declareComponent(Card, {
  name: 'Card',
  description: 'A flexible card component with image, title, and description',
  // ...
});
```

**Best practices:**
- One to two sentences max
- Describe what the component does, not how to use it
- Mention key features

### group (optional)

Organize components into groups in the Designer panel.

```tsx
declareComponent(Button, {
  name: 'Button',
  group: 'Interactive',  // Groups with other interactive components
  // ...
});
```

**Common groups:**
- `Interactive` - Buttons, forms, controls
- `Content` - Text, images, cards
- `Layout` - Containers, grids, sections
- `Navigation` - Menus, breadcrumbs, tabs
- `Data Visualization` - Charts, graphs
- `Media` - Video, audio, galleries

## Props Definition

Define which React props should be editable in the Designer:

```tsx
props: {
  // Prop name must match React component prop
  text: props.Text({
    name: 'Button Text',      // Display name in Designer
    defaultValue: 'Click me',
    group: 'Content',          // Optional grouping
    tooltip: 'The button label' // Optional help text
  }),
  variant: props.Variant({
    name: 'Style',
    options: ['primary', 'secondary', 'outline'],
    defaultValue: 'primary'
  }),
}
```

**Key points:**
- Prop names must match your React component's interface
- Each prop type has specific configuration options
- See [Prop Types](./prop-types.md) for complete reference

## Options Object

Advanced configuration for component behavior:

```tsx
options: {
  applyTagSelectors: boolean;  // Default: false
  ssr: boolean;                // Default: true
}
```

### applyTagSelectors

Enable site-wide tag selector styles (h1, p, button, etc.) in your component.

```tsx
declareComponent(Article, {
  name: 'Article',
  options: {
    applyTagSelectors: true,  // Inherit tag styles from site
  },
});
```

**When to use:**
- Component uses semantic HTML tags
- Want to inherit site typography styles
- Need consistent styling with site

**When not to use:**
- Custom styled components
- Need full control over styles
- Component has its own design system

See [Styling Components](./styling.md) for details.

### ssr

Control server-side rendering behavior.

```tsx
declareComponent(Chart, {
  name: 'Chart',
  options: {
    ssr: false,  // Disable SSR
  },
});
```

**Disable SSR when your component:**
- Uses browser-only APIs (`window`, `document`, `localStorage`)
- Requires client-side data
- Has heavy interactive elements
- Uses non-deterministic rendering (random, time-based)

**Keep SSR enabled when:**
- Component renders static content
- Improves SEO
- Benefits from faster initial paint

See [Architecture](./architecture.md#server-side-rendering-ssr) for details.

## Complete Examples

### Example 1: Simple Button

```tsx
import { declareComponent } from '@webflow/react';
import { props } from '@webflow/data-types';
import { Button } from './Button';

export default declareComponent(Button, {
  name: 'Button',
  description: 'A styled button with variants',
  group: 'Interactive',

  props: {
    text: props.Text({
      name: 'Text',
      defaultValue: 'Click me',
    }),
    variant: props.Variant({
      name: 'Variant',
      options: ['primary', 'secondary'],
      defaultValue: 'primary',
    }),
  },
});
```

### Example 2: Complex Card

```tsx
import { declareComponent } from '@webflow/react';
import { props } from '@webflow/data-types';
import { Card } from './Card';

export default declareComponent(Card, {
  name: 'Feature Card',
  description: 'A card with image, text, and optional button',
  group: 'Content',

  props: {
    // Content group
    title: props.Text({
      name: 'Title',
      defaultValue: 'Feature Title',
      group: 'Content',
    }),
    description: props.RichText({
      name: 'Description',
      defaultValue: 'Feature description',
      group: 'Content',
    }),
    image: props.Image({
      name: 'Image',
      group: 'Content',
    }),

    // Button group
    buttonVisible: props.Visibility({
      name: 'Show Button',
      defaultValue: true,
      group: 'Button',
    }),
    buttonText: props.Text({
      name: 'Text',
      defaultValue: 'Learn More',
      group: 'Button',
    }),
    buttonLink: props.Link({
      name: 'Link',
      group: 'Button',
    }),

    // Style group
    variant: props.Variant({
      name: 'Layout',
      options: ['horizontal', 'vertical'],
      defaultValue: 'vertical',
      group: 'Style',
    }),
    elevated: props.Boolean({
      name: 'Shadow',
      defaultValue: true,
      group: 'Style',
    }),
  },

  options: {
    applyTagSelectors: false,
    ssr: true,
  },
});
```

### Example 3: Interactive Component

```tsx
import { declareComponent } from '@webflow/react';
import { props } from '@webflow/data-types';
import { Chart } from './Chart';

export default declareComponent(Chart, {
  name: 'Line Chart',
  description: 'Interactive chart for data visualization',
  group: 'Data Visualization',

  props: {
    dataUrl: props.Text({
      name: 'Data URL',
      tooltip: 'URL to fetch chart data from',
    }),
    height: props.Number({
      name: 'Height',
      defaultValue: 400,
      min: 200,
      max: 800,
      decimals: 0,
    }),
    showLegend: props.Boolean({
      name: 'Show Legend',
      defaultValue: true,
    }),
  },

  options: {
    ssr: false,  // Chart requires client-side rendering
  },
});
```

### Example 4: Container with Slot

```tsx
import { declareComponent } from '@webflow/react';
import { props } from '@webflow/data-types';
import { Section } from './Section';

export default declareComponent(Section, {
  name: 'Section',
  description: 'A section container with customizable padding',
  group: 'Layout',

  props: {
    children: props.Slot({
      name: 'Content',
      tooltip: 'Add components here',
    }),
    padding: props.Variant({
      name: 'Padding',
      options: ['none', 'small', 'medium', 'large'],
      defaultValue: 'medium',
    }),
    backgroundColor: props.Text({
      name: 'Background Color',
      defaultValue: '#ffffff',
      tooltip: 'Hex color code',
    }),
  },
});
```

## File Naming and Location

### Naming Convention

Use the `.webflow.tsx` extension:

```
ComponentName.webflow.tsx
```

**Examples:**
- `Button.webflow.tsx`
- `Card.webflow.tsx`
- `Chart.webflow.tsx`

### File Location

Keep declaration files alongside components:

```
src/
  components/
    Button/
      Button.tsx           ← React component
      Button.module.css    ← Styles
      Button.webflow.tsx   ← Declaration
```

**Warning:** Renaming a declaration file creates a new component in Webflow and removes the old one. Existing instances will break.

## webflow.json Configuration

Configure which files are included in your library:

```json
{
  "library": {
    "name": "My Components",
    "components": ["./src/**/*.webflow.@(js|jsx|mjs|ts|tsx)"]
  }
}
```

The glob pattern determines which declaration files are included.

## Best Practices

### 1. Always Export Default

Declaration must be the default export:

```tsx
// ✅ Good
export default declareComponent(Button, { ... });

// ❌ Wrong
export const buttonDeclaration = declareComponent(Button, { ... });
```

### 2. Provide Complete Metadata

Help designers understand your component:

```tsx
// ✅ Good
declareComponent(Card, {
  name: 'Feature Card',
  description: 'Displays a feature with image, title, and description',
  group: 'Content',
  // ...
});

// ❌ Minimal
declareComponent(Card, {
  name: 'Card',
  // ...
});
```

### 3. Group Related Props

Organize props logically:

```tsx
props: {
  // Content props together
  title: props.Text({ name: 'Title', group: 'Content' }),
  description: props.RichText({ name: 'Description', group: 'Content' }),

  // Button props together
  buttonText: props.Text({ name: 'Text', group: 'Button' }),
  buttonLink: props.Link({ name: 'Link', group: 'Button' }),
}
```

### 4. Set Sensible Defaults

Components should work immediately when added:

```tsx
props: {
  text: props.Text({
    name: 'Text',
    defaultValue: 'Click me',  // ✅ Works out of the box
  }),
}
```

### 5. Add Helpful Tooltips

Guide designers on complex props:

```tsx
dataUrl: props.Text({
  name: 'Data URL',
  tooltip: 'API endpoint that returns JSON data in the format: { labels: string[], values: number[] }',
})
```

## Next Steps

- **[Prop Types](./prop-types.md)** - Explore all available prop types
- **[Wrapper Components](./wrapper-components.md)** - Handle complex prop transformations
- **[Styling](./styling.md)** - Style components in Shadow DOM
- **[Architecture](./architecture.md)** - Understand SSR and isolation
