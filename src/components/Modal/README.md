# Modal Component

A centered modal dialog component that opens when clicking trigger elements. Features backdrop overlay, close button, keyboard support, and focus management.

## Features

- **Trigger-based opening**: Opens when clicking elements with `data-modal-trigger` attribute
- **Multiple close methods**: Close button, ESC key, or backdrop click
- **Body scroll lock**: Prevents page scrolling when modal is open
- **Focus management**: Traps focus inside modal and returns to trigger on close
- **Designer preview mode**: Toggle visibility in Webflow Designer for easy styling
- **Customizable styling**: Control colors, sizing, spacing, and animations via props
- **Accessibility**: Full keyboard navigation, ARIA labels, and screen reader support
- **Smooth animations**: Fade in/out transitions with reduced motion support

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | Text | `'modal'` | Unique identifier that matches `data-modal-trigger` value |
| `showInDesigner` | Boolean | `false` | Show modal in Designer for styling (hide for normal page view) |
| `animationDuration` | Number | `0.3` | Animation speed in seconds (0.1-2) |
| `backgroundColor` | Text | `'#ffffff'` | Modal background color |
| `maxWidth` | Text | `'600px'` | Maximum width of the modal |
| `maxHeight` | Text | `'80vh'` | Maximum height of the modal |
| `padding` | Text | `'32px'` | Padding inside the modal |
| `borderRadius` | Text | `'8px'` | Border radius of the modal |
| `backdropColor` | Text | `'rgba(0, 0, 0, 0.5)'` | Backdrop color (supports hex, rgb, rgba, hsl, etc.) |
| `backdropBlur` | Text | `'0px'` | Backdrop blur amount (e.g., 8px, 16px) |
| `closeButtonColor` | Text | `'#666666'` | Close button icon color |
| `closeButtonSize` | Text | `'32px'` | Close button size |
| `closeButtonHoverColor` | Text | `'#000000'` | Close button icon hover color |
| `closeButtonBorderRadius` | Text | `'4px'` | Close button border radius |
| `closeButtonPadding` | Text | `'8px'` | Close button padding |
| `closeButtonBgColor` | Text | `'rgba(255, 255, 255, 0.9)'` | Close button background color |
| `closeButtonHoverBgColor` | Text | `'rgba(255, 255, 255, 1)'` | Close button hover background color |
| `closeButtonStrokeWidth` | Text | `'2'` | Close button icon line thickness (1=thin, 2=normal, 3=bold) |

## Webflow Setup

### 1. Add the Modal Component

Drag the Modal component onto your canvas and configure:
- Set a unique **Modal ID** (e.g., `contact-modal`)
- Keep **Show in Designer** ON while styling
- Customize colors, spacing, and animation settings

### 2. Add Content

Click inside the **Modal Content** slot and add any Webflow elements:
- Text blocks, headings
- Images, videos
- Forms, buttons
- Collection lists
- Any other Webflow elements

### 3. Create Trigger Element

Add any element (button, link, etc.) and set a custom attribute:
- **Attribute name**: `data-modal-trigger`
- **Attribute value**: Your modal ID (e.g., `contact-modal`)

Example:
```html
<button data-modal-trigger="contact-modal">Open Contact Form</button>
<a href="#" data-modal-trigger="contact-modal">View Details</a>
<div data-modal-trigger="contact-modal">Click me</div>
```

### 4. Hide Modal When Done Styling

Toggle **Show in Designer** to OFF to:
- Hide the modal from Designer view
- See your page without the modal overlay
- Modal still works on published site

## Usage Example

```jsx
// In Webflow Designer:
// 1. Add Modal component with ID "signup-modal"
// 2. Add form and content inside the slot
// 3. Add button with data-modal-trigger="signup-modal"

// Result:
<Modal
  id="signup-modal"
  maxWidth="500px"
  padding="40px"
  backdropColor="rgba(0, 0, 0, 0.7)"
>
  <h2>Sign Up for Updates</h2>
  <form>
    <input type="email" placeholder="Your email" />
    <button type="submit">Subscribe</button>
  </form>
</Modal>

<button data-modal-trigger="signup-modal">Join Newsletter</button>
```

## Styling Approach

All styling is controlled via component props in Webflow Designer:

- **Direct values**: `#FF0000`, `600px`, `32px`, `rgba(0, 0, 0, 0.5)`
- **CSS variables**: `var(--primary-color)`, `var(--modal-width)`

### Backdrop Styling

**Backdrop Color**:
The `backdropColor` prop accepts any CSS color format:
- Hex: `#000000`
- RGB: `rgb(0, 0, 0)`
- RGBA: `rgba(0, 0, 0, 0.5)` (recommended for transparency)
- HSL: `hsl(0, 0%, 0%)`
- HSLA: `hsla(0, 0%, 0%, 0.5)`

**Backdrop Blur**:
Apply a blur effect to content behind the modal:
- No blur: `0px` (default)
- Light blur: `4px` - `8px`
- Medium blur: `12px` - `16px`
- Heavy blur: `20px` or more

### Webflow Variables

To use Webflow Variables:
1. Create variables in **Project Settings → Variables**
2. Reference in props: `var(--variable-name)`
3. Example: `var(--colors-primary)` or `var(--spacing-lg)`

## Accessibility Features

- **Keyboard navigation**: Tab/Shift+Tab to move between focusable elements
- **ESC key**: Closes the modal
- **Focus trap**: Keeps keyboard focus inside modal when open
- **Focus restoration**: Returns focus to trigger element on close
- **ARIA attributes**: Proper roles and labels for screen readers
- **Body scroll lock**: Prevents page scroll while modal is open
- **Reduced motion**: Respects `prefers-reduced-motion` setting

## Technical Implementation

### Mode Detection

The Modal component uses Webflow's `useWebflowContext()` hook to detect the current environment:

```tsx
import { useWebflowContext } from '@webflow/react';

const { mode } = useWebflowContext();
const isInDesignerCanvas = mode === 'design';
const isInPreviewMode = mode === 'preview';
```

**How it works:**
- **Designer Canvas** (`mode === 'design'`): Triggers blocked, `showInDesigner` controls visibility
- **Preview Mode** (`mode === 'preview'`): Triggers work normally, allowing testing in Designer
- **Published Page** (mode undefined): Triggers work normally for end users

This ensures designers can click and edit trigger elements in the canvas without accidentally opening the modal. When in Preview mode, designers can test the full functionality. On published pages, the modal works as expected.

### Event Handling

The component uses document-level event delegation with mode-aware guards:

```tsx
useEffect(() => {
  if (isInDesignerCanvas) return; // Block in canvas

  const handleClick = (e: MouseEvent) => {
    const trigger = e.target.closest(`[data-modal-trigger="${id}"]`);
    if (trigger) openModal();
  };

  document.addEventListener('click', handleClick);
  return () => document.removeEventListener('click', handleClick);
}, [id, isInDesignerCanvas]);
```

## Technical Notes

- **Shadow DOM**: Runs in isolated Shadow DOM (site styles don't affect modal)
- **SSR disabled**: Requires browser APIs (not rendered server-side)
- **Event handling**: Uses document-level event delegation for triggers
- **Mode detection**: Uses official `useWebflowContext()` hook for environment detection
- **MutationObserver**: Detects dynamically added trigger elements
- **Multiple modals**: Only one modal open at a time
- **React 19**: Compatible with latest React features

## Browser Support

Works in all modern browsers with Shadow DOM support:
- Chrome/Edge 53+
- Firefox 63+
- Safari 10+
- Opera 40+
