import React from 'react';
import { declareComponent } from '@webflow/react';
import { props } from '@webflow/data-types';
import Modal from './Modal';
import './Modal.css';

/**
 * ═══════════════════════════════════════════════════════════════
 * 🎯 HOW TO USE THE MODAL COMPONENT WITH WEBFLOW
 * ═══════════════════════════════════════════════════════════════
 *
 * STEP-BY-STEP SETUP:
 * ───────────────────────────────────────────────────────────────
 *
 * 1. ADD THE MODAL COMPONENT
 *    - Drag the Modal component onto your canvas
 *    - Set a unique ID for the modal (e.g., "contact-modal")
 *    - The modal will be visible by default in the Designer
 *
 * 2. ADD CONTENT TO THE MODAL
 *    - Click inside the "Modal Content" slot
 *    - Add any Webflow elements: text, images, forms, etc.
 *    - Style these elements normally using Webflow classes
 *
 * 3. CREATE A TRIGGER ELEMENT
 *    - Add any element to your page (button, link, div, etc.)
 *    - Select it and go to the Custom Attributes panel
 *    - Add attribute: data-modal-trigger
 *    - Set value to match your modal ID (e.g., "contact-modal")
 *
 * 4. CUSTOMIZE THE MODAL APPEARANCE
 *    - Select the Modal component
 *    - Use the component settings panel to adjust:
 *      • Modal size (max width)
 *      • Colors (background, backdrop)
 *      • Spacing (padding, border radius)
 *      • Close button (color, size)
 *      • Animation speed
 *
 * 5. HIDE MODAL FOR FINAL VIEW
 *    - Toggle "Show in Designer" to OFF
 *    - This hides the modal so you can see your page normally
 *    - The modal will still work when triggered on the published site
 *
 * 6. PUBLISH & ENJOY! 🎉
 *
 * ═══════════════════════════════════════════════════════════════
 * EXAMPLE TRIGGER SETUP:
 * ═══════════════════════════════════════════════════════════════
 *
 * Add a button with this custom attribute:
 *
 * <button data-modal-trigger="contact-modal">
 *   Open Contact Form
 * </button>
 *
 * The component will automatically:
 * - Detect clicks on elements with data-modal-trigger
 * - Open the modal with matching ID
 * - Close on backdrop click, close button, or ESC key
 * - Prevent page scrolling while open
 * - Trap focus inside the modal
 *
 * ═══════════════════════════════════════════════════════════════
 * ACCESSIBILITY FEATURES:
 * ═══════════════════════════════════════════════════════════════
 *
 * ✓ Focus trap (keyboard navigation stays in modal)
 * ✓ ESC key closes modal
 * ✓ Focus returns to trigger element on close
 * ✓ ARIA labels and roles for screen readers
 * ✓ Respects prefers-reduced-motion
 * ✓ Body scroll lock when modal is open
 *
 * ═══════════════════════════════════════════════════════════════
 * STYLING OPTIONS:
 * ═══════════════════════════════════════════════════════════════
 *
 * All styling is controlled through component props in Webflow Designer.
 * Each style prop accepts either:
 * - Direct values (e.g., #FF0000, 600px, 32px, 0.5)
 * - CSS variables (e.g., var(--primary-color), var(--modal-width))
 *
 * To use Webflow Variables:
 * 1. Create variables in Project Settings → Variables
 * 2. Reference them in component props using var(--variable-name)
 * 3. Example: var(--colors-primary) or var(--spacing-lg)
 *
 * ═══════════════════════════════════════════════════════════════
 */

