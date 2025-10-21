import React, { useEffect, useRef, useState } from 'react';
import './FAQ.css';

export interface FAQItem {
  id: string;
  questionElement: Node;
  answerElement: Node;
}

export interface FAQProps {
  /** Type of accordion behavior */
  type?: 'single' | 'multiple';
  /** Index of item to open by default (0 = none, 1 = first, 2 = second, etc.) */
  defaultOpenIndex?: number;
  /** Animation duration in seconds */
  animationDuration?: number;
  /** Children slot for Collection List */
  children?: any;

  // Style Props - Chevron
  /** Chevron icon width (e.g., 24px or var(--icon-size)) */
  iconWidth?: string;
  /** Chevron icon height (e.g., 24px or var(--icon-size)) */
  iconHeight?: string;
  /** Chevron icon color (e.g., #000000 or var(--icon-color)) */
  chevronColor?: string;

  // Style Props - Borders
  /** Border color for FAQ items (e.g., #e5e5e5 or var(--border-color)) */
  borderColor?: string;
  /** Border width for all sides (e.g., 1px, 2px, 0) */
  borderWidth?: string;
  /** Border radius for FAQ items (e.g., 8px or var(--radius-md)) */
  borderRadius?: string;

  // Style Props - Colors
  /** Background color on hover (e.g., #f9f9f9 or var(--hover-bg)) */
  hoverColor?: string;
  /** Question text color (e.g., #000000 or var(--text-primary)) */
  questionColor?: string;
  /** Answer text color (e.g., #666666 or var(--text-secondary)) */
  answerColor?: string;

  // Style Props - Typography
  /** Question font size (e.g., 18px or var(--font-lg)) */
  questionFontSize?: string;
  /** Question font family (e.g., 'Inter', sans-serif or var(--font-body)) */
  questionFontFamily?: string;
  /** Question font weight (e.g., 600 or var(--font-semibold)) */
  questionFontWeight?: string;
  /** Answer font size (e.g., 16px or var(--font-base)) */
  answerFontSize?: string;
  /** Answer font family (e.g., 'Inter', sans-serif or var(--font-body)) */
  answerFontFamily?: string;

  // Style Props - Spacing
  /** Gap between FAQ items (e.g., 8px or var(--space-2)) */
  itemGap?: string;
  /** Padding for question area (e.g., 20px or var(--space-4)) */
  questionPadding?: string;
  /** Padding for answer area (e.g., 0 20px 20px 20px) */
  answerPadding?: string;
}

