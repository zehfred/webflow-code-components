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
  /** Position of expand/collapse icon */
  iconPosition?: 'left' | 'right';
  /** Animation duration in seconds */
  animationDuration?: number;
  /** Children slot for Collection List */
  children?: any;
}

const FAQ = ({
  type = 'single',
  defaultOpenIndex = 0,
  iconPosition = 'right',
  animationDuration = 0.3,
  children
}: FAQProps) => {
  const [items, setItems] = useState<FAQItem[]>([]);
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const slotRef = useRef(null);
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
    <div className="faq">
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
                  className={`faq__trigger ${iconPosition === 'left' ? 'faq__trigger--icon-left' : ''}`}
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

                      // Let CSS variables and .faq__trigger * selector handle all styling
                      // This ensures --faq-question-color, --faq-question-font-size, etc. work properly

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
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 10 13 14 9"></polyline>
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
                      // Insert cloned answer directly
                      el.appendChild(item.answerElement.cloneNode(true));
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
