# MagnetLines

Grid of lines that rotate to point at the cursor position like magnetic needles, creating a magnetic field effect.

## Features

- **Magnetic rotation** - lines follow cursor position
- **Customizable grid** - adjust rows and columns
- **Flexible sizing** - supports viewport units (vmin, vh, vw) and pixels
- **Performance optimized** - mouse enter/leave tracking
- **Responsive design** - works at any screen size

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `rows` | number | 9 | Number of rows in grid (3-20) |
| `columns` | number | 9 | Number of columns in grid (3-20) |
| `containerSize` | string | '60vmin' | Overall container size (CSS value) |
| `lineHeight` | string | '4vmin' | Height of each line |
| `lineWidth` | string | '4vmin' | Width of each line |
| `borderRadius` | string | '2px' | Corner rounding of lines |
| `gap` | string | '0px' | Spacing between lines |
| `backgroundColor` | string | '#000000' | Background color |
| `baseAngle` | number | 0 | Base rotation angle (-90 to 90 degrees) |

## Usage

```tsx
import MagnetLines from './components/MagnetLines';

<MagnetLines
  rows={9}
  columns={9}
  containerSize="60vmin"
  lineColor="#00ff00"
  baseAngle={0}
/>
```

## Styling Approach

**Component Props** - All properties configured through props for direct control and easy customization in Webflow.

## Technical Notes

- Window-level pointer events for Webflow compatibility
- Mouse enter/leave tracking to prevent unnecessary calculations
- Uses CSS transforms for smooth rotation
- Calculates angle using Math.atan2 for precise pointing
- SSR disabled (requires browser APIs)
- Lightweight vanilla JavaScript implementation
