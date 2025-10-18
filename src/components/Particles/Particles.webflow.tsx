import Particles from './Particles';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

export default declareComponent(Particles, {
  name: 'Particles Background',
  description: 'A WebGL particle system with customizable colors and animations',
  group: 'Interactive',
  props: {
    // Particles Group
    particleCount: props.Number({
      name: 'Particle Count',
      defaultValue: 200,
      min: 10,
      max: 1000,
      group: 'Particles',
      tooltip: 'Number of particles to render',
    }),
    particleSpread: props.Number({
      name: 'Particle Spread',
      defaultValue: 10,
      min: 1,
      max: 50,
      group: 'Particles',
      tooltip: 'How far particles spread from center',
    }),
    speed: props.Number({
      name: 'Speed',
      defaultValue: 0.1,
      min: 0,
      max: 2,
      group: 'Particles',
      tooltip: 'Animation speed multiplier',
    }),

    // Colors Group
    color1: props.Text({
      name: 'Color 1',
      defaultValue: '#ffffff',
      group: 'Colors',
      tooltip: 'Primary particle color (e.g., #ffffff or var(--particle-color-1))',
    }),
    color2: props.Text({
      name: 'Color 2',
      defaultValue: '#ffffff',
      group: 'Colors',
      tooltip: 'Second particle color (e.g., #ffffff or var(--particle-color-2))',
    }),
    color3: props.Text({
      name: 'Color 3',
      defaultValue: '#ffffff',
      group: 'Colors',
      tooltip: 'Third particle color (e.g., #ffffff or var(--particle-color-3))',
    }),
    color4: props.Text({
      name: 'Color 4',
      group: 'Colors',
      tooltip: 'Fourth particle color (optional, e.g., #ff00ff or var(--particle-color-4))',
    }),
    backgroundColor: props.Text({
      name: 'Background Color',
      defaultValue: 'transparent',
      group: 'Colors',
      tooltip: 'Container background color (e.g., #000000 or var(--bg-color))',
    }),
    alphaParticles: props.Boolean({
      name: 'Alpha Particles',
      defaultValue: false,
      group: 'Colors',
      tooltip: 'Enable transparency/fade effect on particles',
    }),

    // Appearance Group
    particleBaseSize: props.Number({
      name: 'Base Size',
      defaultValue: 100,
      min: 10,
      max: 300,
      group: 'Appearance',
      tooltip: 'Base size of particles',
    }),
    sizeRandomness: props.Number({
      name: 'Size Randomness',
      defaultValue: 1,
      min: 0,
      max: 3,
      group: 'Appearance',
      tooltip: 'Variation in particle sizes (0 = uniform)',
    }),
    cameraDistance: props.Number({
      name: 'Camera Distance',
      defaultValue: 20,
      min: 5,
      max: 50,
      group: 'Appearance',
      tooltip: 'Distance of camera from particles',
    }),

    // Interaction Group
    moveParticlesOnHover: props.Boolean({
      name: 'Move On Hover',
      defaultValue: false,
      group: 'Interaction',
      tooltip: 'Enable mouse interaction with particles',
    }),
    particleHoverFactor: props.Number({
      name: 'Hover Factor',
      defaultValue: 1,
      min: 0,
      max: 5,
      group: 'Interaction',
      tooltip: 'Intensity of mouse interaction effect',
    }),
    disableRotation: props.Boolean({
      name: 'Disable Rotation',
      defaultValue: false,
      group: 'Interaction',
      tooltip: 'Disable automatic particle rotation',
    }),
  },
  options: {
    applyTagSelectors: false,
    // SSR disabled - component requires browser APIs (WebGL, canvas, window)
    ssr: false,
  },
});
