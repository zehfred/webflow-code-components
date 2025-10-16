import MagnetLines from './MagnetLines';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

export default declareComponent(MagnetLines, {
  name: 'Magnet Lines Background',
  description: 'Lines that rotate to point at your cursor like magnetic needles',
  group: 'Interactive',
  props: {
    rows: props.Number({
      name: 'Rows',
      defaultValue: 9,
      min: 3,
      max: 20,
    }),
    columns: props.Number({
      name: 'Columns',
      defaultValue: 9,
      min: 3,
      max: 20,
    }),
    containerSize: props.Text({
      name: 'Container Size',
      defaultValue: '60vmin',
    }),
    lineHeight: props.Text({
      name: 'Line Height',
      defaultValue: '4vmin',
    }),
    lineWidth: props.Text({
      name: 'Line Width',
      defaultValue: '4vmin',
    }),
    borderRadius: props.Text({
      name: 'Border Radius',
      defaultValue: '2px',
    }),
    gap: props.Text({
      name: 'Gap',
      defaultValue: '0px',
    }),
    backgroundColor: props.Text({
      name: 'Background Color',
      defaultValue: '#000000',
    }),
    baseAngle: props.Number({
      name: 'Base Angle',
      defaultValue: 0,
      min: -90,
      max: 90,
    }),
  },
  options: {
    applyTagSelectors: false,
    // SSR disabled - component requires browser APIs (DOM manipulation, window)
    ssr: false,
  },
});
