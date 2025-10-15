import Particles from './Particles';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

export default declareComponent(Particles, {
  name: 'Particles',
  description: 'A WebGL particle system with customizable colors and animations',
  group: 'Interactive',
  props: {
    particleCount: props.Number({
      name: 'Particle Count',
      defaultValue: 200,
      min: 10,
      max: 1000,
    }),
    particleSpread: props.Number({
      name: 'Particle Spread',
      defaultValue: 10,
      min: 1,
      max: 50,
    }),
    speed: props.Number({
      name: 'Speed',
      defaultValue: 0.1,
      min: 0,
      max: 2,
    }),
    particleColors: props.Text({
      name: 'Particle Colors',
      defaultValue: '#ffffff,#ffffff,#ffffff',
    }),
    moveParticlesOnHover: props.Text({
      name: 'Move On Hover',
      defaultValue: '0',
    }),
    particleHoverFactor: props.Number({
      name: 'Hover Factor',
      defaultValue: 1,
      min: 0,
      max: 5,
    }),
    alphaParticles: props.Text({
      name: 'Alpha Particles',
      defaultValue: '0',
    }),
    particleBaseSize: props.Number({
      name: 'Base Size',
      defaultValue: 100,
      min: 10,
      max: 300,
    }),
    sizeRandomness: props.Number({
      name: 'Size Randomness',
      defaultValue: 1,
      min: 0,
      max: 3,
    }),
    cameraDistance: props.Number({
      name: 'Camera Distance',
      defaultValue: 20,
      min: 5,
      max: 50,
    }),
    disableRotation: props.Text({
      name: 'Disable Rotation',
      defaultValue: '0',
    }),
  },
});

