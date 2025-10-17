# FAQ Accordion

Accessible accordion component for FAQs with Collection List integration and CSS variables styling.

## Features

- **Single or multiple** open items mode
- **Collection List integration** via data attributes
- **Fully accessible** (keyboard navigation, ARIA, screen readers)
- **Smooth animations** with customizable duration
- **CSS Variables styling** for centralized design control
- **Respects prefers-reduced-motion**

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | string | 'single' | Accordion behavior: 'single' or 'multiple' |
| `defaultOpenIndex` | number | 0 | Item open by default (0=none, 1=first, etc.) |
| `iconPosition` | string | 'right' | Position of expand icon: 'left' or 'right' |
| `animationDuration` | number | 0.3 | Animation speed in seconds (0.1-2) |
| `children` | slot | - | Collection List with FAQ items |

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
  animationDuration={0.3}
  iconPosition="right"
>
  {/* Collection List goes here */}
</FAQ>
```

## Styling Approach

**CSS Variables (Inherited)** - Style the component using Webflow's Variables panel:

- `--faq-toggle-border-color`
- `--faq-toggle-hover-color`
- `--faq-item-gap`
- `--faq-question-color`
- `--faq-question-font-size`
- `--faq-question-font-family`
- `--faq-question-padding`
- `--faq-answer-color`
- `--faq-answer-font-size`
- `--faq-answer-font-family`
- `--faq-answer-padding`
- `--faq-border-radius`

## Technical Notes

- Shadow DOM slot extraction for Collection List content
- Multi-strategy content extraction with retry delays
- SSR disabled (requires DOM access)
- Keyboard accessible (Space/Enter to toggle)
