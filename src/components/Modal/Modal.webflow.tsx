import * as React from 'react';
import { declareComponent, props } from '@webflow/react';
import Modal from './Modal';
import './Modal.css';

export default declareComponent({
  name: 'Modal',
  description: 'A dialog overlay that displays content requiring attention or additional information. Opens via data-modal-trigger attributes on any element.',
  ssr: true,
  props: {
    // Core Settings
    modalId: props.ID({
      name: 'Modal ID',
      group: 'Settings',
      tooltip: 'Unique identifier. Triggers with data-modal-trigger="this-id" will open this modal',
    }),
    content: props.Slot({
      name: 'Modal Content',
      group: 'Content',
      tooltip: 'Add any content - headings, text, forms, images, etc.',
    }),

    // Designer Settings
    previewMode: props.Boolean({
      name: 'Preview Mode',
      group: 'Designer',
      defaultValue: true,
      tooltip: 'Show modal in Designer for editing. Disable to see page underneath. Does not affect published site.',
    }),

    // Layout
    placement: props.Variant({
      name: 'Placement',
      group: 'Layout',
      options: [
        { value: 'auto', label: 'Auto' },
        { value: 'top', label: 'Top' },
        { value: 'bottom', label: 'Bottom' },
        { value: 'center', label: 'Center' },
        { value: 'top-center', label: 'Top Center' },
        { value: 'bottom-center', label: 'Bottom Center' },
      ],
      defaultValue: 'auto',
      tooltip: 'Modal position. "Auto" = center on desktop, bottom on mobile',
    }),
    scrollBehavior: props.Variant({
      name: 'Scroll Behavior',
      group: 'Layout',
      options: [
        { value: 'inside', label: 'Inside' },
        { value: 'outside', label: 'Outside' },
      ],
      defaultValue: 'inside',
      tooltip: 'Inside = content scrolls within modal | Outside = entire modal scrolls',
    }),
    maxWidth: props.Text({
      name: 'Max Width',
      group: 'Layout',
      defaultValue: '',
      tooltip: 'Custom max-width (e.g., "600px", "80vw"). Leave empty for default size.',
    }),
    maxHeight: props.Text({
      name: 'Max Height',
      group: 'Layout',
      defaultValue: '',
      tooltip: 'Custom max-height (e.g., "90vh", "800px"). Leave empty for auto height.',
    }),

    // Style
    backdrop: props.Variant({
      name: 'Backdrop',
      group: 'Style',
      options: [
        { value: 'opaque', label: 'Opaque' },
        { value: 'blur', label: 'Blur' },
        { value: 'transparent', label: 'Transparent' },
      ],
      defaultValue: 'opaque',
      tooltip: 'Overlay style behind modal',
    }),
    backdropColor: props.Color({
      name: 'Backdrop Color',
      group: 'Style',
      defaultValue: 'rgba(0, 0, 0, 0.5)',
      tooltip: 'Background color of the overlay behind modal',
    }),
    borderRadius: props.Text({
      name: 'Border Radius',
      group: 'Style',
      defaultValue: '12px',
      tooltip: 'CSS border-radius value (e.g., "8px", "1rem", "0")',
    }),
    shadow: props.Text({
      name: 'Shadow',
      group: 'Style',
      defaultValue: '0 10px 40px rgba(0, 0, 0, 0.1)',
      tooltip: 'CSS box-shadow value (e.g., "0 4px 6px rgba(0,0,0,0.1)")',
    }),
    padding: props.Text({
      name: 'Padding',
      group: 'Style',
      defaultValue: '24px',
      tooltip: 'CSS padding value (e.g., "20px", "1.5rem", "16px 24px")',
    }),

    // Close Button
    showCloseButton: props.Boolean({
      name: 'Show Close Button',
      group: 'Close Button',
      defaultValue: true,
      tooltip: 'Display built-in X close button',
    }),
    closeButtonColor: props.Color({
      name: 'Close Button Color',
      group: 'Close Button',
      defaultValue: '#000000',
      tooltip: 'Color of the X close icon',
    }),
    closeButtonPosition: props.Variant({
      name: 'Close Button Position',
      group: 'Close Button',
      options: [
        { value: 'top-right', label: 'Top Right' },
        { value: 'top-left', label: 'Top Left' },
        { value: 'inside-right', label: 'Inside Right' },
        { value: 'inside-left', label: 'Inside Left' },
      ],
      defaultValue: 'top-right',
      tooltip: 'Position of close button. "Inside" places it within the modal padding',
    }),

    // Behavior
    closeOnBackdropClick: props.Boolean({
      name: 'Close on Backdrop Click',
      group: 'Behavior',
      defaultValue: true,
      tooltip: 'Allow closing modal by clicking outside of it',
    }),
    closeOnEscape: props.Boolean({
      name: 'Close on Escape',
      group: 'Behavior',
      defaultValue: true,
      tooltip: 'Allow closing modal with ESC key',
    }),
    blockPageScroll: props.Boolean({
      name: 'Block Page Scroll',
      group: 'Behavior',
      defaultValue: true,
      tooltip: 'Prevent scrolling page content behind modal when open',
    }),
    updateUrlHash: props.Boolean({
      name: 'Update URL Hash',
      group: 'Behavior',
      defaultValue: true,
      tooltip: 'Add #modal-id to URL when opened. Enables deep linking and browser back button to close',
    }),

    // Animation
    animationStyle: props.Variant({
      name: 'Animation',
      group: 'Animation',
      options: [
        { value: 'fade', label: 'Fade' },
        { value: 'fade-scale', label: 'Fade Scale' },
        { value: 'slide-up', label: 'Slide Up' },
        { value: 'slide-down', label: 'Slide Down' },
        { value: 'none', label: 'None' },
      ],
      defaultValue: 'fade-scale',
      tooltip: 'Entrance/exit animation style',
    }),
    animationDuration: props.Number({
      name: 'Animation Duration',
      group: 'Animation',
      defaultValue: 300,
      min: 0,
      max: 2000,
      tooltip: 'Animation duration in milliseconds',
    }),

    // Advanced
    zIndex: props.Number({
      name: 'Z-Index',
      group: 'Advanced',
      defaultValue: 9999,
      min: 1,
      tooltip: 'Stacking order (higher = on top)',
    }),
  },
  component: ({ props: componentProps }) => {
    // Parse props (some may come as strings from Webflow)
    const parsedProps = {
      id: componentProps.modalId || 'modal',
      children: componentProps.content,
      previewMode: componentProps.previewMode ?? true,
      placement: componentProps.placement || 'auto',
      scrollBehavior: componentProps.scrollBehavior || 'inside',
      maxWidth: componentProps.maxWidth || '',
      maxHeight: componentProps.maxHeight || '',
      backdrop: componentProps.backdrop || 'opaque',
      backdropColor: componentProps.backdropColor || 'rgba(0, 0, 0, 0.5)',
      borderRadius: componentProps.borderRadius || '12px',
      shadow: componentProps.shadow || '0 10px 40px rgba(0, 0, 0, 0.1)',
      padding: componentProps.padding || '24px',
      showCloseButton: componentProps.showCloseButton ?? true,
      closeButtonColor: componentProps.closeButtonColor || '#000000',
      closeButtonPosition: componentProps.closeButtonPosition || 'top-right',
      closeOnBackdropClick: componentProps.closeOnBackdropClick ?? true,
      closeOnEscape: componentProps.closeOnEscape ?? true,
      blockPageScroll: componentProps.blockPageScroll ?? true,
      updateUrlHash: componentProps.updateUrlHash ?? true,
      animationStyle: componentProps.animationStyle || 'fade-scale',
      animationDuration:
        typeof componentProps.animationDuration === 'number'
          ? componentProps.animationDuration
          : 300,
      zIndex:
        typeof componentProps.zIndex === 'number'
          ? componentProps.zIndex
          : 9999,
    };

    return <Modal {...parsedProps} />;
  },
});
