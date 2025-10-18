import React, { useState, useEffect, useRef } from 'react';
import { useWebflowContext } from '@webflow/react';

interface ModalProps {
  /** Unique identifier for the modal (matches data-modal-trigger value) */
  id: string;
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
  /** Slot for modal content */
  children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  id,
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
  closeButtonStrokeWidth = '2',
  children
}) => {
  // Modal always starts closed - showInDesigner only controls visibility in designer
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use official Webflow hook for mode detection
  // This automatically updates when user switches between Design/Canvas and Preview modes
  const { mode } = useWebflowContext();

  const isInDesignerCanvas = mode === 'design';
  const isInPreviewMode = mode === 'preview';

  // Handle opening modal
  const openModal = () => {
    previousActiveElement.current = document.activeElement as HTMLElement;
    setIsOpen(true);
    setIsClosing(false);
  };

  // Handle closing modal with animation
  const closeModal = () => {
    setIsClosing(true);
    // Wait for animation to complete before hiding modal
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false); // CRITICAL: Reset closing state so component can unmount
      // Return focus to trigger element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }, animationDuration * 1000);
  };

  // Designer preview mode - only works in Designer canvas mode
  useEffect(() => {
    if (!isInDesignerCanvas) {
      // On published page or preview mode, this effect does nothing
      return;
    }

    // In Designer canvas mode, sync modal visibility with toggle
    if (showInDesigner) {
      setIsOpen(true);
      setIsClosing(false);
    } else {
      setIsOpen(false);
      setIsClosing(false);
    }
  }, [showInDesigner, isInDesignerCanvas]);

  // Body scroll lock - keep locked during opening AND closing animations
  useEffect(() => {
    if (isOpen || isClosing) {
      document.body.style.overflow = 'hidden';
    } else {
      // Defer scroll restoration to next frame to prevent flash during unmount
      requestAnimationFrame(() => {
        document.body.style.overflow = '';
      });
    }
  }, [isOpen, isClosing]);

  // Listen for trigger clicks (blocked only in Designer canvas)
  useEffect(() => {
    const handleTriggerClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const trigger = target.closest(`[data-modal-trigger="${id}"]`);

      if (!trigger) return; // Not a trigger for this modal, ignore

      // Block triggers only in Designer canvas mode
      if (isInDesignerCanvas) {
        return;
      }

      // On published page or preview mode, triggers work normally
      e.preventDefault();
      openModal();
    };

    // Add click listener to document
    document.addEventListener('click', handleTriggerClick);

    // Setup MutationObserver for dynamically added triggers
    const observer = new MutationObserver(() => {
      // Observer is just to detect DOM changes
      // The click listener above will handle new triggers
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      document.removeEventListener('click', handleTriggerClick);
      observer.disconnect();
    };
  }, [id, isInDesignerCanvas]);

  // Handle ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const modal = modalRef.current;
    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    // Focus first element or modal itself
    if (firstFocusable) {
      firstFocusable.focus();
    } else {
      modal.focus();
    }

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable?.focus();
        }
      }
    };

    modal.addEventListener('keydown', handleTabKey);

    return () => {
      modal.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Restore body scroll if component unmounts while modal is open
      document.body.style.overflow = '';
    };
  }, []);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // Keep component mounted during closing animation
  if (!isOpen && !isClosing) return null;

  return (
    <div
      ref={containerRef}
      className={`modal-backdrop ${isClosing ? 'closing' : ''}`}
      onClick={handleBackdropClick}
      style={{
        // @ts-ignore - CSS custom properties
        '--backdrop-color': backdropColor,
        '--backdrop-blur': backdropBlur,
        '--animation-duration': `${animationDuration}s`
      }}
      role="presentation"
    >
      <button
        className="modal-close"
        onClick={closeModal}
        aria-label="Close modal"
        style={{
          // @ts-ignore - CSS custom properties
          '--close-color': closeButtonColor,
          '--close-size': closeButtonSize,
          '--close-hover-color': closeButtonHoverColor,
          '--close-border-radius': closeButtonBorderRadius,
          '--close-padding': closeButtonPadding,
          '--close-bg-color': closeButtonBgColor,
          '--close-hover-bg-color': closeButtonHoverBgColor,
          '--close-stroke-width': closeButtonStrokeWidth
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 50 50">
          <line x1="12" y1="12" x2="38" y2="38" stroke="currentColor" strokeLinecap="round" />
          <line x1="38" y1="12" x2="12" y2="38" stroke="currentColor" strokeLinecap="round" />
        </svg>
      </button>
      <div
        ref={modalRef}
        className={`modal-container ${isClosing ? 'closing' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`modal-${id}`}
        tabIndex={-1}
        style={{
          // @ts-ignore - CSS custom properties
          '--modal-bg': backgroundColor,
          '--modal-max-width': maxWidth,
          '--modal-max-height': maxHeight,
          '--modal-padding': padding,
          '--modal-radius': borderRadius
        }}
      >
        <div className="modal-content" id={`modal-${id}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
