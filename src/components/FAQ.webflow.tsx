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
 * CUSTOMIZE WITH CSS VARIABLES (Webflow Variables Tool)
 * ═══════════════════════════════════════════════════════════════
 *
 * The FAQ component uses CSS Variables for all styling. Set them in Webflow:
 *
 * 1. Open your Webflow Project Settings
 * 2. Go to Variables (in the left menu)
 * 3. Create new variables with these names:
 *
 * --faq-toggle-border-color      (e.g., #000000)
 * --faq-toggle-hover-color       (e.g., #f0f0f0)
 * --faq-item-gap                 (e.g., 8px)
 * --faq-question-color           (e.g., #1a1a1a)
 * --faq-question-font-size       (e.g., 18px)
 * --faq-question-font-family     (e.g., 'Inter', sans-serif)
 * --faq-question-padding         (e.g., 20px)
 * --faq-answer-color             (e.g., #666666)
 * --faq-answer-font-size         (e.g., 16px)
 * --faq-answer-font-family       (e.g., 'Inter', sans-serif)
 * --faq-answer-padding           (e.g., 0 20px 20px 20px)
 * --faq-border-radius            (e.g., 8px)
 *
 * The component will automatically inherit these values from Webflow's
 * CSS variables, which are set in the :root scope and inherited by
 * the Shadow DOM component.
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
}

const FAQWebflow = ({
  children,
  type = 'single',
  defaultOpenIndex = 0,
  iconPosition = 'right',
  animationDuration = 0.3
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
    })
  },

  options: {
    // Don't apply tag selectors to maintain full style control
    applyTagSelectors: false,
    // SSR disabled - component requires browser APIs (DOM access)
    ssr: false
  }
});
