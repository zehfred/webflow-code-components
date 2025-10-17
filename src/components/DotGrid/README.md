# DotGrid

Interactive dot grid background with mouse tracking and physics-based animations using GSAP.

## Features

- **Physics-based animations** with inertia and momentum
- **Mouse tracking** with proximity effects
- **Shock wave effects** on fast mouse movement
- **Customizable appearance** via props
- **Smooth return animations** when mouse leaves

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `dotSize` | number | 10 | Size of each dot (1-50) |
| `gap` | number | 15 | Space between dots (1-100) |
| `proximity` | number | 120 | Distance at which dots react to mouse (0-500) |
| `speedTrigger` | number | 100 | Mouse speed to trigger shock wave (0-1000) |
| `shockRadius` | number | 250 | Radius of shock wave effect (0-1000) |
| `shockStrength` | number | 5 | Intensity of shock wave (0-20) |
| `maxSpeed` | number | 5000 | Maximum dot movement speed (100-10000) |
| `resistance` | number | 750 | How quickly dots slow down (100-2000) |
| `returnDuration` | number | 1.5 | Time to return to original position (0.1-5s) |

## Usage

```tsx
import DotGrid from './components/DotGrid';

<DotGrid
  dotSize={10}
  gap={15}
  proximity={120}
  speedTrigger={100}
/>
```

## Styling Approach

**Component Props** - All visual and behavioral properties are configured through props for maximum control and discoverability in Webflow.

## Technical Notes

- Uses GSAP with InertiaPlugin for smooth physics
- Window-level mouse events for Webflow compatibility
- Mouse enter/leave tracking to optimize performance
- SSR disabled (requires browser APIs)
