import DotGrid from './DotGrid';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

export default declareComponent(DotGrid, {
  name: 'Dot Grid Background',
  description: 'An interactive dot grid with mouse tracking and physics-based animations',
  group: 'Interactive',
  props: {
    dotSize: props.Number({
      name: 'Dot Size',
      defaultValue: 10,
      min: 1,
      max: 50,
    }),
    gap: props.Number({
      name: 'Gap',
      defaultValue: 15,
      min: 1,
      max: 100,
    }),
    proximity: props.Number({
      name: 'Proximity',
      defaultValue: 120,
      min: 0,
      max: 500,
    }),
    speedTrigger: props.Number({
      name: 'Speed Trigger',
      defaultValue: 100,
      min: 0,
      max: 1000,
    }),
    shockRadius: props.Number({
      name: 'Shock Radius',
      defaultValue: 250,
      min: 0,
      max: 1000,
    }),
    shockStrength: props.Number({
      name: 'Shock Strength',
      defaultValue: 5,
      min: 0,
      max: 20,
    }),
    maxSpeed: props.Number({
      name: 'Max Speed',
      defaultValue: 5000,
      min: 100,
      max: 10000,
    }),
    resistance: props.Number({
      name: 'Resistance',
      defaultValue: 750,
      min: 100,
      max: 2000,
    }),
    returnDuration: props.Number({
      name: 'Return Duration',
      defaultValue: 1.5,
      min: 0.1,
      max: 5,
    }),
  },
  options: {
    applyTagSelectors: false,
    // SSR disabled - component requires browser APIs (canvas, Path2D, window)
    ssr: false,
  },
});