interface ModalWebflowProps {
  /** Unique identifier for the modal (matches data-modal-trigger value) */
  id?: string;
  /** Slot for modal content */
  children?: any;
  /** Show modal in Webflow Designer for styling */
  showInDesigner?: boolean;
  /** Animation duration in seconds */
  animationDuration?: number;
  /** Modal background color */
  backgroundColor?: string;
  /** Maximum width of the modal */
  maxWidth?: string;
  /** Maximum height of the modal */
  maxHeight?: string;
  /** Padding inside the modal */
  padding?: string;
  /** Border radius of the modal */
  borderRadius?: string;
  /** Backdrop background color (supports hex, rgb, rgba, hsl, etc.) */
  backdropColor?: string;
  /** Backdrop blur amount */
  backdropBlur?: string;
  /** Close button color */
  closeButtonColor?: string;
  /** Close button size */
  closeButtonSize?: string;
  /** Close button hover color */
  closeButtonHoverColor?: string;
  /** Close button border radius */
  closeButtonBorderRadius?: string;
  /** Close button padding */
  closeButtonPadding?: string;
  /** Close button background color */
  closeButtonBgColor?: string;
  /** Close button hover background color */
  closeButtonHoverBgColor?: string;
  /** Close button icon stroke width */
  closeButtonStrokeWidth?: string;
}

const ModalWebflow = ({
  id = 'modal',
  children,
  showInDesigner = false,
  animationDuration = 0.3,
  backgroundColor = '#ffffff',
  maxWidth = '600px',
  maxHeight = '80vh',
  padding = '32px',
  borderRadius = '8px',
  backdropColor = 'rgba(0, 0, 0, 0.5)',
  backdropBlur = '0px',
  closeButtonColor = '#666666',
  closeButtonSize = '32px',
  closeButtonHoverColor = '#000000',
  closeButtonBorderRadius = '4px',
  closeButtonPadding = '8px',
  closeButtonBgColor = 'rgba(255, 255, 255, 0.9)',
  closeButtonHoverBgColor = 'rgba(255, 255, 255, 1)',
  closeButtonStrokeWidth = '2'
}: ModalWebflowProps) => {
  // Parse string values from Webflow
  const parsedDuration = typeof animationDuration === 'string'
    ? parseFloat(animationDuration)
    : animationDuration;
  const parsedShowInDesigner = typeof showInDesigner === 'string'
    ? showInDesigner === 'true'
    : showInDesigner;

  return (
    <Modal
      id={id}
      showInDesigner={parsedShowInDesigner}
      animationDuration={parsedDuration}
      backgroundColor={backgroundColor}
      maxWidth={maxWidth}
      maxHeight={maxHeight}
      padding={padding}
      borderRadius={borderRadius}
      backdropColor={backdropColor}
      backdropBlur={backdropBlur}
      closeButtonColor={closeButtonColor}
      closeButtonSize={closeButtonSize}
      closeButtonHoverColor={closeButtonHoverColor}
      closeButtonBorderRadius={closeButtonBorderRadius}
      closeButtonPadding={closeButtonPadding}
      closeButtonBgColor={closeButtonBgColor}
      closeButtonHoverBgColor={closeButtonHoverBgColor}
      closeButtonStrokeWidth={closeButtonStrokeWidth}
    >
      {children}
    </Modal>
  );
};

