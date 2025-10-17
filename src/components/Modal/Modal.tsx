import React, { useEffect, useRef, useState, useCallback } from 'react';

interface ModalProps {
  id: string;
  children?: React.ReactNode;
  placement?: 'auto' | 'top' | 'bottom' | 'center' | 'top-center' | 'bottom-center';
  scrollBehavior?: 'inside' | 'outside';
  maxWidth?: string;
  maxHeight?: string;
  backdrop?: 'opaque' | 'blur' | 'transparent';
  borderRadius?: string;
  shadow?: string;
  backdropColor?: string;
  padding?: string;
  showCloseButton?: boolean;
  closeButtonColor?: string;
  closeButtonPosition?: 'top-right' | 'top-left' | 'inside-right' | 'inside-left';
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  blockPageScroll?: boolean;
  updateUrlHash?: boolean;
  animationStyle?: 'fade' | 'fade-scale' | 'slide-up' | 'slide-down' | 'none';
  animationDuration?: number;
  zIndex?: number;
  previewMode?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  id,
  children,
  placement = 'auto',
  scrollBehavior = 'inside',
  maxWidth = '',
  maxHeight = '',
  backdrop = 'opaque',
  borderRadius = '12px',
  shadow = '0 10px 40px rgba(0, 0, 0, 0.1)',
  backdropColor = 'rgba(0, 0, 0, 0.5)',
  padding = '24px',
  showCloseButton = true,
  closeButtonColor = '#000000',
  closeButtonPosition = 'top-right',
  closeOnBackdropClick = true,
  closeOnEscape = true,
  blockPageScroll = true,
  updateUrlHash = true,
  animationStyle = 'fade-scale',
  animationDuration = 300,
  zIndex = 9999,
  previewMode = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const scrollPositionRef = useRef(0);
  const [animationKey, setAnimationKey] = useState(0);

  // Handle opening modal
  const openModal = useCallback((triggerElement?: HTMLElement) => {
    if (isOpen) return;

    // Store trigger element for focus return
    if (triggerElement) {
      triggerElementRef.current = triggerElement;
    }

    // Store current active element
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Store scroll position and block scroll if needed
    if (blockPageScroll) {
      scrollPositionRef.current = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
    }

    // Update URL hash
    if (updateUrlHash && id) {
      window.history.pushState(null, '', `#${id}`);
    }

    setIsOpen(true);
    setIsAnimating(true);

    // Focus modal after animation
    setTimeout(() => {
      setIsAnimating(false);
      if (modalRef.current) {
        const firstFocusable = modalRef.current.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        firstFocusable?.focus();
      }
    }, animationDuration);
  }, [isOpen, blockPageScroll, updateUrlHash, id, animationDuration]);

