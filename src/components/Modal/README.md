# Modal Component

A flexible dialog overlay component that displays content requiring attention or additional information. Supports deep linking, keyboard navigation, and full accessibility features.

## Features

- **Data-attribute triggers** - Open modal from any element on the page
- **Hash URL integration** - Deep linking support and browser back button to close
- **SEO-friendly** - SSR-enabled, content is crawlable
- **Full accessibility** - ARIA attributes, focus trap, keyboard navigation
- **Customizable animations** - Fade, scale, slide, or none
- **Preview mode** - Toggle visibility in Webflow Designer for editing
- **Responsive placement** - Auto-adjusts position on mobile vs desktop

## How to Use

### 1. Add Modal Component to Page

Place the Modal component anywhere on your page and give it a unique ID.

### 2. Create Trigger Elements

Add the `data-modal-trigger` attribute to any element (button, link, div, etc.) with the modal's ID as the value:

```html
<a href="#" data-modal-trigger="my-modal">Open Modal</a>
<button data-modal-trigger="my-modal">Click Me</button>
<div data-modal-trigger="my-modal">Or Click Here</div>
```

### 3. Add Content to Modal

Use the Content slot in the Modal component to add any content you want:

- Headings and text
- Forms and inputs
- Images and videos
- Webflow Collection Lists
- Any other Webflow elements

### 4. Optional: Add Close Buttons Inside Content

You can add custom close buttons anywhere in your modal content:

```html
<button data-modal-close>Close</button>
<button data-modal-close="my-modal">Close This Modal</button>
```

The first version closes any modal, the second only closes the specified modal.

## Props

### Core Settings

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| Modal ID | ID | - | Unique identifier for the modal (required) |
| Modal Content | Slot | - | Content area for all modal content |

### Designer

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| Preview Mode | Boolean | true | Show modal in Designer for editing |

### Layout

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| Placement | Variant | Auto | Modal position: Auto, Top, Bottom, Center, Top Center, Bottom Center |
| Scroll Behavior | Variant | Inside | Inside = content scrolls, Outside = modal scrolls |
| Max Width | Text | - | Custom max-width (e.g., "600px", "80vw") |
| Max Height | Text | - | Custom max-height (e.g., "90vh", "800px") |

### Style

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| Backdrop | Variant | Opaque | Overlay style: Opaque, Blur, Transparent, None |
| Border Radius | Text | 12px | CSS border-radius value |
| Shadow | Text | 0 10px 40px rgba(0,0,0,0.1) | CSS box-shadow value |
| Background Color | Color | #ffffff | Modal background color |
| Padding | Text | 24px | CSS padding value |

### Close Button

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| Show Close Button | Boolean | true | Display built-in X close button |
| Close Button Color | Color | #000000 | Color of the X close icon |
| Close Button Position | Variant | Top Right | Position: Top Right, Top Left, Inside Right, Inside Left |

### Behavior

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| Close on Backdrop Click | Boolean | true | Allow closing by clicking outside modal |
| Close on Escape | Boolean | true | Allow closing with ESC key |
| Block Page Scroll | Boolean | true | Prevent scrolling page behind modal |
| Update URL Hash | Boolean | true | Add #modal-id to URL when opened |
| Initial State | Variant | Closed | Starting state: Closed or Open |

### Animation

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| Animation | Variant | Fade Scale | Animation style: Fade, Fade Scale, Slide Up, Slide Down, None |
| Animation Duration | Number | 300 | Duration in milliseconds (0-2000) |

### Advanced

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| Z-Index | Number | 9999 | Stacking order (higher = on top) |

## Placement Options

- **Auto** - Center on desktop, bottom on mobile (recommended)
- **Top** - Always at top of screen
- **Bottom** - Always at bottom of screen
- **Center** - Always centered
- **Top Center** - Top on mobile, center on desktop
- **Bottom Center** - Bottom on mobile, center on desktop

## Deep Linking with URL Hash

When `Update URL Hash` is enabled (default), the modal:

1. Updates the URL to `yoursite.com/page#modal-id` when opened
2. Can be opened directly via URL: `yoursite.com/page#modal-id`
3. Closes when user clicks browser back button
4. Only one modal can be open at a time (tracked via URL hash)

This is useful for sharing links to specific content or allowing users to bookmark modal states.

## Styling with CSS Variables

For advanced customization beyond the props, you can use CSS variables in your Webflow page styles:

```css
:root {
  --modal-bg-color: #ffffff;
  --modal-text-color: #000000;
  --modal-overlay-bg: rgba(0, 0, 0, 0.5);
  --modal-overlay-opacity: 1;
  --modal-border-radius: 12px;
  --modal-padding: 24px;
  --modal-max-width: 600px;
  --modal-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  --modal-animation-duration: 300ms;
}
```

## Accessibility Features

- **ARIA attributes** - `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- **Focus trap** - Tab/Shift+Tab cycles through modal elements only
- **Focus management** - Focus moves to first interactive element on open, returns to trigger on close
- **Keyboard support** - ESC to close (configurable)
- **Screen reader support** - Announces modal open/close states
- **Inert background** - Page content behind modal is inert when modal is open

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- SSR compatible (content rendered on server)
- Mobile Safari touch scroll support
- Backdrop blur requires modern browser (graceful degradation)

## Common Use Cases

### Contact Form Modal
Add a form inside the modal content slot for user inquiries.

### Video Player Modal
Embed videos that open in a modal overlay.

### Image Gallery Modal
Display full-size images with navigation controls.

### Terms & Conditions Modal
Show legal content without leaving the page.

### Sign Up / Login Modal
Authentication forms in an overlay.

### Product Quick View
E-commerce product details without page navigation.

## Tips

1. **Preview Mode** - Keep enabled while designing, disable to see page underneath
2. **Close Button Position** - Use "Top Right" for outside modal, "Inside Right" for within content area
3. **Backdrop Blur** - Creates modern glassmorphism effect but may impact performance on older devices
4. **Scroll Behavior** - Use "Inside" for shorter modals, "Outside" for very tall content
5. **Animation Duration** - Keep between 200-400ms for best UX
6. **Max Width** - Set to `80vw` for responsive modals that work on all screen sizes

## Troubleshooting

**Modal doesn't open when clicking trigger:**
- Verify the `data-modal-trigger` value matches the Modal ID exactly
- Check browser console for errors
- Ensure JavaScript is enabled

**Content not visible:**
- Check that Preview Mode is enabled in Designer
- Verify Initial State is set to "Open" for testing
- Check background color contrast

**Modal opens but can't close:**
- Enable "Close on Backdrop Click" or "Close on Escape"
- Add a `data-modal-close` button in the content

**URL hash not updating:**
- Enable "Update URL Hash" in Behavior settings
- Check that Modal ID is valid (no spaces or special characters)

**Focus not trapping correctly:**
- Ensure modal has focusable elements (links, buttons, inputs)
- Check that there's at least one interactive element in the content

## Technical Notes

- **SSR Support**: Yes - modal renders in DOM (hidden by default) for SEO
- **Shadow DOM**: Component uses Shadow DOM, styles are isolated
- **Browser APIs**: Uses modern APIs (focus trap, inert, hash routing)
- **Event Delegation**: Single global listener for all triggers (performance optimized)
- **Memory Management**: Cleans up all event listeners on unmount
- **Single Modal Rule**: Only one modal can be open at a time
