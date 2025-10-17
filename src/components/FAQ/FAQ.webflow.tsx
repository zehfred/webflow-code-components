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
 * 5. CUSTOMIZE STYLING
 *    - Select the FAQ component in Webflow Designer
 *    - Use the component settings panel to adjust:
 *      • Colors (border, hover, text, icon)
 *      • Typography (font sizes, families, weights)
 *      • Spacing (gaps, padding, border radius)
 *      • Behavior (accordion type, default open item)
 *      • Animation (open/close speed)
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
 * STYLING OPTIONS:
 * ═══════════════════════════════════════════════════════════════
 *
 * All styling is controlled through component props in Webflow Designer.
 * Each style prop accepts either:
 * - Direct values (e.g., #FF0000, 16px, "Inter", sans-serif, 600)
 * - CSS variables (e.g., var(--primary-color), var(--font-lg))
 *
 * Available style groups:
 * • Colors - Border, hover background, text colors, icon color
 * • Typography - Font sizes, families, and weights
 * • Spacing - Item gaps, padding, border radius
 *
 * To use Webflow Variables:
 * 1. Create variables in Project Settings → Variables
 * 2. Reference them in component props using var(--variable-name)
 * 3. Example: var(--colors-primary) or var(--spacing-md)
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
  /** Custom icon image URL */
  icon?: string;
  /** Animation speed in seconds */
  animationDuration?: number;

  // Style props
  borderColor?: string;
  hoverColor?: string;
  questionColor?: string;
  answerColor?: string;
  chevronColor?: string;
  questionFontSize?: string;
  questionFontFamily?: string;
  questionFontWeight?: string;
  answerFontSize?: string;
  answerFontFamily?: string;
  itemGap?: string;
  questionPadding?: string;
  answerPadding?: string;
  borderRadius?: string;
}

const FAQWebflow = ({
  children,
  type = 'single',
  defaultOpenIndex = 0,
  icon,
  animationDuration = 0.3,
  borderColor,
  hoverColor,
  questionColor,
  answerColor,
  chevronColor,
  questionFontSize,
  questionFontFamily,
  questionFontWeight,
  answerFontSize,
  answerFontFamily,
  itemGap,
  questionPadding,
  answerPadding,
  borderRadius
}: FAQWebflowProps) => {
  // Parse string values from Webflow
  const parsedType = (typeof type === 'string' ? type : 'single') as 'single' | 'multiple';
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
      icon={icon}
      animationDuration={parsedDuration}
      borderColor={borderColor}
      hoverColor={hoverColor}
      questionColor={questionColor}
      answerColor={answerColor}
      chevronColor={chevronColor}
      questionFontSize={questionFontSize}
      questionFontFamily={questionFontFamily}
      questionFontWeight={questionFontWeight}
      answerFontSize={answerFontSize}
      answerFontFamily={answerFontFamily}
      itemGap={itemGap}
      questionPadding={questionPadding}
      answerPadding={answerPadding}
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

    type: props.Variant({
      name: 'Accordion Type',
      options: ['single', 'multiple'],
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

    icon: props.Image({
      name: 'Icon',
      group: 'Style',
      tooltip: 'Custom icon image for expand/collapse indicator. If not set, a default chevron icon will be used.'
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

    // Colors
    borderColor: props.Text({
      name: 'Border Color',
      defaultValue: '#e5e5e5',
      group: 'Colors',
      tooltip: 'Border color for FAQ items (e.g., #e5e5e5 or var(--border-color))'
    }),

    hoverColor: props.Text({
      name: 'Hover Background',
      defaultValue: '#f9f9f9',
      group: 'Colors',
      tooltip: 'Background color on hover (e.g., #f9f9f9 or var(--hover-bg))'
    }),

    questionColor: props.Text({
      name: 'Question Color',
      defaultValue: '#000000',
      group: 'Colors',
      tooltip: 'Question text color (e.g., #000000 or var(--text-primary))'
    }),

    answerColor: props.Text({
      name: 'Answer Color',
      defaultValue: '#666666',
      group: 'Colors',
      tooltip: 'Answer text color (e.g., #666666 or var(--text-secondary))'
    }),

    chevronColor: props.Text({
      name: 'Icon Color',
      defaultValue: '#000000',
      group: 'Colors',
      tooltip: 'Chevron icon color (e.g., #000000 or var(--icon-color))'
    }),

    // Typography
    questionFontSize: props.Text({
      name: 'Question Font Size',
      defaultValue: 'inherit',
      group: 'Typography',
      tooltip: 'Question font size (e.g., 18px or var(--font-lg))'
    }),

    questionFontFamily: props.Text({
      name: 'Question Font Family',
      defaultValue: 'inherit',
      group: 'Typography',
      tooltip: 'Question font family (e.g., "Inter", sans-serif or var(--font-body))'
    }),

    questionFontWeight: props.Text({
      name: 'Question Font Weight',
      defaultValue: 'inherit',
      group: 'Typography',
      tooltip: 'Question font weight (e.g., 600 or var(--font-semibold))'
    }),

    answerFontSize: props.Text({
      name: 'Answer Font Size',
      defaultValue: '16px',
      group: 'Typography',
      tooltip: 'Answer font size (e.g., 16px or var(--font-base))'
    }),

    answerFontFamily: props.Text({
      name: 'Answer Font Family',
      defaultValue: 'inherit',
      group: 'Typography',
      tooltip: 'Answer font family (e.g., "Inter", sans-serif or var(--font-body))'
    }),

    // Spacing
    itemGap: props.Text({
      name: 'Item Gap',
      defaultValue: '0px',
      group: 'Spacing',
      tooltip: 'Gap between FAQ items (e.g., 8px or var(--space-2))'
    }),

    questionPadding: props.Text({
      name: 'Question Padding',
      defaultValue: '16px',
      group: 'Spacing',
      tooltip: 'Padding for question area (e.g., 20px or var(--space-4))'
    }),

    answerPadding: props.Text({
      name: 'Answer Padding',
      defaultValue: '0 16px 16px 16px',
      group: 'Spacing',
      tooltip: 'Padding for answer area (e.g., 0 20px 20px 20px)'
    }),

    borderRadius: props.Text({
      name: 'Border Radius',
      defaultValue: '0px',
      group: 'Spacing',
      tooltip: 'Border radius for FAQ items (e.g., 8px or var(--radius-md))'
    })
  },

  options: {
    // Don't apply tag selectors to maintain full style control
    applyTagSelectors: false,
    // SSR disabled - component requires browser APIs (DOM access)
    ssr: false
  }
});
