# Particles

WebGL particle system with customizable colors, animations, and interactive mouse effects using OGL (Optimized WebGL library).

## Features

- **WebGL rendering** for smooth performance with hundreds of particles
- **Multi-color support** - comma-separated hex colors
- **Interactive hover** - particles react to mouse movement
- **Rotating animation** - optional continuous rotation
- **Alpha transparency** - optional fade effects
- **Size randomness** - natural particle distribution
- **Customizable camera** - adjustable distance/perspective

## Live Demo

[View live demo →](https://webflow-code-components.webflow.io/components/particles-component)

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `particleCount` | number | 200 | Number of particles (10-1000) |
| `particleSpread` | number | 10 | Spread of particles in 3D space (1-50) |
| `speed` | number | 0.1 | Animation speed multiplier (0-2) |
| `particleColors` | string | '#ffffff,#ffffff,#ffffff' | Comma-separated hex colors |
| `moveParticlesOnHover` | string | '0' | Enable mouse interaction ('0' or '1') |
| `particleHoverFactor` | number | 1 | Mouse influence intensity (0-5) |
| `alphaParticles` | string | '0' | Enable transparency ('0' or '1') |
| `particleBaseSize` | number | 100 | Base size of particles (10-300) |
| `sizeRandomness` | number | 1 | Size variation multiplier (0-3) |
| `cameraDistance` | number | 20 | Camera distance from particles (5-50) |
| `disableRotation` | string | '0' | Disable auto-rotation ('0' or '1') |

## Usage

```tsx
import Particles from './components/Particles';

<Particles
  particleCount={200}
  particleColors="#ffffff,#ff0000,#00ff00"
  moveParticlesOnHover="1"
  speed={0.1}
  disableRotation="0"
/>
```

## Color Configuration

Provide multiple colors as comma-separated hex values:
```
#ffffff,#ff0000,#00ff00,#0000ff
```

Each particle will randomly receive one of these colors.

## Styling Approach

**Component Props** - All properties configured through props for maximum control. Boolean values use string '0'/'1' pattern.

## Technical Notes

- Uses OGL library for optimized WebGL rendering
- Window-level mouse events for Webflow compatibility
- Mouse enter/leave tracking for performance optimization
- ResizeObserver for responsive canvas sizing
- Vertex and fragment shaders for particle rendering
- Animation loop with requestAnimationFrame
- Proper cleanup of WebGL context and event listeners
- SSR disabled (requires WebGL/canvas browser APIs)
- Boolean props parsed from strings ('0' = false, '1' = true)
- Color array parsed from comma-separated string