  // Handle closing modal
  const closeModal = useCallback(() => {
    if (!isOpen) return;

    setIsAnimating(true);

    setTimeout(() => {
      setIsOpen(false);
      setIsAnimating(false);

      // Restore scroll
      if (blockPageScroll) {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        window.scrollTo(0, scrollPositionRef.current);
      }

      // Update URL hash
      if (updateUrlHash && window.location.hash === `#${id}`) {
        window.history.back();
      }

      // Return focus to trigger element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }, animationDuration);
  }, [isOpen, blockPageScroll, updateUrlHash, id, animationDuration]);

  // Handle trigger clicks
  useEffect(() => {
    const handleTriggerClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const trigger = target.closest<HTMLElement>(`[data-modal-trigger="${id}"]`);

      if (trigger) {
        e.preventDefault();
        openModal(trigger);
      }
    };

    document.addEventListener('click', handleTriggerClick);
    return () => document.removeEventListener('click', handleTriggerClick);
  }, [id, openModal]);

  // Handle close button clicks
  useEffect(() => {
    if (!isOpen) return;

    const handleCloseClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const closeButton = target.closest<HTMLElement>('[data-modal-close]');

      if (closeButton) {
        const targetId = closeButton.getAttribute('data-modal-close');
        if (!targetId || targetId === id) {
          e.preventDefault();
          closeModal();
        }
      }
    };

    document.addEventListener('click', handleCloseClick);
    return () => document.removeEventListener('click', handleCloseClick);
  }, [isOpen, id, closeModal]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEscape, closeModal]);

  // Handle hash change (browser back/forward)
  useEffect(() => {
    if (!updateUrlHash) return;

    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash === id && !isOpen) {
        openModal();
      } else if (hash !== id && isOpen) {
        // Close without updating hash (already changed)
        setIsAnimating(true);
        setTimeout(() => {
          setIsOpen(false);
          setIsAnimating(false);
          if (blockPageScroll) {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
            window.scrollTo(0, scrollPositionRef.current);
          }
        }, animationDuration);
      }
    };

    window.addEventListener('hashchange', handleHashChange);

    // Check initial hash on mount
    if (window.location.hash.slice(1) === id) {
      openModal();
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [updateUrlHash, id, isOpen, openModal, blockPageScroll, animationDuration]);

  // Handle focus trap
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const modal = modalRef.current;
    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable?.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable?.focus();
        }
      }
    };

    modal.addEventListener('keydown', handleTabKey);
    return () => modal.removeEventListener('keydown', handleTabKey);
  }, [isOpen]);

  // Determine if modal should be visible
  const shouldShowModal = previewMode || isOpen;

  // Re-trigger animation when animation props change in preview mode
  useEffect(() => {
    // Only trigger in preview mode when modal is visible
    if (!previewMode || !shouldShowModal) return;

    // Reset animation first
    setIsAnimating(false);

    // Force a small delay to reset the animation state
    const resetTimer = setTimeout(() => {
      // Increment key to force animation re-render
      setAnimationKey((prev) => prev + 1);

      // Trigger animation state
      setIsAnimating(true);

      // End animation after duration
      const endTimer = setTimeout(() => {
        setIsAnimating(false);
      }, animationDuration);

      return () => clearTimeout(endTimer);
    }, 50); // Small delay to ensure animation resets

    return () => clearTimeout(resetTimer);
  }, [animationStyle, animationDuration, previewMode, shouldShowModal]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      closeModal();
    }
  };

  // Close button SVG
  const CloseIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M18 6L6 18M6 6L18 18"
        stroke={closeButtonColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  // Animation class based on style
  const getAnimationClass = () => {
    if (animationStyle === 'none') return '';
    return `modal-animation-${animationStyle}`;
  };

  return (
    <div
      className={`modal-wrapper ${shouldShowModal ? 'modal-visible' : ''} ${
        previewMode && !isOpen ? 'modal-preview' : ''
      }`}
      style={{
        display: shouldShowModal ? 'block' : 'none',
        zIndex,
        '--modal-animation-duration': `${animationDuration}ms`,
      } as React.CSSProperties}
      data-modal-id={id}
      inert={!isOpen && !previewMode ? ('' as any) : undefined}
    >
      {/* Backdrop */}
      <div
        className={`modal-backdrop modal-backdrop-${backdrop}`}
        onClick={handleBackdropClick}
        aria-hidden="true"
        style={{
          backgroundColor: backdropColor,
        }}
      />

      {/* Modal Content */}
      <div
        className={`modal-container modal-placement-${placement} modal-scroll-${scrollBehavior}`}
        onClick={handleBackdropClick}
      >
        <div
          ref={modalRef}
          key={animationKey}
          className={`modal-content ${getAnimationClass()} ${
            isAnimating ? 'modal-animating' : ''
          }`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${id}-title`}
          style={{
            maxWidth: maxWidth || undefined,
            maxHeight: maxHeight || undefined,
            borderRadius: borderRadius || undefined,
            boxShadow: shadow || undefined,
            padding: padding || undefined,
          }}
        >
          {/* Close Button */}
          {showCloseButton && (
            <button
              type="button"
              className={`modal-close-button modal-close-${closeButtonPosition}`}
              onClick={closeModal}
              aria-label="Close modal"
              style={{
                color: closeButtonColor,
              }}
            >
              <CloseIcon />
            </button>
          )}

          {/* Content Slot */}
          <div className="modal-body">{children}</div>

          {/* Preview Mode Badge */}
          {previewMode && !isOpen && (
            <div className="modal-preview-badge">
              Preview Mode - Hidden on published site
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
