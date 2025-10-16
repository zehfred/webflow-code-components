import React from 'react';
import { declareComponent } from '@webflow/react';
import { props } from '@webflow/data-types';
import FAQ from './FAQ';
import './FAQ.css';

/**
 * ═══════════════════════════════════════════════════════════════
 * 🎯 HOW TO USE THE FAQ COMPONENT WITH WEBFLOW
 * ═══════════════════════════════════════════════════════════════
 *
 * STEP-BY-STEP SETUP:
 * ───────────────────────────────────────────────────────────────
 *
 * 1. CREATE YOUR COLLECTION
 *    - Create a new Collection in your Webflow CMS
 *    - Add a "Question" text field
 *    - Add an "Answer" text field (use long text/rich text)
 *
 * 2. ADD THE FAQ COMPONENT
 *    - Drag the FAQ component onto your canvas
 *    - The component will appear with a purple placeholder
 *
 * 3. ADD A COLLECTION LIST
 *    - Inside the "FAQ Items" slot, add a Collection List
 *    - Connect it to your FAQ Collection
 *
 * 4. ADD QUESTION & ANSWER ELEMENTS
 *    - Inside the Collection List item:
 *      a. Add a heading or text element for the question
 *         - Select it and go to the Custom Attributes panel
 *         - Add attribute: data-faq-question
 *         - Bind it to the "Question" field
 *
 *      b. Add another element for the answer
 *         - Select it and go to the Custom Attributes panel
 *         - Add attribute: data-faq-answer
 *         - Bind it to the "Answer" field
 *
 * 5. CUSTOMIZE (OPTIONAL)
 *    - Adjust animation speed, colors, and icon position
 *    - Choose between single or multiple open items
 *
 * 6. PUBLISH & ENJOY! 🎉
 *
 * ═══════════════════════════════════════════════════════════════
 * EXAMPLE DATA ATTRIBUTE SETUP:
 * ═══════════════════════════════════════════════════════════════
 *
 * Your Collection List item should look like:
 *
 * <div class="collection-item">
 *   <h3 data-faq-question>What is your return policy?</h3>
 *   <p data-faq-answer>We offer 30-day returns...</p>
 * </div>
 *
 * The component will automatically:
 * - Find all elements with data-faq-question and data-faq-answer
 * - Create an accessible accordion
 * - Handle open/close animations
 * - Support keyboard navigation
 *
 * ═══════════════════════════════════════════════════════════════
 * ACCESSIBILITY FEATURES:
 * ═══════════════════════════════════════════════════════════════
 *
 * ✓ Full keyboard navigation (Space/Enter to toggle)
 * ✓ ARIA labels and roles
 * ✓ Screen reader support
 * ✓ Focus indicators
 * ✓ Respects prefers-reduced-motion
 *
 * ═══════════════════════════════════════════════════════════════
 * ADVANCED: CUSTOMIZE WITH CSS VARIABLES
 * ═══════════════════════════════════════════════════════════════
 *
 * For advanced customization beyond Webflow's component settings,
 * you can override CSS variables. Add this to Webflow:
 *
 * Project Settings → Custom Code → Inside <head> tag
 *
 * <style>
 * code-island {
 *   --faq-toggle-border-color: #000;
 *   --faq-toggle-hover-color: #f0f0f0;
 *   --faq-item-gap: 8px;
 *   --faq-question-color: #1a1a1a;
 *   --faq-question-font-size: 18px;
 *   --faq-question-font-family: 'Inter', sans-serif;
 *   --faq-question-padding: 20px;
 *   --faq-answer-color: #666;
 *   --faq-answer-font-size: 16px;
 *   --faq-answer-font-family: 'Inter', sans-serif;
 *   --faq-answer-padding: 0 20px 20px 20px;
 *   --faq-border-radius: 8px;
 * }
 * </style>
 *
 * Available CSS Variables:
 * ───────────────────────
 * --faq-toggle-border-color      Border color of accordion toggles
 * --faq-toggle-hover-color       Background color on toggle hover
 * --faq-item-gap                 Spacing between FAQ items
 * --faq-question-color           Question text color
 * --faq-question-font-size       Question font size
 * --faq-question-font-family     Question font family
 * --faq-question-padding         Question padding
 * --faq-answer-color             Answer text color
 * --faq-answer-font-size         Answer font size
 * --faq-answer-font-family       Answer font family
 * --faq-answer-padding           Answer padding
 * --faq-border-radius            Border radius of items
 *
 * ═══════════════════════════════════════════════════════════════
 */

