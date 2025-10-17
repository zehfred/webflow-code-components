# Wrapper Components

Learn how to transform complex prop values to match your React component's interface.

## Overview

Some Webflow prop types return objects rather than simple values. For example, `props.Link()` returns an object with `href`, `target`, and `preload` properties. If your React component expects these as separate props, you need to create a wrapper component to transform the data.

## When to Use Wrappers

Use wrapper components when:

- **Complex prop returns** - Prop type returns an object but your component expects individual props
- **Type mismatches** - Need to transform Webflow types to match component interface
- **Data transformation** - Need to parse or restructure prop values

## The Link Prop Pattern

The most common use case is the `props.Link()` type.

### Problem

```tsx
// ❌ Props.Link returns an object:
{
  href: string;
  target?: "_self" | "_blank" | string;
  preload?: "prerender" | "prefetch" | "none" | string;
}

// But your React component expects:
interface ButtonProps {
  buttonText: string;
  href: string;      // ← Separate props
  target: string;    // ← Not an object
}
```

### Solution: Wrapper Component

```tsx
// Button.webflow.tsx
import { props, PropType, PropValues } from "@webflow/data-types";
import { declareComponent } from "@webflow/react";
import React from "react";
import { Button, ButtonProps } from "./Button";

// 1. Define wrapper props type
type WebflowButtonProps = {
  link: PropValues[PropType.Link];  // The Link object
} & Omit<ButtonProps, "href" | "target">; // Remove conflicting props

// 2. Create wrapper component that transforms the props
const WebflowButton = ({
  link: { href, target },  // Destructure Link object
  ...props
}: WebflowButtonProps) => {
  return (
    <Button
      href={href}         // Pass as separate props
      target={target}
      {...props}
    />
  );
};

// 3. Declare the wrapper (not the original component)
export default declareComponent(WebflowButton, {
  name: "Button",
  props: {
    buttonText: props.Text({
      name: "Text",
      defaultValue: "Click me"
    }),
    link: props.Link({ name: "Link" }),  // Returns Link object
  },
});
```

```tsx
// Button.tsx - Your React component stays unchanged
interface ButtonProps {
  buttonText: string;
  href: string;
  target: string;
}

export const Button = ({ buttonText, href, target }: ButtonProps) => {
  return (
    <a href={href} target={target}>
      {buttonText}
    </a>
  );
};
```

## Type Utilities

Webflow provides TypeScript utilities for working with prop types:

### PropType Enum

Enum of all available prop types:

```typescript
import { PropType } from "@webflow/data-types";

PropType.Text
PropType.RichText
PropType.TextNode
PropType.Link
PropType.Image
PropType.Number
PropType.Boolean
PropType.Variant
PropType.Visibility
PropType.Slot
PropType.ID
```

### PropValues Type

Maps prop types to their return values:

```typescript
import { PropValues, PropType } from "@webflow/data-types";

// Get the type returned by props.Link()
type LinkValue = PropValues[PropType.Link];
// Result: { href: string; target?: string; preload?: string }

// Get the type returned by props.Text()
type TextValue = PropValues[PropType.Text];
// Result: string

// Get the type returned by props.Number()
type NumberValue = PropValues[PropType.Number];
// Result: number
```

## Complete Examples

### Example 1: Card with Link

```tsx
// Card.webflow.tsx
import { props, PropType, PropValues } from "@webflow/data-types";
import { declareComponent } from "@webflow/react";
import React from "react";
import { Card, CardProps } from "./Card";

type WebflowCardProps = {
  cardLink: PropValues[PropType.Link];
} & Omit<CardProps, "href" | "target">;

const WebflowCard = ({
  cardLink: { href, target },
  ...restProps
}: WebflowCardProps) => {
  return <Card href={href} target={target} {...restProps} />;
};

export default declareComponent(WebflowCard, {
  name: "Card",
  props: {
    title: props.Text({ name: "Title", defaultValue: "Card Title" }),
    description: props.RichText({
      name: "Description",
      defaultValue: "Description"
    }),
    cardLink: props.Link({ name: "Card Link" }),
  },
});
```

```tsx
// Card.tsx
export interface CardProps {
  title: string;
  description: string;
  href: string;
  target: string;
}

export const Card = ({ title, description, href, target }: CardProps) => {
  return (
    <a href={href} target={target} className="card">
      <h3>{title}</h3>
      <p>{description}</p>
    </a>
  );
};
```

### Example 2: Multiple Transformations

