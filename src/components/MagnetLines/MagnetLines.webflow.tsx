import MagnetLines from './MagnetLines';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

export default declareComponent(MagnetLines, {
  name: 'Magnet Lines Background',
  description: 'Lines that rotate to point at your cursor like magnetic needles',
  group: 'Interactive',
  props: {
    // Grid Group
    rows: props.Number({
      name: 'Rows',
      defaultValue: 9,
      min: 3,
      max: 20,
      group: 'Grid',
    }),
    columns: props.Number({
      name: 'Columns',
      defaultValue: 9,
      min: 3,
      max: 20,
      group: 'Grid',
    }),
    gap: props.Text({
      name: 'Gap',
      defaultValue: '0px',
      group: 'Grid',
      tooltip: 'Space between lines (e.g., "0px", "2px", "0.5vmin")',
    }),

    // Style Group
    lineWidth: props.Text({
      name: 'Line Width',
      defaultValue: '4vmin',
      group: 'Style',
      tooltip: 'Width of each line (e.g., "4vmin", "20px", "2rem")',
    }),
    lineHeight: props.Text({
      name: 'Line Height',
      defaultValue: '4vmin',
      group: 'Style',
      tooltip: 'Height of each line (e.g., "4vmin", "20px", "2rem")',
    }),
    borderRadius: props.Text({
      name: 'Border Radius',
      defaultValue: '2px',
      group: 'Style',
      tooltip: 'Rounded corners for lines (e.g., "2px", "50%")',
    }),
    backgroundColor: props.Text({
      name: 'Background Color',
      defaultValue: '#000000',
      group: 'Style',
      tooltip: 'Background color (e.g., #000000 or var(--bg-color))',
    }),

    // Colors Group
    color1: props.Text({
      name: 'Color 1',
      defaultValue: '#00ff00',
      group: 'Colors',
      tooltip: 'Primary line color (e.g., #00ff00 or var(--line-color-1))',
    }),
    color2: props.Text({
      name: 'Color 2',
      group: 'Colors',
      tooltip: 'Second color for checkerboard pattern (optional, e.g., #ff0000 or var(--line-color-2))',
    }),
    color3: props.Text({
      name: 'Color 3',
      group: 'Colors',
      tooltip: 'Third color for checkerboard pattern (optional, e.g., #0000ff or var(--line-color-3))',
    }),
    color4: props.Text({
      name: 'Color 4',
      group: 'Colors',
      tooltip: 'Fourth color for checkerboard pattern (optional, e.g., #ffff00 or var(--line-color-4))',
    }),
    baseAngle: props.Number({
      name: 'Base Angle',
      defaultValue: 0,
      min: -90,
      max: 90,
      group: 'Colors',
      tooltip: 'Default rotation angle when mouse is not hovering',
    }),
  },
  options: {
    applyTagSelectors: false,
    // SSR disabled - component requires browser APIs (DOM manipulation, window)
    ssr: false,
  },
});
