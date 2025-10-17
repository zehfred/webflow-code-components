# Getting Started

Learn how to set up your React project for Webflow code components and create your first component.

## Installation

### 1. Install Required Dependencies

Install the Webflow CLI and necessary packages:

```bash
npm i --save-dev @webflow/webflow-cli @webflow/react @webflow/data-types
```

**What you get:**
- `@webflow/webflow-cli` - CLI for publishing components to Webflow
- `@webflow/react` - React utilities for code components
- `@webflow/data-types` - TypeScript definitions for Webflow props

### 2. Configure webflow.json

Create a `webflow.json` file in your project root:

```json
{
  "library": {
    "name": "My Component Library",
    "components": ["./src/**/*.webflow.@(js|jsx|mjs|ts|tsx)"],
    "bundleConfig": "./webpack.webflow.js"
  }
}
```

| Field | Description | Required |
|-------|-------------|----------|
| `library.name` | The name of your component library as it appears in Webflow | Yes |
| `library.components` | Glob pattern matching your component definition files | Yes |
| `library.bundleConfig` | Path to custom webpack configuration (optional) | No |

### 3. Authenticate with Webflow

#### Get Your Workspace API Token

You need a Workspace API token to publish components:

1. Open your Webflow workspace
2. Navigate to **Apps & Integrations**
3. Click **Manage** in the left sidebar
4. Scroll to **Workspace API Access**
5. Click **Generate API Token** and copy it

**Note:** You must be a Workspace Admin to generate tokens.

#### Add Token to .env

Create a `.env` file in your project root:

```bash
WEBFLOW_WORKSPACE_API_TOKEN=your_token_here
```

**Security:** Always add `.env` to your `.gitignore` file.

#### Alternative: Manual Authentication

You can also authenticate via the CLI:

```bash
npx webflow library share --api-token <your-api-token>
```

## Create Your First Component

### 1. Create a React Component

First, create a standard React component:

```tsx
// src/components/Button/Button.tsx
import React from 'react';
import styles from './Button.module.css';

export interface ButtonProps {
  text: string;
  variant: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ text, variant }) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]}`}
      type="button"
    >
      {text}
    </button>
  );
};
```

### 2. Add Styles

Create a CSS module for your component:

```css
/* src/components/Button/Button.module.css */
.button {
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.primary {
  background-color: #007bff;
  color: white;
}

.primary:hover {
  background-color: #0056b3;
}

.secondary {
  background-color: #6c757d;
  color: white;
}

.secondary:hover {
  background-color: #545b62;
}
```

### 3. Create Component Definition

Create a `.webflow.tsx` file to declare your component for Webflow:

```tsx
// src/components/Button/Button.webflow.tsx
import { declareComponent } from '@webflow/react';
import { props } from '@webflow/data-types';
import { Button } from './Button';
import './Button.module.css';

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
      defaultValue: 'primary',
    }),
  },
});
```

**File Naming:**
- Pattern: `ComponentName.webflow.tsx`
- Must match glob pattern in `webflow.json`
- Keep alongside your React component

### 4. Import to Webflow

Run the import command:

```bash
npx webflow library share
```

The CLI will:
1. Check for authentication (prompt if needed)
2. Bundle your components
3. Ask you to confirm the components to share
4. Upload to your Workspace

### 5. Use in Webflow Designer

1. Open any Webflow project in your workspace
2. Open the **Add** panel (press `A` or click `+`)
3. Navigate to **Libraries** → Your library name
4. Drag your component onto the canvas
5. Edit props in the right panel

## Project Structure

Here's a recommended structure for your components:

```
my-project/
├── .env                          # Workspace token (gitignored)
├── .gitignore
├── webflow.json                  # Webflow configuration
├── webpack.webflow.js            # Optional custom webpack config
├── package.json
└── src/
    └── components/
        ├── Button/
        │   ├── Button.tsx        # React component
        │   ├── Button.module.css # Component styles
        │   └── Button.webflow.tsx # Webflow declaration
        ├── Card/
        │   ├── Card.tsx
        │   ├── Card.module.css
        │   └── Card.webflow.tsx
        └── ...
```

## Next Steps

Now that you have your first component working:

- **[Learn about prop types](./prop-types.md)** - Explore all available prop types
- **[Understand architecture](./architecture.md)** - Learn about Shadow DOM and SSR
- **[Style your components](./styling.md)** - Work with CSS in Shadow DOM
- **[Use Webflow hooks](./hooks.md)** - Access Webflow context in your components

## Common Issues

### Authentication fails
- Verify your token is correct in `.env`
- Ensure you're a Workspace Admin
- Try manual authentication with `--api-token` flag

### Components don't appear
- Check glob pattern in `webflow.json` matches your files
- Ensure files have `.webflow.tsx` extension
- Look for compilation errors in terminal

### Styles not showing
- Import CSS in `.webflow.tsx` file (not just `.tsx`)
- Check Shadow DOM styling limitations
- See [Styling Guide](./styling.md) for details

For more troubleshooting, see the [Troubleshooting Guide](./troubleshooting.md).
