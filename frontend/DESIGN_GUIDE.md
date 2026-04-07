# 🎨 Design System Guide

## Color Palette

### Primary Colors
```css
--primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
--accent-blue: #667eea
--accent-purple: #764ba2
--accent-cyan: #4fd1c5
```

### Background Colors
```css
--dark-bg: #0a0e27        /* Main background */
--dark-secondary: #1a1f3a  /* Secondary sections */
--dark-card: #242b4a       /* Card backgrounds */
--border-color: #2d3748    /* Borders */
```

### Text Colors
```css
--text-primary: #e2e8f0    /* Main text */
--text-secondary: #a0aec0  /* Secondary text */
--text-muted: #718096      /* Muted/less important text */
```

### Status Colors
```css
--success: #48bb78   /* Success messages */
--error: #f56565     /* Error messages */
--warning: #ed8936   /* Warning messages */
```

## Typography

### Font Stack
```css
font-family: 'Inter', 'Poppins', 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif;
```

### Font Sizes
- **Hero Title**: clamp(2.5rem, 5vw, 4rem)
- **Section Title**: 2.5rem
- **Page Title**: 2.5rem
- **Card Title**: 1.5rem
- **Body**: 1rem
- **Small**: 0.875rem

### Font Weights
- **Light**: 300
- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700
- **Extra Bold**: 800

## Spacing System

```css
--spacing-xs: 0.5rem   /* 8px */
--spacing-sm: 1rem     /* 16px */
--spacing-md: 1.5rem   /* 24px */
--spacing-lg: 2rem     /* 32px */
--spacing-xl: 3rem     /* 48px */
```

## Border Radius

```css
--radius-sm: 8px
--radius-md: 12px
--radius-lg: 16px
--radius-xl: 24px
```

## Shadows

```css
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.3)
--shadow-md: 0 4px 16px rgba(0, 0, 0, 0.4)
--shadow-lg: 0 10px 40px rgba(0, 0, 0, 0.5)
--shadow-xl: 0 20px 60px rgba(0, 0, 0, 0.6)
```

## Components

### Buttons

**Primary Button**
- Background: Primary gradient
- Color: White
- Shadow: Glowing blue
- Hover: Lift 3px + enhanced glow

**Secondary Button**
- Background: Dark card
- Border: 2px border color
- Color: Text primary
- Hover: Blue border

**Danger Button**
- Background: Red gradient
- Color: White
- Shadow: Glowing red
- Hover: Enhanced glow

### Cards

**Event Card**
- Background: Dark card
- Border: 1px border color
- Border radius: Large
- Padding: Large spacing
- Hover: Lift 8px + blue border + shadow
- Animation: Fade in from bottom

### Forms

**Input Fields**
- Background: Dark secondary
- Border: 2px border color
- Border radius: Medium
- Padding: 0.875rem 1rem
- Focus: Blue border + glow ring

**Text Areas**
- Min height: 120px
- Resize: Vertical only
- Same styling as inputs

### Messages/Toasts

**Success**
- Background: Green with 10% opacity
- Border: Green with 30% opacity
- Color: Green

**Error**
- Background: Red with 10% opacity
- Border: Red with 30% opacity
- Color: Red

**Warning**
- Background: Orange with 10% opacity
- Border: Orange with 30% opacity
- Color: Orange

## Animations

### Transitions
```css
--transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)
```

### Keyframes

**Fade In Up**
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**Slide In Down**
```css
@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**Spin (Loading)**
```css
@keyframes spin {
  to { 
    transform: rotate(360deg); 
  }
}
```

## Layout

### Container
- Max width: 1400px
- Padding: XL spacing top/bottom, Large left/right
- Centered with auto margins

### Grid
- Event cards: auto-fill, minmax(350px, 1fr)
- Gap: Large spacing

### Navbar
- Sticky positioning
- Backdrop blur (glassmorphism)
- Border bottom
- Shadow medium

## Responsive Breakpoints

```css
/* Desktop */
@media (max-width: 1200px) { }

/* Tablet */
@media (max-width: 768px) { }

/* Mobile */
@media (max-width: 480px) { }
```

## Best Practices

1. **Always use CSS variables** for colors, spacing, and shadows
2. **Maintain consistent spacing** using the spacing scale
3. **Use transitions** on all interactive elements
4. **Follow the shadow hierarchy** for depth
5. **Ensure proper contrast** for accessibility
6. **Test responsive layouts** at all breakpoints
7. **Use semantic HTML** for better SEO and accessibility

## Accessibility Features

- ✅ Proper color contrast ratios
- ✅ Focus states on interactive elements
- ✅ Semantic HTML structure
- ✅ Alt text for decorative elements (emojis used as icons)
- ✅ Keyboard navigation support
- ✅ Clear visual hierarchy

---

**This design system ensures consistency across all pages and components!**
