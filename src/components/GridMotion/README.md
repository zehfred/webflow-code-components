# GridMotion

Interactive 4×7 tilted image grid that reacts to mouse movement with GSAP animations. Perfect for dynamic CMS image galleries.

## Features

- **4×7 grid layout** with 28 image slots
- **Mouse-reactive movement** - rows shift based on cursor position
- **Collection List integration** - automatically extracts images from CMS
- **Tilted perspective** with customizable rotation angle
- **Smooth GSAP animations** with configurable duration
- **Auto-repeat images** if fewer than 28 provided

## Live Demo

[View live demo →](https://webflow-code-components.webflow.io/components/image-grid-component)

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | slot | - | Collection List with images |
| `imageUrlsJson` | string | '[]' | JSON array of image URLs (optional) |
| `gradientColor` | string | 'black' | Radial gradient background color |
| `rotationAngle` | number | -15 | Grid tilt angle in degrees (-45 to 45) |
| `maxMoveAmount` | number | 300 | Maximum movement intensity (0-1000px) |
| `animationDuration` | number | 0.8 | Animation speed in seconds (0.1-3) |
| `itemBackgroundColor` | string | '#111' | Card background color |
| `borderRadius` | string | '10px' | Card corner rounding |

## Webflow Setup

### Option 1: Collection List (Recommended)

1. **Drag component** onto canvas
2. **Add Collection List** inside the "Images" slot
3. **Connect to Collection** (e.g., Gallery)
4. **Add Image element** inside Collection List Item
5. **Bind Image** to Collection image field
6. **Done!** Images appear in the animated grid

### Option 2: JSON Array

Use the "Image URLs (JSON)" field:
```json
["url1.jpg", "url2.jpg", "url3.jpg"]
```

## Usage

```tsx
import GridMotion from './components/GridMotion';

<GridMotion
  rotationAngle={-15}
  maxMoveAmount={300}
  animationDuration={0.8}
  itemBackgroundColor="#111"
  borderRadius="10px"
>
  {/* Collection List */}
</GridMotion>
```

## Styling Approach

**Hybrid (Props + CSS Variables)** - Primary controls via props with CSS variable overrides available:

- Props provide defaults for quick setup
- CSS variables can override for advanced theming
- Component-specific styling for unique appearance

## Technical Notes

- Uses GSAP for smooth animations
- Shadow DOM slot extraction for Collection List images
- Window-level mouse events for Webflow compatibility
- Mouse enter/leave tracking for performance
- Images repeat automatically if fewer than 28
- SSR disabled (requires browser APIs)
- GSAP lag smoothing disabled for smooth animations in Webflow
