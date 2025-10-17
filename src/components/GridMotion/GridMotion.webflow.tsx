import React from 'react';
import { declareComponent } from '@webflow/react';
import { props } from '@webflow/data-types';
import GridMotion from './GridMotion';
import './GridMotion.css';

/**
 * ═══════════════════════════════════════════════════════════════
 * 🎯 HOW TO CONNECT WEBFLOW CMS IMAGES TO THIS COMPONENT
 * ═══════════════════════════════════════════════════════════════
 * 
 * OPTION 1 - Slot with Collection List (✨ RECOMMENDED - Easiest!)
 * ────────────────────────────────────────────────────────────────
 * 1. Drag this component onto the canvas
 * 2. Inside the "Images" slot, add a Collection List
 * 3. Connect the Collection List to your Collection (e.g: "Gallery")
 * 4. Inside the Collection List Item, add an Image element
 * 5. Connect the Image to the image field of the Collection
 * 6. DONE! Images automatically appear in the animated grid
 * 
 * ADVANTAGES:
 * - You don't need to configure anything extra
 * - Visual management in Webflow Designer
 * - Works with any Collection
 * 
 * OPTION 2 - JSON Array (alternative)
 * ────────────────────────────────────────────────────────────────
 * If you prefer, you can use the "Image URLs (JSON)" field:
 * ["url1.jpg", "url2.jpg", "url3.jpg"]
 * 
 * NOTE: The component needs 28 images to fill the 4×7 grid.
 * If you have fewer, images repeat automatically.
 * 
 * ═══════════════════════════════════════════════════════════════
 */

interface GridMotionWebflowProps {
  /** Slot for Collection List with images */
  children?: any;
  /** JSON string with array of image URLs */
  imageUrlsJson?: string;
  /** Color of the radial gradient background */
  gradientColor?: string;
  /** Grid rotation angle */
  rotationAngle?: number;
  /** Intensity of movement */
  maxMoveAmount?: number;
  /** Animation speed */
  animationDuration?: number;
  /** Background color of cards */
  itemBackgroundColor?: string;
  /** Corner rounding */
  borderRadius?: string;
}

const GridMotionWebflow = ({
  children,
  imageUrlsJson = '[]',
  gradientColor = 'black',
  rotationAngle = -15,
  maxMoveAmount = 300,
  animationDuration = 0.8,
  itemBackgroundColor = '#111',
  borderRadius = '10px'
}: GridMotionWebflowProps) => {
  // Processar URLs de imagens
  let imageUrls: string[] = [];
  
  try {
    // Tentar parsear como JSON
    const parsed = JSON.parse(imageUrlsJson);
    
    if (Array.isArray(parsed)) {
      imageUrls = parsed.filter(url => typeof url === 'string');
    } else if (typeof parsed === 'string') {
      // Se for uma string única, colocar num array
      imageUrls = [parsed];
    }
  } catch (error) {
    // Se não for JSON válido, tentar split por vírgula
    if (imageUrlsJson && imageUrlsJson.trim()) {
      imageUrls = imageUrlsJson
        .split(',')
        .map(url => url.trim())
        .filter(url => url.length > 0);
    }
  }

  // Se não houver imagens, usar placeholders do Unsplash
  if (imageUrls.length === 0) {
    imageUrls = [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
      'https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=800',
      'https://images.unsplash.com/photo-1634926878768-2a5b3c42f139?w=800',
      'https://images.unsplash.com/photo-1618556450991-2f1af64e8191?w=800',
      'https://images.unsplash.com/photo-1618004652321-13a63e576b80?w=800',
      'https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=800',
      'https://images.unsplash.com/photo-1634926878768-2a5b3c42f139?w=800',
    ];
  }

  return (
    <GridMotion
      items={imageUrls}
      gradientColor={gradientColor}
      rotationAngle={rotationAngle}
      maxMoveAmount={maxMoveAmount}
      animationDuration={animationDuration}
      itemBackgroundColor={itemBackgroundColor}
      borderRadius={borderRadius}
    >
      {children}
    </GridMotion>
  );
};

export default declareComponent(GridMotionWebflow, {
  name: 'Tilted Image Grid',
  description: 'Interactive 4×7 grid that reacts to mouse movement. Perfect for dynamic image galleries from CMS.',
  group: 'Interactive',
  
  props: {
    children: props.Slot({
      name: 'Images',
      tooltip: 'Add a Collection List with images here. The component will automatically extract all images and display them in the animated grid.'
    }),
    
    imageUrlsJson: props.Text({
      name: 'Image URLs (JSON)',
      defaultValue: JSON.stringify([
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
        'https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=800',
        'https://images.unsplash.com/photo-1634926878768-2a5b3c42f139?w=800',
        'https://images.unsplash.com/photo-1618556450991-2f1af64e8191?w=800',
      ]),
      group: 'Content',
      tooltip: '(OPTIONAL) JSON array of image URLs. Use this only if you don\'t use the slot above. Example: ["img1.jpg", "img2.jpg"]. NOTE: The slot takes priority over this field.'
    }),
    
    gradientColor: props.Text({
      name: 'Gradient Color',
      defaultValue: 'black',
      group: 'Style',
      tooltip: 'Radial gradient background color (ex: black, #1a1a1a, rgba(0,0,0,0.8))'
    }),
    
    rotationAngle: props.Number({
      name: 'Rotation Angle',
      defaultValue: -15,
      group: 'Style',
      min: -45,
      max: 45,
      decimals: 0,
      tooltip: 'Grid tilt angle in degrees (-45 to 45)'
    }),
    
    maxMoveAmount: props.Number({
      name: 'Movement Intensity',
      defaultValue: 300,
      group: 'Animation',
      min: 0,
      max: 1000,
      decimals: 0,
      tooltip: 'Maximum movement amount in pixels (0 = no movement)'
    }),
    
    animationDuration: props.Number({
      name: 'Animation Duration',
      defaultValue: 0.8,
      group: 'Animation',
      min: 0.1,
      max: 3,
      decimals: 1,
      tooltip: 'Animation speed in seconds (lower = faster)'
    }),
    
    itemBackgroundColor: props.Text({
      name: 'Item Background Color',
      defaultValue: '#111',
      group: 'Style',
      tooltip: 'Background color of cards (visible when image loads)'
    }),
    
    borderRadius: props.Text({
      name: 'Border Radius',
      defaultValue: '10px',
      group: 'Style',
      tooltip: 'Card border-radius (ex: 10px, 1rem, 0 for square)'
    })
  },
  
  options: {
    // Don't apply tag selectors to maintain full style control
    applyTagSelectors: false,
    // SSR disabled - component requires browser APIs (window, DOM)
    ssr: false
  }
});