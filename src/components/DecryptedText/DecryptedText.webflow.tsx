import React from 'react';
import { declareComponent } from '@webflow/react';
import { props } from '@webflow/data-types';
import DecryptedText from './DecryptedText';
import './DecryptedText.css';

/**
 * ═══════════════════════════════════════════════════════════════
 * 🔐 DECRYPTED TEXT COMPONENT
 * ═══════════════════════════════════════════════════════════════
 *
 * An animated text component that creates a "decryption" effect where
 * text scrambles and gradually reveals itself. Perfect for:
 * - Hero headings with dramatic reveals
 * - Section titles that animate into view
 * - Interactive hover effects
 * - Cyberpunk or tech-themed designs
 *
 * ═══════════════════════════════════════════════════════════════
 * ANIMATION TRIGGERS:
 * ═══════════════════════════════════════════════════════════════
 *
 * • Hover: Text scrambles when user hovers over it
 * • View: Text animates once when scrolled into view
 * • Both: Combines hover and view triggers
 *
 * ═══════════════════════════════════════════════════════════════
 * REVEAL MODES:
 * ═══════════════════════════════════════════════════════════════
 *
 * Sequential OFF (default):
 * - All characters scramble randomly for N iterations
 * - Text fully reveals at the end
 * - Creates a chaotic "matrix" effect
 *
 * Sequential ON:
 * - Characters reveal one at a time in order
 * - Controlled by "Reveal Direction" setting
 * - Creates a smooth typing/decryption effect
 *
 * ═══════════════════════════════════════════════════════════════
 * STYLING:
 * ═══════════════════════════════════════════════════════════════
 *
 * Control appearance with CSS variables (set in Webflow Variables):
 *
 * --decrypted-text-color: Color of revealed characters
 * --decrypted-text-font-weight: Font weight of revealed text
 * --encrypted-text-color: Color of scrambled characters
 * --encrypted-text-font-weight: Font weight of scrambled text
 *
 * Advanced: Use the class name props to apply custom styles
 * to different character states.
 *
 * ═══════════════════════════════════════════════════════════════
 * SEO & ACCESSIBILITY:
 * ═══════════════════════════════════════════════════════════════
 *
 * ✓ SEO-friendly: Real text renders on server
 * ✓ Screen reader support: Hidden text for assistive technology
 * ✓ Progressive enhancement: Works without JavaScript
 * ✓ No content shift: Animation is visual only
 *
 * ═══════════════════════════════════════════════════════════════
 */

interface DecryptedTextWebflowProps {
  /** The text content to animate */
  text?: string;
  /** Animation speed in milliseconds (lower = faster) */
  speed?: number;
  /** Number of scramble iterations before revealing (sequential mode disabled) */
  maxIterations?: number;
  /** Reveal characters one at a time instead of all at once */
  sequential?: boolean;
  /** Direction for sequential reveal */
  revealDirection?: 'start' | 'end' | 'center';
  /** Only use characters from original text for scrambling */
  useOriginalCharsOnly?: boolean;
  /** Custom character set for scrambling effect */
  characters?: string;
  /** When to trigger the animation */
  animateOn?: 'hover' | 'view' | 'both';
  /** CSS class for revealed characters */
  className?: string;
  /** CSS class for the wrapper element */
  parentClassName?: string;
  /** CSS class for encrypted/scrambled characters */
  encryptedClassName?: string;
}

const DecryptedTextWebflow = ({
  text = 'Hover me!',
  speed = 50,
  maxIterations = 10,
  sequential = false,
  revealDirection = 'start',
  useOriginalCharsOnly = false,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
  animateOn = 'hover',
  className = '',
  parentClassName = '',
  encryptedClassName = ''
}: DecryptedTextWebflowProps) => {
  // Parse string values from Webflow
  const parsedSpeed = typeof speed === 'string' ? parseInt(speed, 10) : speed;
  const parsedMaxIterations = typeof maxIterations === 'string' ? parseInt(maxIterations, 10) : maxIterations;
  const parsedSequential = typeof sequential === 'string' ? sequential === 'true' : sequential;
  const parsedUseOriginalCharsOnly = typeof useOriginalCharsOnly === 'string'
    ? useOriginalCharsOnly === 'true'
    : useOriginalCharsOnly;

  return (
    <DecryptedText
      text={text}
      speed={parsedSpeed}
      maxIterations={parsedMaxIterations}
      sequential={parsedSequential}
      revealDirection={revealDirection as 'start' | 'end' | 'center'}
      useOriginalCharsOnly={parsedUseOriginalCharsOnly}
      characters={characters}
      animateOn={animateOn as 'hover' | 'view' | 'both'}
      className={className}
      parentClassName={parentClassName}
      encryptedClassName={encryptedClassName}
    />
  );
};