export default declareComponent(ModalWebflow, {
  name: 'Modal',
  description: 'A centered modal dialog that opens when clicking elements with data-modal-trigger attribute. Includes backdrop, close button, ESC key support, and focus trapping.',
  group: 'Interactive',

  props: {
    children: props.Slot({
      name: 'Modal Content',
      tooltip: 'Add any Webflow elements here - text, images, forms, etc. This content will appear inside the modal.'
    }),

    // BEHAVIOR GROUP
    id: props.Text({
      name: 'Modal ID',
      defaultValue: 'modal',
      group: 'Behavior',
      tooltip: 'Unique identifier for this modal. Must match the data-modal-trigger value on your trigger element.'
    }),

    showInDesigner: props.Boolean({
      name: 'Show in Designer',
      defaultValue: false,
      group: 'Behavior',
      tooltip: 'Toggle ON to see and style the modal in Webflow Designer. Toggle OFF when done styling to hide it and view your page normally.'
    }),

    animationDuration: props.Number({
      name: 'Animation Speed',
      defaultValue: 0.3,
      group: 'Behavior',
      min: 0.1,
      max: 2,
      decimals: 1,
      tooltip: 'Duration of fade in/out animation in seconds (lower = faster)'
    }),

    // MODAL STYLING GROUP
    backgroundColor: props.Text({
      name: 'Background Color',
      defaultValue: '#ffffff',
      group: 'Modal',
      tooltip: 'Modal background color (e.g., #ffffff or var(--modal-bg))'
    }),

    maxWidth: props.Text({
      name: 'Max Width',
      defaultValue: '600px',
      group: 'Modal',
      tooltip: 'Maximum width of the modal (e.g., 600px, 90vw, or var(--modal-width))'
    }),

    maxHeight: props.Text({
      name: 'Max Height',
      defaultValue: '80vh',
      group: 'Modal',
      tooltip: 'Maximum height of the modal (e.g., 80vh, 600px, or var(--modal-height))'
    }),

    padding: props.Text({
      name: 'Padding',
      defaultValue: '32px',
      group: 'Modal',
      tooltip: 'Padding inside the modal (e.g., 32px, 2rem, or var(--space-lg))'
    }),

    borderRadius: props.Text({
      name: 'Border Radius',
      defaultValue: '8px',
      group: 'Modal',
      tooltip: 'Border radius of the modal (e.g., 8px, 1rem, or var(--radius-md))'
    }),

    // BACKDROP GROUP
    backdropColor: props.Text({
      name: 'Backdrop Color',
      defaultValue: 'rgba(0, 0, 0, 0.5)',
      group: 'Backdrop',
      tooltip: 'Backdrop color - supports any CSS color format: hex (#000000), rgb (rgb(0,0,0)), rgba (rgba(0,0,0,0.5)), hsl, etc. Use rgba for transparency.'
    }),

    backdropBlur: props.Text({
      name: 'Backdrop Blur',
      defaultValue: '0px',
      group: 'Backdrop',
      tooltip: 'Backdrop blur amount (e.g., 0px for no blur, 8px for medium blur, 16px for heavy blur)'
    }),

    // CLOSE BUTTON GROUP
    closeButtonColor: props.Text({
      name: 'Close Button Color',
      defaultValue: '#666666',
      group: 'Close Button',
      tooltip: 'Close button color (e.g., #666666 or var(--text-secondary))'
    }),

    closeButtonSize: props.Text({
      name: 'Close Button Size',
      defaultValue: '32px',
      group: 'Close Button',
      tooltip: 'Close button size (e.g., 32px or var(--icon-lg))'
    }),

    closeButtonHoverColor: props.Text({
      name: 'Close Hover Color',
      defaultValue: '#000000',
      group: 'Close Button',
      tooltip: 'Close button color on hover (e.g., #000000 or var(--text-primary))'
    }),

    closeButtonBorderRadius: props.Text({
      name: 'Border Radius',
      defaultValue: '4px',
      group: 'Close Button',
      tooltip: 'Close button border radius (e.g., 4px, 50% for circle, or var(--radius-sm))'
    }),

    closeButtonPadding: props.Text({
      name: 'Padding',
      defaultValue: '8px',
      group: 'Close Button',
      tooltip: 'Close button padding (e.g., 8px, 0.5rem, or var(--space-sm))'
    }),

    closeButtonBgColor: props.Text({
      name: 'Background Color',
      defaultValue: 'rgba(255, 255, 255, 0.9)',
      group: 'Close Button',
      tooltip: 'Close button background color (e.g., rgba(255, 255, 255, 0.9) or var(--bg-secondary))'
    }),

    closeButtonHoverBgColor: props.Text({
      name: 'Hover Background',
      defaultValue: 'rgba(255, 255, 255, 1)',
      group: 'Close Button',
      tooltip: 'Close button background color on hover (e.g., rgba(255, 255, 255, 1) or var(--bg-primary))'
    }),

    closeButtonStrokeWidth: props.Text({
      name: 'Icon Stroke Width',
      defaultValue: '2',
      group: 'Close Button',
      tooltip: 'Close button icon line thickness (e.g., 1 for thin, 2 for normal, 3 for bold)'
    })
  },

  options: {
    // Don't apply tag selectors to maintain full style control
    applyTagSelectors: false,
    // SSR disabled - component requires browser APIs
    ssr: false
  }
});
