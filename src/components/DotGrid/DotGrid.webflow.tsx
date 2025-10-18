import DotGrid from './DotGrid';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

export default declareComponent(DotGrid, {
  name: 'Dot Grid Background',
  description: 'An interactive dot grid with mouse tracking and physics-based animations',
  group: 'Interactive',
  props: {
    // Appearance Group
    dotSize: props.Number({
      name: 'Dot Size',
      defaultValue: 10,
      min: 1,
      max: 50,
      group: 'Appearance',
      tooltip: 'Size of each dot in pixels',
    }),
    gap: props.Number({
      name: 'Gap',
      defaultValue: 15,
      min: 1,
      max: 100,
      group: 'Appearance',
      tooltip: 'Spacing between dots',
    }),
    color1: props.Text({
      name: 'Color 1',
      defaultValue: '#5227FF',
      group: 'Appearance',
      tooltip: 'Primary dot color (e.g., #5227FF or var(--dot-color-1))',
    }),
    color2: props.Text({
      name: 'Color 2',
      defaultValue: '#5227FF',
      group: 'Appearance',
      tooltip: 'Second dot color (e.g., #5227FF or var(--dot-color-2))',
    }),
    color3: props.Text({
      name: 'Color 3',
      defaultValue: '#5227FF',
      group: 'Appearance',
      tooltip: 'Third dot color (e.g., #5227FF or var(--dot-color-3))',
    }),
    color4: props.Text({
      name: 'Color 4',
      group: 'Appearance',
      tooltip: 'Fourth dot color (optional, e.g., #ff00ff or var(--dot-color-4))',
    }),
    backgroundColor: props.Text({
      name: 'Background Color',
      defaultValue: 'transparent',
      group: 'Appearance',
      tooltip: 'Container background color (e.g., #000000 or var(--bg-color))',
    }),
    blur: props.Boolean({
      name: 'Blur Effect',
      defaultValue: false,
      group: 'Appearance',
      tooltip: 'Apply subtle blur effect to dots',
    }),

    // Behavior Group
    returnDuration: props.Number({
      name: 'Return Duration',
      defaultValue: 1.5,
      min: 0.1,
      max: 5,
      group: 'Behavior',
      tooltip: 'Time in seconds for dots to return to original position',
    }),
    resistance: props.Number({
      name: 'Resistance',
      defaultValue: 750,
      min: 100,
      max: 2000,
      group: 'Behavior',
      tooltip: 'Physics resistance applied to dot movement (higher = more resistance)',
    }),
    maxSpeed: props.Number({
      name: 'Max Speed',
      defaultValue: 5000,
      min: 100,
      max: 10000,
      group: 'Behavior',
      tooltip: 'Maximum velocity for dot displacement',
    }),

    // Interaction Group
    proximity: props.Number({
      name: 'Proximity',
      defaultValue: 120,
      min: 0,
      max: 500,
      group: 'Interaction',
      tooltip: 'Distance at which dots respond to mouse movement',
    }),
    speedTrigger: props.Number({
      name: 'Speed Trigger',
      defaultValue: 100,
      min: 0,
      max: 1000,
      group: 'Interaction',
      tooltip: 'Minimum mouse speed to trigger dot displacement',
    }),
    shockRadius: props.Number({
      name: 'Shock Radius',
      defaultValue: 250,
      min: 0,
      max: 1000,
      group: 'Interaction',
      tooltip: 'Radius of shockwave effect on click',
    }),
    shockStrength: props.Number({
      name: 'Shock Strength',
      defaultValue: 5,
      min: 0,
      max: 20,
      group: 'Interaction',
      tooltip: 'Intensity of shockwave displacement on click',
    }),
  },
  options: {
    applyTagSelectors: false,
    // SSR disabled - component requires browser APIs (canvas, Path2D, window)
    ssr: false,
  },
});

