import React, { useRef, useEffect, CSSProperties } from 'react';
import './MagnetLines.css';

interface MagnetLinesProps {
  rows?: number;
  columns?: number;
  containerSize?: string;
  lineColor?: string;
  lineWidth?: string;
  lineHeight?: string;
  borderRadius?: string;
  baseAngle?: number;
  gap?: string;
  backgroundColor?: string;
  multicolor?: boolean;
  colorPalette?: string[];
  className?: string;
  style?: CSSProperties;
}

const MagnetLines: React.FC<MagnetLinesProps> = ({
  rows = 9,
  columns = 9,
  containerSize = '100%',
  lineColor = '#00ff00',
  lineWidth = '4vmin',
  lineHeight = '4vmin',
  borderRadius = '2px',
  baseAngle = 0,
  gap = '0px',
  backgroundColor = '#000000',
  multicolor = false,
  colorPalette = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'],
  className = '',
  style = {}
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const handlerRef = useRef<((e: PointerEvent) => void) | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Remove old listener if exists
    if (handlerRef.current) {
      window.removeEventListener('pointermove', handlerRef.current);
      handlerRef.current = null;
    }

    // Wait for DOM to update
    const timer = setTimeout(() => {
      const items = container.querySelectorAll<HTMLSpanElement>('span');

      const onPointerMove = (pointer: { x: number; y: number }) => {
        items.forEach(item => {
          const rect = item.getBoundingClientRect();
          const centerX = rect.x + rect.width / 2;
          const centerY = rect.y + rect.height / 2;

          const b = pointer.x - centerX;
          const a = pointer.y - centerY;
          const c = Math.sqrt(a * a + b * b) || 1;
          const r = ((Math.acos(b / c) * 180) / Math.PI) * (pointer.y > centerY ? 1 : -1);

          item.style.setProperty('--rotate', `${r}deg`);
        });
      };

      handlerRef.current = (e: PointerEvent) => {
        onPointerMove({ x: e.x, y: e.y });
      };

      window.addEventListener('pointermove', handlerRef.current);

      // Initialize with middle position
      if (items.length) {
        const middleIndex = Math.floor(items.length / 2);
        const rect = items[middleIndex].getBoundingClientRect();
        onPointerMove({ x: rect.x, y: rect.y });
      }
    }, 0);

    return () => {
      clearTimeout(timer);
      if (handlerRef.current) {
        window.removeEventListener('pointermove', handlerRef.current);
      }
    };
  }, [rows, columns, multicolor, colorPalette]);

  const total = rows * columns;
  const spans = Array.from({ length: total }, (_, i) => {
    const color = multicolor 
      ? colorPalette[Math.floor(Math.random() * colorPalette.length)]
      : lineColor;
    
    return (
      <span
        key={i}
        style={
          {
            '--rotate': `${baseAngle}deg`,
            backgroundColor: color,
            width: lineWidth,
            height: lineHeight,
            borderRadius: borderRadius
          } as CSSProperties
        }
      />
    );
  });

  return (
    <div
      ref={containerRef}
      className={`magnetLines-container ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gap: gap,
        rowGap: gap,
        columnGap: gap,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        padding: 0,
        margin: 0,
        boxSizing: 'border-box',
        backgroundColor: backgroundColor,
        ...style
      }}
    >
      {spans}
    </div>
  );
};

export default MagnetLines;
