# Webflow Code Components Documentation

Complete guide to building and importing React components into Webflow.

## Table of Contents

### Getting Started
- **[Getting Started](./getting-started.md)** - Project setup, installation, and first component

### Core Concepts
- **[Component Declaration](./component-declaration.md)** - Using `declareComponent` to define components
- **[Prop Types](./prop-types.md)** - All available prop types and their usage
- **[Wrapper Components](./wrapper-components.md)** - Transforming complex prop values for your React components
- **[Webflow Hooks](./hooks.md)** - `useWebflowContext` and other Webflow-specific hooks

### Architecture & Patterns
- **[Architecture](./architecture.md)** - Shadow DOM, React roots, and SSR
- **[Component Communication](./component-communication.md)** - Sharing state between isolated components
- **[Data Fetching](./data-fetching.md)** - Working with external APIs
- **[Styling Components](./styling.md)** - CSS strategies for Shadow DOM

### Development & Deployment
- **[Webflow CLI](./cli-reference.md)** - Commands for bundling and importing
- **[Webflow Designer MCP](./webflow-designer-mcp.md)** - Managing Webflow sites with MCP tools (optional)
- **[Best Practices](./best-practices.md)** - Recommendations and patterns
- **[Troubleshooting](./troubleshooting.md)** - Common issues and solutions

## Quick Links

- [Official Webflow Code Components Documentation](https://developers.webflow.com/code-components)
- [Webflow CLI Reference](https://developers.webflow.com/code-components/reference/cli)
- [Prop Types Reference](https://developers.webflow.com/code-components/reference/prop-types)

## Overview

Code components allow you to import React components into Webflow, making them available to designers in the Webflow Designer. Each component runs in an isolated Shadow DOM environment with its own React root, ensuring no conflicts with other components or the page.

### Key Features

- **Type-safe props** - Define configurable properties with TypeScript
- **Shadow DOM isolation** - Styles and state are encapsulated
- **Server-side rendering** - Optional SSR for improved performance
- **Designer-friendly** - Components appear in the Webflow Designer with editable props

### Quick Start

1. Install dependencies:
   ```bash
   npm i --save-dev @webflow/webflow-cli @webflow/react @webflow/data-types
   ```

2. Create a component definition file:
   ```tsx
   // Button.webflow.tsx
   import { declareComponent } from '@webflow/react';
   import { props } from '@webflow/data-types';
   import { Button } from './Button';

   export default declareComponent(Button, {
     name: 'Button',
     props: {
       text: props.Text({ name: 'Text', defaultValue: 'Click me' }),
       variant: props.Variant({ name: 'Style', options: ['primary', 'secondary'] }),
     },
   });
   ```

3. Import to Webflow:
   ```bash
   npx webflow library share
   ```

See [Getting Started](./getting-started.md) for detailed instructions.