```tsx
// Hero.webflow.tsx
import { props, PropType, PropValues } from "@webflow/data-types";
import { declareComponent } from "@webflow/react";
import React from "react";
import { Hero, HeroProps } from "./Hero";

type WebflowHeroProps = {
  primaryLink: PropValues[PropType.Link];
  secondaryLink: PropValues[PropType.Link];
} & Omit<HeroProps, "primaryHref" | "primaryTarget" | "secondaryHref" | "secondaryTarget">;

const WebflowHero = ({
  primaryLink: { href: primaryHref, target: primaryTarget },
  secondaryLink: { href: secondaryHref, target: secondaryTarget },
  ...restProps
}: WebflowHeroProps) => {
  return (
    <Hero
      primaryHref={primaryHref}
      primaryTarget={primaryTarget}
      secondaryHref={secondaryHref}
      secondaryTarget={secondaryTarget}
      {...restProps}
    />
  );
};

export default declareComponent(WebflowHero, {
  name: "Hero",
  props: {
    title: props.Text({ name: "Title", defaultValue: "Hero Title" }),
    subtitle: props.Text({ name: "Subtitle", defaultValue: "Subtitle" }),
    primaryButtonText: props.Text({
      name: "Primary Button",
      defaultValue: "Get Started",
      group: "Primary CTA"
    }),
    primaryLink: props.Link({
      name: "Primary Link",
      group: "Primary CTA"
    }),
    secondaryButtonText: props.Text({
      name: "Secondary Button",
      defaultValue: "Learn More",
      group: "Secondary CTA"
    }),
    secondaryLink: props.Link({
      name: "Secondary Link",
      group: "Secondary CTA"
    }),
  },
});
```

```tsx
// Hero.tsx
export interface HeroProps {
  title: string;
  subtitle: string;
  primaryButtonText: string;
  primaryHref: string;
  primaryTarget: string;
  secondaryButtonText: string;
  secondaryHref: string;
  secondaryTarget: string;
}

export const Hero = ({
  title,
  subtitle,
  primaryButtonText,
  primaryHref,
  primaryTarget,
  secondaryButtonText,
  secondaryHref,
  secondaryTarget,
}: HeroProps) => {
  return (
    <div className="hero">
      <h1>{title}</h1>
      <p>{subtitle}</p>
      <div className="hero-actions">
        <a href={primaryHref} target={primaryTarget} className="btn-primary">
          {primaryButtonText}
        </a>
        <a href={secondaryHref} target={secondaryTarget} className="btn-secondary">
          {secondaryButtonText}
        </a>
      </div>
    </div>
  );
};
```

### Example 3: Optional Props

Handle optional Link props gracefully:

```tsx
// Card.webflow.tsx
import { props, PropType, PropValues } from "@webflow/data-types";
import { declareComponent } from "@webflow/react";
import React from "react";
import { Card, CardProps } from "./Card";

type WebflowCardProps = {
  cardLink?: PropValues[PropType.Link];
} & Omit<CardProps, "href" | "target">;

const WebflowCard = ({
  cardLink,
  ...restProps
}: WebflowCardProps) => {
  // Handle optional link
  const href = cardLink?.href;
  const target = cardLink?.target || "_self";

  return <Card href={href} target={target} {...restProps} />;
};

export default declareComponent(WebflowCard, {
  name: "Card",
  props: {
    title: props.Text({ name: "Title", defaultValue: "Card Title" }),
    cardLink: props.Link({ name: "Link" }),  // Optional
  },
});
```

## Best Practices

### 1. Keep Original Component Clean

Don't modify your React component to accommodate Webflow props:

```tsx
// ✅ Good - Original component unchanged
export interface ButtonProps {
  href: string;
  target: string;
}

// ❌ Avoid - Don't change original component
export interface ButtonProps {
  link: { href: string; target: string };  // Webflow-specific
}
```

### 2. Use TypeScript Utilities

Leverage `PropType` and `PropValues` for type safety:

```tsx
// ✅ Good - Type-safe
import { PropValues, PropType } from "@webflow/data-types";
type WebflowProps = {
  link: PropValues[PropType.Link];
};

// ❌ Avoid - Manual types prone to errors
type WebflowProps = {
  link: { href: string; target?: string };
};
```

### 3. Name Wrapper Clearly

Use descriptive names for wrapper components:

```tsx
// ✅ Good
const WebflowButton = ({ link, ...props }: WebflowButtonProps) => {
  return <Button href={link.href} target={link.target} {...props} />;
};

// ❌ Avoid - Confusing names
const ButtonWrapper = ({ link, ...props }) => { ... };
```

### 4. Colocate Files

Keep wrapper and component together:

```
components/
  Button/
    Button.tsx          ← Original React component
    Button.webflow.tsx  ← Wrapper + declaration
    Button.module.css
```

## When Wrappers Aren't Needed

You don't need a wrapper if:

1. **Direct prop mapping** - Prop types match component interface
   ```tsx
   // No wrapper needed
   text: props.Text({ name: "Title" })
   // Component expects: title: string
   ```

2. **Component accepts objects** - Component already expects the object structure
   ```tsx
   // No wrapper needed
   interface CardProps {
     link: { href: string; target: string };
   }
   ```

3. **Simple transformations** - Can be handled in component itself
   ```tsx
   // No wrapper needed - component can parse
   colors: props.Text({ defaultValue: "#fff,#000" })
   // Component parses: colors.split(',')
   ```

## Next Steps

- **[Prop Types](./prop-types.md)** - Learn about all available prop types
- **[Component Declaration](./component-declaration.md)** - Complete `declareComponent` reference
- **[Best Practices](./best-practices.md)** - More patterns and tips