export default declareComponent(DecryptedTextWebflow, {
  name: 'Decrypted Text',
  description: 'Animated text with a scrambling "decryption" effect. Text can be triggered on hover or when scrolled into view, with options for character-by-character reveals.',
  group: 'Interactive',

  props: {
    // CONTENT GROUP
    text: props.TextNode({
      name: 'Text',
      defaultValue: 'Hover me!',
      group: 'Content',
      tooltip: 'The text content that will be animated with the decryption effect'
    }),

    // BEHAVIOR GROUP
    animateOn: props.Variant({
      name: 'Animation Trigger',
      options: ['hover', 'view', 'both'],
      defaultValue: 'hover',
      group: 'Behavior',
      tooltip: 'When to trigger the animation: hover (on mouse over), view (when scrolled into view), or both'
    }),

    speed: props.Number({
      name: 'Speed',
      defaultValue: 50,
      group: 'Behavior',
      min: 10,
      max: 500,
      decimals: 0,
      tooltip: 'Animation speed in milliseconds. Lower values = faster animation (10-500ms recommended)'
    }),

    sequential: props.Boolean({
      name: 'Sequential Reveal',
      defaultValue: false,
      group: 'Behavior',
      tooltip: 'When enabled, characters reveal one at a time. When disabled, all characters scramble and reveal together.'
    }),

    revealDirection: props.Variant({
      name: 'Reveal Direction',
      options: ['start', 'end', 'center'],
      defaultValue: 'start',
      group: 'Behavior',
      tooltip: 'Direction for sequential character reveal. Only applies when Sequential Reveal is enabled. Start: left to right, End: right to left, Center: from middle outward'
    }),

    maxIterations: props.Number({
      name: 'Max Iterations',
      defaultValue: 10,
      group: 'Behavior',
      min: 1,
      max: 50,
      decimals: 0,
      tooltip: 'Number of scramble cycles before revealing text. Only applies when Sequential Reveal is disabled (1-50 recommended)'
    }),

    // ADVANCED GROUP
    useOriginalCharsOnly: props.Boolean({
      name: 'Use Original Characters',
      defaultValue: false,
      group: 'Advanced',
      tooltip: 'When enabled, only shuffles the characters from the original text. When disabled, uses random characters from the character set.'
    }),

    characters: props.Text({
      name: 'Character Set',
      defaultValue: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
      group: 'Advanced',
      tooltip: 'Custom character set for scrambling effect. Only used when "Use Original Characters" is disabled.'
    }),

    // STYLING GROUP
    className: props.Text({
      name: 'Revealed Class',
      defaultValue: '',
      group: 'Styling',
      tooltip: 'CSS class applied to revealed characters. Use for custom styling.'
    }),

    parentClassName: props.Text({
      name: 'Wrapper Class',
      defaultValue: '',
      group: 'Styling',
      tooltip: 'CSS class applied to the wrapper element. Use for custom styling.'
    }),

    encryptedClassName: props.Text({
      name: 'Encrypted Class',
      defaultValue: '',
      group: 'Styling',
      tooltip: 'CSS class applied to scrambled/encrypted characters. Use for custom styling.'
    })
  },

  options: {
    // Don't apply tag selectors to maintain full style control
    applyTagSelectors: false,
    // SSR enabled - component is SEO-friendly and supports server rendering
    // Text content renders on server, animations enhance on client
    ssr: true
  }
});
