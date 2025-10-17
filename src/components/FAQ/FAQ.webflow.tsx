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
  type?: 'Single' | 'Multiple';
  /** Which item is open by default (0 = none, 1 = first, 2 = second, etc.) */
  defaultOpenIndex?: number;
  /** Custom icon image URL */
  icon?: string;
  /** Animation speed in seconds */
  animationDuration?: number;

  // Style props
  iconWidth?: string;
  iconHeight?: string;
  borderColor?: string;
  borderWidth?: string;
  borderRadius?: string;
  hoverColor?: string;
  questionColor?: string;
  answerColor?: string;
  questionFontSize?: string;
  questionFontFamily?: string;
  questionFontWeight?: string;
  answerFontSize?: string;
  answerFontFamily?: string;
  itemGap?: string;
  questionPadding?: string;
  answerPadding?: string;
}

const FAQWebflow = ({
  children,
  type = 'Single',
  defaultOpenIndex = 0,
  icon,
  animationDuration = 0.3,
  iconWidth,
  iconHeight,
  borderColor,
  borderWidth,
  borderRadius,
  hoverColor,
  questionColor,
  answerColor,
  questionFontSize,
  questionFontFamily,
  questionFontWeight,
  answerFontSize,
  answerFontFamily,
  itemGap,
  questionPadding,
  answerPadding
}: FAQWebflowProps) => {
  // Parse string values from Webflow
  const parsedType = (typeof type === 'string' ? type.toLowerCase() : 'single') as 'single' | 'multiple';
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
      iconWidth={iconWidth}
      iconHeight={iconHeight}
      borderColor={borderColor}
      borderWidth={borderWidth}
      borderRadius={borderRadius}
      hoverColor={hoverColor}
      questionColor={questionColor}
      answerColor={answerColor}
      questionFontSize={questionFontSize}
      questionFontFamily={questionFontFamily}
      questionFontWeight={questionFontWeight}
      answerFontSize={answerFontSize}
      answerFontFamily={answerFontFamily}
      itemGap={itemGap}
      questionPadding={questionPadding}
      answerPadding={answerPadding}
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

    // BEHAVIOR GROUP
    type: props.Variant({
      name: 'Accordion Type',
      options: ['Single', 'Multiple'],
      defaultValue: 'Single',
      group: 'Behavior',
      tooltip: 'Single: Only one item can be open at a time. Multiple: Multiple items can be open simultaneously.'
    }),

    defaultOpenIndex: props.Number({
      name: 'Default Open Item',
      defaultValue: 0,
      group: 'Behavior',
      min: 0,
      max: 100,
      decimals: 0,
      tooltip: 'Set to 0 for none open, 1 for first item, 2 for second item, etc. Only applies when type is "Single".'
    }),

    animationDuration: props.Number({
      name: 'Animation Speed',
      defaultValue: 0.3,
      group: 'Behavior',
      min: 0.1,
      max: 2,
      decimals: 1,
      tooltip: 'Duration of open/close animation in seconds (lower = faster)'
    }),

    itemGap: props.Text({
      name: 'Item Gap',
      defaultValue: '0px',
      group: 'Behavior',
      tooltip: 'Gap between FAQ items (e.g., 8px or var(--space-2))'
    }),

    // ICON GROUP
    icon: props.Image({
      name: 'Icon',
      group: 'Icon',
      tooltip: 'Custom icon image for expand/collapse indicator'
    }),

    iconWidth: props.Text({
      name: 'Icon Width',
      defaultValue: '24px',
      group: 'Icon',
      tooltip: 'Width of the icon (e.g., 24px or var(--icon-size))'
    }),

    iconHeight: props.Text({
      name: 'Icon Height',
      defaultValue: '24px',
      group: 'Icon',
      tooltip: 'Height of the icon (e.g., 24px or var(--icon-size))'
    }),

    // BORDERS GROUP
    borderColor: props.Text({
      name: 'Border Color',
      defaultValue: '#e5e5e5',
      group: 'Borders',
      tooltip: 'Border color for FAQ items (e.g., #e5e5e5 or var(--border-color))'
    }),

    borderWidth: props.Text({
      name: 'Border Width',
      defaultValue: '1px',
      group: 'Borders',
      tooltip: 'Border width using CSS shorthand (e.g., 1px for all sides, 1px 2px 0 1px for top/right/bottom/left, or var(--border-width))'
    }),

    borderRadius: props.Text({
      name: 'Border Radius',
      defaultValue: '0px',
      group: 'Borders',
      tooltip: 'Border radius using CSS shorthand (e.g., 8px for all corners, 8px 0 0 8px for top-left/top-right/bottom-right/bottom-left, or var(--radius-md))'
    }),

    // QUESTION GROUP
    hoverColor: props.Text({
      name: 'Hover Background',
      defaultValue: '#f9f9f9',
      group: 'Question',
      tooltip: 'Background color on hover (e.g., #f9f9f9 or var(--hover-bg))'
    }),

    questionColor: props.Text({
      name: 'Question Color',
      defaultValue: '#000000',
      group: 'Question',
      tooltip: 'Question text color (e.g., #000000 or var(--text-primary))'
    }),

    questionFontSize: props.Text({
      name: 'Question Font Size',
      defaultValue: 'inherit',
      group: 'Question',
      tooltip: 'Question font size (e.g., 18px or var(--font-lg))'
    }),

    questionFontFamily: props.Text({
      name: 'Question Font Family',
      defaultValue: 'inherit',
      group: 'Question',
      tooltip: 'Question font family (e.g., "Inter", sans-serif or var(--font-body))'
    }),

    questionFontWeight: props.Text({
      name: 'Question Font Weight',
      defaultValue: 'inherit',
      group: 'Question',
      tooltip: 'Question font weight (e.g., 600 or var(--font-semibold))'
    }),

    questionPadding: props.Text({
      name: 'Question Padding',
      defaultValue: '16px',
      group: 'Question',
      tooltip: 'Padding for question area (e.g., 20px or var(--space-4))'
    }),

    // ANSWER GROUP
    answerColor: props.Text({
      name: 'Answer Color',
      defaultValue: '#666666',
      group: 'Answer',
      tooltip: 'Answer text color (e.g., #666666 or var(--text-secondary))'
    }),

    answerFontSize: props.Text({
      name: 'Answer Font Size',
      defaultValue: '16px',
      group: 'Answer',
      tooltip: 'Answer font size (e.g., 16px or var(--font-base))'
    }),

    answerFontFamily: props.Text({
      name: 'Answer Font Family',
      defaultValue: 'inherit',
      group: 'Answer',
      tooltip: 'Answer font family (e.g., "Inter", sans-serif or var(--font-body))'
    }),

    answerPadding: props.Text({
      name: 'Answer Padding',
      defaultValue: '0 16px 16px 16px',
      group: 'Answer',
      tooltip: 'Padding for answer area (e.g., 0 20px 20px 20px)'
    })
  },

  options: {
    // Don't apply tag selectors to maintain full style control
    applyTagSelectors: false,
    // SSR disabled - component requires browser APIs (DOM access)
    ssr: false
  }
});