interface FAQWebflowProps {
  /** Slot for Collection List with FAQ items */
  children?: any;
  /** Accordion type: single or multiple items open */
  type?: 'single' | 'multiple';
  /** Which item is open by default (0 = none, 1 = first, 2 = second, etc.) */
  defaultOpenIndex?: number;
  /** Position of the expand/collapse icon */
  iconPosition?: 'left' | 'right';
  /** Animation speed in seconds */
  animationDuration?: number;
  /** Border color of accordion items */
  borderColor?: string;
  /** Background color of accordion items */
  backgroundColor?: string;
  /** Background color on hover */
  hoverColor?: string;
  /** Border radius of accordion items */
  borderRadius?: string;
}

const FAQWebflow = ({
  children,
  type = 'single',
  defaultOpenIndex = 0,
  iconPosition = 'right',
  animationDuration = 0.3,
  borderColor = '#e5e5e5',
  backgroundColor = '#ffffff',
  hoverColor = '#f9f9f9',
  borderRadius = '0px'
}: FAQWebflowProps) => {
  // Parse string values from Webflow
  const parsedType = (typeof type === 'string' ? type : 'single') as 'single' | 'multiple';
  const parsedIcon = (typeof iconPosition === 'string' ? iconPosition : 'right') as 'left' | 'right';
  const parsedDuration = typeof animationDuration === 'string'
    ? parseFloat(animationDuration)
    : animationDuration;
  const parsedDefaultIndex = typeof defaultOpenIndex === 'string'
    ? parseInt(defaultOpenIndex, 10)
    : defaultOpenIndex;

  return (
    <FAQ
      type={parsedType}
      defaultOpenIndex={parsedDefaultIndex}
      iconPosition={parsedIcon}
      animationDuration={parsedDuration}
      borderColor={borderColor}
      backgroundColor={backgroundColor}
      hoverColor={hoverColor}
      borderRadius={borderRadius}
    >
      {children}
    </FAQ>
  );
};

export default declareComponent(FAQWebflow, {
  name: 'FAQ Accordion',
  description: 'An accessible accordion component for FAQs. Add a Collection List with data-faq-question and data-faq-answer attributes to automatically create an interactive FAQ section.',
  group: 'Interactive',

  props: {
    children: props.Slot({
      name: 'FAQ Items',
      tooltip: 'Add a Collection List here with items containing data-faq-question and data-faq-answer attributes. See the documentation for setup instructions.'
    }),

    type: props.Text({
      name: 'Accordion Type',
      defaultValue: 'single',
      group: 'Behavior',
      tooltip: 'single: Only one item can be open at a time. multiple: Multiple items can be open simultaneously.'
    }),

    defaultOpenIndex: props.Number({
      name: 'Default Open Item',
      defaultValue: 0,
      group: 'Behavior',
      min: 0,
      max: 100,
      decimals: 0,
      tooltip: 'Set to 0 for none open, 1 for first item, 2 for second item, etc. Only applies when type is "single".'
    }),

    iconPosition: props.Text({
      name: 'Icon Position',
      defaultValue: 'right',
      group: 'Style',
      tooltip: 'Position of the expand/collapse icon: "left" or "right"'
    }),

    animationDuration: props.Number({
      name: 'Animation Speed',
      defaultValue: 0.3,
      group: 'Animation',
      min: 0.1,
      max: 2,
      decimals: 1,
      tooltip: 'Duration of open/close animation in seconds (lower = faster)'
    }),

    borderColor: props.Text({
      name: 'Border Color',
      defaultValue: '#e5e5e5',
      group: 'Style',
      tooltip: 'Color of the borders around each accordion item (e.g., #e5e5e5, rgba(0,0,0,0.1))'
    }),

    backgroundColor: props.Text({
      name: 'Background Color',
      defaultValue: '#ffffff',
      group: 'Style',
      tooltip: 'Background color of accordion items (e.g., #ffffff, transparent)'
    }),

    hoverColor: props.Text({
      name: 'Hover Background Color',
      defaultValue: '#f9f9f9',
      group: 'Style',
      tooltip: 'Background color when hovering over an accordion item'
    }),

    borderRadius: props.Text({
      name: 'Border Radius',
      defaultValue: '0px',
      group: 'Style',
      tooltip: 'Border radius of accordion items (e.g., 0px, 8px, 1rem)'
    })
  },

  options: {
    // Don't apply tag selectors to maintain full style control
    applyTagSelectors: false,
    // SSR disabled - component requires browser APIs (DOM access)
    ssr: false
  }
});