const FAQ = ({
  type = 'single',
  defaultOpenIndex = 0,
  animationDuration = 0.3,
  children,
  // Style props with defaults
  iconWidth = '24px',
  iconHeight = '24px',
  chevronColor = 'currentColor',
  borderColor = '#e5e5e5',
  borderWidth = '1px',
  borderRadius = '0px',
  hoverColor = '#f9f9f9',
  questionColor = '#000000',
  answerColor = '#666666',
  questionFontSize = 'inherit',
  questionFontFamily = 'inherit',
  questionFontWeight = 'inherit',
  answerFontSize = '16px',
  answerFontFamily = 'inherit',
  itemGap = '0px',
  questionPadding = '16px',
  answerPadding = '0 16px 16px 16px'
}: FAQProps) => {
  const [items, setItems] = useState<FAQItem[]>([]);
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const slotRef = useRef<HTMLDivElement>(null);
  const contentHeightsRef = useRef<Record<string, number>>({});


  // Extract FAQ items from slotted Collection List
  useEffect(() => {
    const extractFAQItems = () => {
      if (!slotRef.current) return;

      const faqItems: FAQItem[] = [];
      let searchContainer: HTMLElement | null = null;

      // Try to find the slot element for Shadow DOM
      let slotElement = slotRef.current.querySelector('slot');

      if (slotElement) {
        // Shadow DOM: get assigned elements from the slot
        const assignedElements = (slotElement as any).assignedElements?.({ flatten: true }) || [];

        // Find the root container (usually the w-dyn-list)
        if (assignedElements.length > 0) {
          searchContainer = assignedElements[0];
        }
      } else {
        // Regular DOM: use the slot ref container
        searchContainer = slotRef.current;
      }

      if (searchContainer) {
        // Find ALL question elements
        const questionElements = searchContainer.querySelectorAll('[data-faq-question]');

        questionElements.forEach((questionEl: any, index: number) => {
          // Find the closest container that wraps this question and an answer
          // This handles nested structures like Webflow's w-dyn-item
          let container = questionEl.closest('[role="listitem"]') ||
                         questionEl.parentElement?.parentElement ||
                         questionEl.parentElement;

          if (container) {
            // Find the answer within this container
            const answerEl = container.querySelector('[data-faq-answer]');

            if (answerEl) {
              // Clone the actual DOM elements to preserve all HTML and structure
              const questionClone = questionEl.cloneNode(true) as HTMLElement;
              const answerClone = answerEl.cloneNode(true) as HTMLElement;

              // Do NOT copy computed styles - let CSS variables handle styling
              // CSS variables (--faq-question-color, etc.) will apply styles in Shadow DOM
              // Copying computed styles creates massive inline style attributes that override CSS variables

              // Verify clones have content
              if (questionClone.textContent?.trim() && answerClone.textContent?.trim()) {
                faqItems.push({
                  id: `faq-item-${faqItems.length}`,
                  questionElement: questionClone,
                  answerElement: answerClone
                });
              }
            }
          }
        });
      }

      // Set initial open item if type is 'single'
      if (faqItems.length > 0) {
        setItems(faqItems);

        // defaultOpenIndex: 0 = none, 1 = first item, 2 = second item, etc.
        const itemIndex = defaultOpenIndex - 1;
        if (type === 'single' && itemIndex >= 0 && itemIndex < faqItems.length) {
          setOpenItems(new Set([faqItems[itemIndex].id]));
        }
      }
    };

    // Try immediately
    extractFAQItems();

    // Retry after delays to ensure DOM is ready
    const timeoutId1 = setTimeout(extractFAQItems, 100);
    const timeoutId2 = setTimeout(extractFAQItems, 300);
    const timeoutId3 = setTimeout(extractFAQItems, 1000);

    // Listen for slot changes
    if (slotRef.current) {
      const slotElement = slotRef.current.querySelector('slot');
      if (slotElement) {
        const handleSlotChange = () => {
          extractFAQItems();
        };
        (slotElement as any).addEventListener?.('slotchange', handleSlotChange);

        return () => {
          clearTimeout(timeoutId1);
          clearTimeout(timeoutId2);
          clearTimeout(timeoutId3);
          (slotElement as any).removeEventListener?.('slotchange', handleSlotChange);
        };
      }
    }

    return () => {
      clearTimeout(timeoutId1);
      clearTimeout(timeoutId2);
      clearTimeout(timeoutId3);
    };
  }, [children, type, defaultOpenIndex]);

  // Toggle item open/closed
  const toggleItem = (itemId: string) => {
    if (type === 'single') {
      // Single mode: only one item open
      setOpenItems(openItems.has(itemId) ? new Set() : new Set([itemId]));
    } else {
      // Multiple mode: multiple items can be open
      const newOpenItems = new Set(openItems);
      if (newOpenItems.has(itemId)) {
        newOpenItems.delete(itemId);
      } else {
        newOpenItems.add(itemId);
      }
      setOpenItems(newOpenItems);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, itemId: string) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggleItem(itemId);
    }
  };


  // Measure content heights for animation
  const measureHeight = (itemId: string, contentElement: HTMLElement | null) => {
    if (contentElement) {
      // Use a small delay to ensure content is fully rendered
      setTimeout(() => {
        contentHeightsRef.current[itemId] = contentElement.scrollHeight;
      }, 0);
    }
  };

  return (
    <div
      className="faq"
      style={{
        '--faq-icon-width': iconWidth,
        '--faq-icon-height': iconHeight,
        '--faq-chevron-color': chevronColor,
        '--faq-border-color': borderColor,
        '--faq-border-width': borderWidth,
        '--faq-border-radius': borderRadius,
        '--faq-hover-color': hoverColor,
        '--faq-question-color': questionColor,
        '--faq-answer-color': answerColor,
        '--faq-question-font-size': questionFontSize,
        '--faq-question-font-family': questionFontFamily,
        '--faq-question-font-weight': questionFontWeight,
        '--faq-answer-font-size': answerFontSize,
        '--faq-answer-font-family': answerFontFamily,
        '--faq-item-gap': itemGap,
        '--faq-question-padding': questionPadding,
        '--faq-answer-padding': answerPadding,
      } as React.CSSProperties}
    >
      {/* Hidden slot for Collection List */}
      <div ref={slotRef} style={{ display: 'none' }}>
        {children}
      </div>

      {/* FAQ Items */}
      {items.length > 0 ? (
        <div className="faq__list">
          {items.map((item) => {
            const isOpen = openItems.has(item.id);
            const contentHeight = contentHeightsRef.current[item.id] || 0;

            return (
              <div
                key={item.id}
                className={`faq__item ${isOpen ? 'faq__item--open' : ''}`}
              >
                {/* Question / Trigger */}
                <button
                  className="faq__trigger"
                  onClick={() => toggleItem(item.id)}
                  onKeyDown={(e) => handleKeyDown(e, item.id)}
                  aria-expanded={isOpen}
                  aria-controls={`${item.id}-content`}
                  ref={(el) => {
                    if (el && item.questionElement) {
                      // Remove any previously inserted question
                      const existingQuestion = el.querySelector('[data-faq-question]');
                      if (existingQuestion) {
                        existingQuestion.remove();
                      }

                      // Clone the question element
                      const questionClone = item.questionElement.cloneNode(true) as HTMLElement;

                      // Force flex layout styles only to prevent breaking the button layout
                      questionClone.style.display = 'inline-block';
                      questionClone.style.flex = '1';
                      questionClone.style.minWidth = '0';

                      // Clear inline font-weight to allow CSS variable to work
                      questionClone.style.fontWeight = '';

                      // Let CSS variables and .faq__trigger [data-faq-question] selector handle all styling
                      // This ensures --faq-question-color, --faq-question-font-size, --faq-question-font-weight, etc. work properly

                      // Insert cloned question before icon (so icon stays visually on right)
                      const iconElement = el.querySelector('.faq__icon');
                      if (iconElement) {
                        el.insertBefore(questionClone, iconElement);
                      } else {
                        el.appendChild(questionClone);
                      }
                    }
                  }}
                >
                  <span className="faq__icon" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m6 9 6 6 6-6"/>
                    </svg>
                  </span>
                </button>

                {/* Answer / Content */}
                <div
                  id={`${item.id}-content`}
                  className="faq__content"
                  style={{
                    maxHeight: isOpen ? `${contentHeight}px` : '0px',
                    transitionDuration: `${animationDuration}s`
                  }}
                  role="region"
                  aria-labelledby={item.id}
                  ref={(el) => {
                    if (el && item.answerElement) {
                      // Clear previous content
                      el.innerHTML = '';
                      // Create wrapper for answer with padding class
                      const answerWrapper = document.createElement('div');
                      answerWrapper.className = 'faq__answer';
                      // Insert cloned answer into wrapper
                      answerWrapper.appendChild(item.answerElement.cloneNode(true));
                      // Insert wrapper into content
                      el.appendChild(answerWrapper);
                      // Measure height after insertion
                      measureHeight(item.id, el);
                    }
                  }}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="faq__empty">
          <p>No FAQ items found. Add a Collection List with elements containing <code>data-faq-question</code> and <code>data-faq-answer</code> attributes.</p>
        </div>
      )}
    </div>
  );
};

export default FAQ;
