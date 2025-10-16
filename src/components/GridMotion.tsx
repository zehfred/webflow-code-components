import React, { useEffect, useRef, useMemo, useState } from 'react';
import { gsap } from 'gsap';
import './GridMotion.css';

export interface GridMotionProps {
  /** Array of image URLs or text */
  items?: (string | any)[];
  /** Children slot for Collection List */
  children?: any;
  /** Background gradient color */
  gradientColor?: string;
  /** Grid rotation angle (in degrees) */
  rotationAngle?: number;
  /** Maximum movement amount */
  maxMoveAmount?: number;
  /** Base animation duration */
  animationDuration?: number;
  /** Background color of items */
  itemBackgroundColor?: string;
  /** Border-radius of items */
  borderRadius?: string;
}

const GridMotion = ({
  items = [],
  children,
  gradientColor = 'black',
  rotationAngle = -15,
  maxMoveAmount = 300,
  animationDuration = 0.8,
  itemBackgroundColor = '#111',
  borderRadius = '10px'
}: GridMotionProps) => {
  const gridRef = useRef(null);
  const rowRefs = useRef([]);
  const mouseXRef = useRef(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
  const slotRef = useRef(null);
  const [extractedImages, setExtractedImages] = useState([]);
  const isMouseInsideRef = useRef(false);

  const TOTAL_ITEMS = 28; // 4 rows × 7 columns
  const ROWS = 4;
  const COLS = 7;

  // Extract images from slot (Collection List)
  useEffect(() => {
    const extractImages = () => {
      if (!slotRef.current) return;
      
      // Try multiple approaches to find the slot
      let slotElement = slotRef.current.querySelector('slot');
      
      // If not found, try finding from shadow root
      if (!slotElement && slotRef.current.getRootNode) {
        const root: any = slotRef.current.getRootNode();
        if (root && root.host) {
          slotElement = root.querySelector('slot[name="children"]') || root.querySelector('slot');
        }
      }
      
      if (slotElement) {
        // Shadow DOM: get assigned elements from the slot
        const assignedElements = (slotElement as any).assignedElements?.({ flatten: true }) || [];
        const imgElements: HTMLImageElement[] = [];
        
        // Search for images in assigned elements
        assignedElements.forEach((element: any) => {
          if (element.tagName === 'IMG') {
            imgElements.push(element as HTMLImageElement);
          } else {
            // Search for images within the element
            const imgs: NodeListOf<HTMLImageElement> = element.querySelectorAll('img');
            Array.from(imgs).forEach(img => imgElements.push(img));
          }
        });
        
        const imageUrls = imgElements.map(img => img.src).filter(src => src);
        if (imageUrls.length > 0) {
          setExtractedImages(imageUrls);
        }
      } else {
        // Regular DOM: query directly
        const imgElements = slotRef.current.querySelectorAll('img');
        const imageUrls = Array.from(imgElements).map((img: any) => img.src).filter((src: string) => src);
        if (imageUrls.length > 0) {
          setExtractedImages(imageUrls);
        }
      }
    };

    // Try immediately
    extractImages();
    
    // Try after delays to ensure DOM is ready
    const timeoutId1 = setTimeout(extractImages, 100);
    const timeoutId2 = setTimeout(extractImages, 300);
    const timeoutId3 = setTimeout(extractImages, 1000);
    
    // Also listen for slot changes
    if (slotRef.current) {
      const slotElement = slotRef.current.querySelector('slot');
      if (slotElement) {
        const handleSlotChange = () => extractImages();
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
  }, [children]);

  // Prepare items: repeat or fill as necessary
  const gridItems = useMemo(() => {
    // Priority: extractedImages > items > fallback
    const sourceItems = extractedImages.length > 0 ? extractedImages : items;
    
    if (sourceItems.length === 0) {
      // Fallback: create text items
      return Array.from({ length: TOTAL_ITEMS }, (_, i) => `Item ${i + 1}`);
    }
    
    if (sourceItems.length >= TOTAL_ITEMS) {
      // We have enough items, use the first 28
      return sourceItems.slice(0, TOTAL_ITEMS);
    }
    
    // Fewer items than needed: repeat in cycle
    const repeated: any[] = [];
    for (let i = 0; i < TOTAL_ITEMS; i++) {
      repeated.push(sourceItems[i % sourceItems.length]);
    }
    return repeated;
  }, [items, extractedImages]);

  useEffect(() => {
    // Optimization: reduce GSAP lag
    gsap.ticker.lagSmoothing(0);

    const handleMouseMove = (e: MouseEvent): void => {
      mouseXRef.current = e.clientX;
    };

    const handleMouseEnter = (): void => {
      isMouseInsideRef.current = true;
    };

    const handleMouseLeave = (): void => {
      isMouseInsideRef.current = false;

      // Reset all rows to center position
      rowRefs.current.forEach((row, index) => {
        if (row) {
          const inertiaFactors = [0.6, 0.4, 0.3, 0.2];
          gsap.to(row, {
            x: 0,
            duration: animationDuration + inertiaFactors[index % inertiaFactors.length],
            ease: 'power3.out',
            overwrite: 'auto'
          });
        }
      });
    };

    const updateMotion = (): void => {
      // Only update motion if mouse is inside the component
      if (!isMouseInsideRef.current) return;

      // Inertia factors for creating depth effect
      const inertiaFactors = [0.6, 0.4, 0.3, 0.2];

      rowRefs.current.forEach((row, index) => {
        if (row) {
          // Alternate direction between even and odd rows
          const direction = index % 2 === 0 ? 1 : -1;

          // Calculate movement based on mouse position
          let normalizedMouseX = (mouseXRef.current / window.innerWidth) - 0.5;

          // Clamp the normalized value to prevent extreme movements
          normalizedMouseX = Math.max(-0.5, Math.min(0.5, normalizedMouseX));

          const moveAmount = normalizedMouseX * maxMoveAmount * direction;

          // Animate with GSAP
          gsap.to(row, {
            x: moveAmount,
            duration: animationDuration + inertiaFactors[index % inertiaFactors.length],
            ease: 'power3.out',
            overwrite: 'auto'
          });
        }
      });
    };

    // Add to GSAP ticker for smooth animation
    const removeAnimationLoop = gsap.ticker.add(updateMotion);
    window.addEventListener('mousemove', handleMouseMove);

    // Add mouse enter/leave listeners on the component
    const introElement = gridRef.current;
    if (introElement) {
      introElement.addEventListener('mouseenter', handleMouseEnter);
      introElement.addEventListener('mouseleave', handleMouseLeave);
    }

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (introElement) {
        introElement.removeEventListener('mouseenter', handleMouseEnter);
        introElement.removeEventListener('mouseleave', handleMouseLeave);
      }
      removeAnimationLoop();
    };
  }, [maxMoveAmount, animationDuration]);

  // Check if content is an image URL
  const isImageUrl = (content: any): boolean => {
    return typeof content === 'string' && (
      content.startsWith('http') || 
      content.startsWith('/') ||
      content.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) !== null
    );
  };

  return (
    <div className="noscroll loading" ref={gridRef}>
      {/* Hidden slot for Collection List */}
      <div ref={slotRef} style={{ display: 'none' }}>
        {children}
      </div>

      <div
        className="intro"
        style={{
          background: `radial-gradient(circle, ${gradientColor} 0%, transparent 100%)`
        }}
      >
        <div 
          className="gridMotion-container"
          style={{
            transform: `rotate(${rotationAngle}deg)`
          }}
        >
          {Array.from({ length: ROWS }, (_, rowIndex) => (
            <div
              key={rowIndex}
              className="row"
              ref={el => {
                rowRefs.current[rowIndex] = el;
              }}
            >
              {Array.from({ length: COLS }, (_, colIndex) => {
                const itemIndex = rowIndex * COLS + colIndex;
                const content = gridItems[itemIndex];
                
                return (
                  <div key={colIndex} className="row__item">
                    <div 
                      className="row__item-inner" 
                      style={{ 
                        backgroundColor: itemBackgroundColor,
                        borderRadius: borderRadius
                      }}
                    >
                      {isImageUrl(content) ? (
                        <div
                          className="row__item-img"
                          style={{
                            backgroundImage: `url(${content})`,
                            borderRadius: borderRadius
                          }}
                          role="img"
                          aria-label={`Grid item ${itemIndex + 1}`}
                        />
                      ) : (
                        <div className="row__item-content">
                          {content}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="fullview"></div>
      </div>
    </div>
  );
};

export default GridMotion;