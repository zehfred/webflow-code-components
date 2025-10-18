# Prop Types

Define configurable properties for designers to edit in the Webflow Designer.

## Overview

Prop types define the properties that designers can configure in the Webflow Designer. When you create a code component, you specify which React component properties to expose and how they should appear in Webflow.

## Basic Usage

```tsx
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';
import { Button } from './Button';

export default declareComponent(Button, {
  name: 'Button',
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

## Available Prop Types

### Text

Single line text input.

```tsx
props.Text({
  name: 'Title',
  defaultValue: 'Hello World',
  group: 'Content',           // Optional
  tooltip: 'Main heading text' // Optional
})
```

**Returns:** `string`

**Use for:** Short text, labels, single-line content

---

### Rich Text

Multi-line text with formatting support.

```tsx
props.RichText({
  name: 'Description',
  defaultValue: 'Enter your description here',
  group: 'Content',
  tooltip: 'Supports multiple lines'
})
```

**Returns:** `string`

**Use for:** Paragraphs, descriptions, multi-line content

---

### Text Node

Text that designers can edit directly on the canvas.

```tsx
props.TextNode({
  name: 'Heading',
  defaultValue: 'Edit me on canvas',
  group: 'Content'
})
```

**Returns:** `string`

**Use for:** Headings and text that should be editable in the canvas view

---

### Link

URL input with validation.

```tsx
props.Link({
  name: 'Button Link',
  group: 'Navigation'
})
```

**Returns:** Object with the following structure:
```typescript
{
  href: string;
  target?: "_self" | "_blank" | string;
  preload?: "prerender" | "prefetch" | "none" | string;
}
```

**Use for:** URLs, navigation links

**Note:** Link props return an object. See [Wrapper Components](./wrapper-components.md) if your React component expects separate `href` and `target` props.

---

### Image

Image upload and selection.

```tsx
props.Image({
  name: 'Hero Image',
  group: 'Media'
})
```

**Returns:** Image URL as `string`

**Use for:** Images, photos, graphics

---

### Number

Numeric input with validation.

```tsx
props.Number({
  name: 'Opacity',
  defaultValue: 1,
  min: 0,
  max: 1,
  decimals: 2,
  group: 'Style',
  tooltip: 'Opacity from 0 to 1'
})
```

**Configuration:**
- `min` - Minimum value
- `max` - Maximum value
- `decimals` - Number of decimal places (0 for integers)

**Returns:** `number`

**Use for:** Counts, sizes, opacity, duration, any numeric values

---

### Boolean

True/false toggle.

```tsx
props.Boolean({
  name: 'Show Icon',
  defaultValue: true,
  group: 'Display',
  tooltip: 'Toggle icon visibility'
})
```

**Returns:** `boolean`

**Use for:** Feature toggles, visibility flags, enable/disable options

---

### Variant

Dropdown with predefined options.

```tsx
props.Variant({
  name: 'Size',
  options: ['small', 'medium', 'large'],
  defaultValue: 'medium',
  group: 'Style'
})
```

**Returns:** One of the option values as `string`

**Use for:** Style variants, size options, predefined choices

---

### Visibility

Show/hide controls for conditional rendering.

```tsx
props.Visibility({
  name: 'Button Visibility',
  defaultValue: true,
  group: 'Button'
})
```

**Returns:** `boolean`

**Use for:** Conditional display of component sections

---

### Slot

Content areas where designers can add other components.

```tsx
props.Slot({
  name: 'Card Content',
  tooltip: 'Add components here'
})
```

**Returns:** React children (`ReactNode`)

**Use for:** Flexible content areas, component composition

**Example:**
```tsx
interface CardProps {
  children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children }) => {
  return (
    <div className="card">
      {children}
    </div>
  );
};
```

---

### Color

⚠️ **NOT YET AVAILABLE** - This prop type is documented but not yet available in the current Webflow release.

Color picker for custom color selection.

```tsx
props.Color({
  name: 'Background Color',
  defaultValue: '#007bff',
  group: 'Style'
})
```

**Returns:** `string` (hex color code)

**Use for:** Custom colors, theme colors, brand colors

---

### ID

⚠️ **NOT YET AVAILABLE** - This prop type is documented but not yet available in the current Webflow release.

HTML element ID.

```tsx
props.ID({
  name: 'Element ID',
  group: 'Advanced'
})
```

**Returns:** `string`

**Use for:** HTML element IDs for anchors, form labels, accessibility

---

## Prop Configuration

### Common Properties

All prop types support these common properties:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | string | Yes | Display name in Webflow Designer |
| `defaultValue` | varies | No | Default value for the prop |
| `group` | string | No | Group related props together |
| `tooltip` | string | No | Help text shown in Designer |

### Grouping Props

Use the `group` property to organize related props:

```tsx
props: {
  // Content group
  title: props.Text({ name: 'Title', group: 'Content' }),
  description: props.RichText({ name: 'Description', group: 'Content' }),

  // Button group
  buttonText: props.Text({ name: 'Text', group: 'Button' }),
  buttonVisible: props.Visibility({ name: 'Visibility', group: 'Button' }),
  buttonVariant: props.Variant({
    name: 'Style',
    group: 'Button',
    options: ['primary', 'secondary'],
  }),
}
```

## Best Practices

### 1. Provide Default Values

Always set meaningful defaults so components work immediately:

```tsx
// ✅ Good
text: props.Text({
  name: 'Button Text',
  defaultValue: 'Click me'  // Works out of the box
})

