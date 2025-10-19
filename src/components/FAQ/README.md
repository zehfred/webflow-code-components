# FAQ Accordion

Accessible accordion component for FAQs with Collection List integration and comprehensive styling controls.

## Features

- **Single or multiple** open items mode
- **Collection List integration** via data attributes
- **Fully accessible** (keyboard navigation, ARIA, screen readers)
- **Smooth animations** with customizable duration
- **Comprehensive styling props** with CSS variables support
- **Respects prefers-reduced-motion**

## Live Demo

[View live demo →](https://webflow-code-components.webflow.io/components/faq-component)

## Props

### Behavior Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | string | 'single' | Accordion behavior: 'single' or 'multiple' |
| `defaultOpenIndex` | number | 0 | Item open by default (0=none, 1=first, etc.) |
| `animationDuration` | number | 0.3 | Animation speed in seconds (0.1-2) |
| `itemGap` | string | '0px' | Gap between FAQ items |
| `children` | slot | - | Collection List with FAQ items |

### Icon Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | string | - | Custom icon image URL for expand/collapse indicator |
| `iconWidth` | string | '24px' | Width of the icon |
| `iconHeight` | string | '24px' | Height of the icon |

### Border Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `borderColor` | string | '#e5e5e5' | Border color for FAQ items |
| `borderWidth` | string | '1px' | Border width (supports CSS shorthand: `1px` or `1px 2px 0 1px`) |
| `borderRadius` | string | '0px' | Border radius (supports CSS shorthand: `8px` or `8px 0 0 8px`) |

### Color Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `hoverColor` | string | '#f9f9f9' | Background color on hover |
| `questionColor` | string | '#000000' | Question text color |
| `answerColor` | string | '#666666' | Answer text color |

### Typography Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `questionFontSize` | string | 'inherit' | Question font size |
| `questionFontFamily` | string | 'inherit' | Question font family |
| `questionFontWeight` | string | 'inherit' | Question font weight |
| `answerFontSize` | string | '16px' | Answer font size |
| `answerFontFamily` | string | 'inherit' | Answer font family |

### Spacing Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `questionPadding` | string | '16px' | Padding for question area (supports CSS shorthand) |
| `answerPadding` | string | '0 16px 16px 16px' | Padding for answer area (supports CSS shorthand) |

## Webflow Setup

1. **Create FAQ Collection** with "Question" and "Answer" fields
2. **Add FAQ component** to canvas
3. **Add Collection List** inside the component's slot
4. **Add elements** for question and answer:
   - Question element: add `data-faq-question` attribute
   - Answer element: add `data-faq-answer` attribute
5. **Bind to Collection** fields

## Usage

```tsx
import FAQ from './components/FAQ';

<FAQ
  type="single"
  defaultOpenIndex={1}
  animationDuration={0.3}
  icon="https://example.com/chevron.svg"
  borderColor="var(--border-color)"
  borderWidth="1px"
  borderRadius="8px"
  hoverColor="var(--hover-bg)"
  questionColor="var(--text-primary)"
  answerColor="var(--text-secondary)"
  questionPadding="20px"
  answerPadding="0 20px 20px 20px"
>
  {/* Collection List goes here */}
</FAQ>
```

## Styling Approach

All styling is controlled through **component props** in Webflow Designer. Each prop accepts:

- **Direct values**: `#FF0000`, `16px`, `600`, `'Inter', sans-serif`
- **CSS variables**: `var(--primary-color)`, `var(--font-lg)`, `var(--spacing-md)`
- **CSS shorthand**: Border width and radius support multi-value syntax
  - `borderWidth="1px 2px 0 1px"` (top, right, bottom, left)
  - `borderRadius="8px 0 0 8px"` (top-left, top-right, bottom-right, bottom-left)

### CSS Variables Used Internally

The component sets these CSS variables dynamically from props:

- `--faq-icon-width`, `--faq-icon-height`
- `--faq-border-color`, `--faq-border-width`, `--faq-border-radius`
- `--faq-hover-color`
- `--faq-question-color`, `--faq-question-font-size`, `--faq-question-font-family`, `--faq-question-font-weight`
- `--faq-answer-color`, `--faq-answer-font-size`, `--faq-answer-font-family`
- `--faq-item-gap`
- `--faq-question-padding`, `--faq-answer-padding`

## Technical Notes

- Shadow DOM slot extraction for Collection List content
- Multi-strategy content extraction with retry delays
- SSR disabled (requires DOM access)
- Keyboard accessible (Space/Enter to toggle)
