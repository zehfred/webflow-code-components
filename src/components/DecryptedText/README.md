# Decrypted Text

Animated text component with a scrambling "decryption" effect that reveals text character-by-character or all at once. Perfect for tech-themed designs, hero headings, and interactive text reveals.

## Features

- **Multiple animation triggers** (hover, scroll into view, or both)
- **Sequential or simultaneous** character reveals
- **Customizable reveal direction** (start, end, center)
- **Adjustable animation speed** and iteration count
- **SEO-friendly** (text renders on server, animations enhance on client)
- **Fully accessible** (screen reader support, no content shift)
- **CSS variable customization** for colors and styling
- **Custom character sets** for scrambling effect

## Props

### Content Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | TextNode | 'Hover me!' | The text content to animate |

### Behavior Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `animateOn` | 'hover' \| 'view' \| 'both' | 'hover' | When to trigger the animation |
| `speed` | number | 50 | Animation speed in milliseconds (10-500, lower = faster) |
| `sequential` | boolean | false | Reveal characters one at a time vs. all at once |
| `revealDirection` | 'start' \| 'end' \| 'center' | 'start' | Direction for sequential reveal |
| `maxIterations` | number | 10 | Scramble cycles before revealing (when sequential is false) |

### Advanced Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `useOriginalCharsOnly` | boolean | false | Only shuffle characters from original text |
| `characters` | string | 'A-Za-z!@#$%...' | Custom character set for scrambling |

### Styling Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | string | '' | CSS class for revealed characters |
| `parentClassName` | string | '' | CSS class for wrapper element |
| `encryptedClassName` | string | '' | CSS class for scrambled characters |

## Webflow Setup

1. **Add component** to your canvas
2. **Edit text** directly in the Designer (uses TextNode)
3. **Adjust animation settings** in the component panel:
   - Choose trigger type (hover/view/both)
   - Set speed and reveal mode
   - Customize appearance with CSS variables

## Usage

### Basic Hover Effect

```tsx
import DecryptedText from './components/DecryptedText';

<DecryptedText
  text="Hover to decrypt"
  speed={50}
  animateOn="hover"
/>
```

### Scroll-Triggered Sequential Reveal

```tsx
<DecryptedText
  text="This text animates when scrolled into view"
  animateOn="view"
  sequential={true}
  revealDirection="center"
  speed={80}
/>
```

### Custom Character Set

```tsx
<DecryptedText
  text="01010101"
  characters="01"
  speed={30}
  maxIterations={15}
/>
```

## Styling Approach

### CSS Variables

Control appearance using CSS variables (set in Webflow Variables tool):

```css
--decrypted-text-color: #000000;              /* Color of revealed text */
--decrypted-text-font-weight: 600;            /* Font weight of revealed text */
--encrypted-text-color: rgba(128, 128, 128, 0.7); /* Color of scrambled text */
--encrypted-text-font-weight: 400;            /* Font weight of scrambled text */
```

### Custom Classes

Use the class name props for advanced styling:

- `className` - Applied to revealed characters
- `parentClassName` - Applied to the wrapper element
- `encryptedClassName` - Applied to scrambled characters

Example in custom CSS:

```css
.revealed-char {
  color: #00ff00;
  text-shadow: 0 0 10px #00ff00;
}

.encrypted-char {
  color: #003300;
  opacity: 0.5;
}
```

## Animation Modes

### Non-Sequential (Default)

All characters scramble randomly for N iterations, then fully reveal:
- Set `sequential={false}`
- Adjust `maxIterations` to control how long scrambling lasts
- Creates a "matrix" or chaotic effect

### Sequential

Characters reveal one at a time in order:
- Set `sequential={true}`
- Use `revealDirection` to control order:
  - `start` - Left to right
  - `end` - Right to left
  - `center` - From middle outward
- Creates a smooth typing/decryption effect

## Technical Notes

- **SSR Enabled** - Text renders on server for SEO, animations enhance on client
- **IntersectionObserver** - Used for scroll-triggered animations (client-side only)
- **Accessibility** - Real text always present for screen readers (hidden visually)
- **Performance** - Animation uses React state updates, efficient for text lengths up to ~100 characters
- **No Layout Shift** - Animation is purely visual, doesn't affect text flow

## SEO & Accessibility

✓ **SEO-Friendly**: Text content renders on server and is available to search engines
✓ **Screen Reader Support**: Hidden `<span>` contains actual text for assistive technology
✓ **Progressive Enhancement**: Works without JavaScript (shows static text)
✓ **ARIA Attributes**: Animated version marked as `aria-hidden="true"`

## Browser Compatibility

- Modern browsers with IntersectionObserver support
- Graceful degradation: Shows static text in older browsers
- Framer Motion (motion) library handles animation compatibility