// ❌ Avoid
text: props.Text({
  name: 'Button Text'  // Empty by default
})
```

### 2. Use Clear, Concise Names

Keep names short and in title case:

```tsx
// ✅ Good
props.Text({ name: 'Hero Title' })

// ❌ Avoid
props.Text({ name: 'The main title text that appears at the top' })
```

### 3. Add Helpful Tooltips

Provide context for complex or non-obvious props:

```tsx
animationDuration: props.Number({
  name: 'Duration',
  defaultValue: 0.3,
  min: 0.1,
  max: 2,
  decimals: 1,
  tooltip: 'Animation duration in seconds (lower = faster)'
})
```

### 4. Group Related Props

Organize props that work together:

```tsx
// All button-related props in one group
buttonText: props.Text({ name: 'Text', group: 'Button' }),
buttonLink: props.Link({ name: 'Link', group: 'Button' }),
buttonVariant: props.Variant({ name: 'Style', group: 'Button' }),
```

### 5. Use Appropriate Types

Choose the right prop type for the data:

```tsx
// ✅ Good - Use Boolean for toggles
showIcon: props.Boolean({ name: 'Show Icon', defaultValue: true })

// ❌ Avoid - Don't use Text for boolean values
showIcon: props.Text({ name: 'Show Icon', defaultValue: '1' })

// ✅ Good - Use Variant for predefined choices
size: props.Variant({ name: 'Size', options: ['small', 'medium', 'large'] })

// ❌ Avoid - Don't use Text for limited options
size: props.Text({ name: 'Size', defaultValue: 'medium' })
```

## Complete Example

Here's a comprehensive example using multiple prop types:

```tsx
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';
import { Card } from './Card';

export default declareComponent(Card, {
  name: 'Card',
  description: 'A flexible card component',
  group: 'Content',

  props: {
    // Content
    title: props.Text({
      name: 'Title',
      defaultValue: 'Card Title',
      group: 'Content',
    }),
    description: props.RichText({
      name: 'Description',
      defaultValue: 'Card description text',
      group: 'Content',
    }),
    image: props.Image({
      name: 'Image',
      group: 'Content',
    }),

    // Layout
    variant: props.Variant({
      name: 'Layout',
      options: ['horizontal', 'vertical'],
      defaultValue: 'vertical',
      group: 'Layout',
    }),

    // Button
    buttonVisible: props.Visibility({
      name: 'Visibility',
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

    // Style
    elevation: props.Number({
      name: 'Shadow Depth',
      defaultValue: 2,
      min: 0,
      max: 5,
      decimals: 0,
      group: 'Style',
    }),
    rounded: props.Boolean({
      name: 'Rounded Corners',
      defaultValue: true,
      group: 'Style',
    }),
  },
});
```

## Next Steps

- **[Wrapper Components](./wrapper-components.md)** - Handle complex prop return values
- **[Component Declaration](./component-declaration.md)** - Complete `declareComponent` reference
- **[Best Practices](./best-practices.md)** - More tips and patterns
