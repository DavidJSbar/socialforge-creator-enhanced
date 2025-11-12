# Figma Design System for SocialForge Creator

## Figma Setup Instructions

### 1. Create Figma Project
1. Go to https://figma.com
2. Sign in with your account
3. Click "New file"
4. Name it: "SocialForge Creator Design System"
5. Save to a team or workspace for sharing

## 2. Design System Structure

Create the following pages in your Figma file:

### Pages to Create:
1. **Design Tokens** - Colors, typography, spacing
2. **Components** - Reusable UI elements
3. **Screens** - Full page designs
4. **Dashboard** - Main interface
5. **Auth Pages** - Login, signup, OAuth
6. **Modal/Popups** - Content approval dialogs
7. **Prototypes** - Interactive flows

## 3. Design Tokens

### Color Palette
```
Primary: #3B82F6 (Blue)
Success: #10B981 (Green) 
Warning: #F59E0B (Amber)
Danger: #EF4444 (Red)
Neutral: #F3F4F6 to #1F2937 (Grays)
```

### Typography
```
Heading 1: 32px, Bold
Heading 2: 24px, SemiBold
Heading 3: 18px, SemiBold
Body: 16px, Regular
Small: 14px, Regular
Caption: 12px, Regular
```

### Spacing Scale
```
4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px
```

## 4. Core Components

Create these component sets in Figma:

### Buttons
- Primary Button
- Secondary Button
- Danger Button
- Button Sizes: Small, Medium, Large
- States: Default, Hover, Disabled, Loading

### Form Inputs
- Text Input
- Email Input
- Password Input
- Textarea
- Select Dropdown
- Checkbox
- Radio Button
- States: Default, Focused, Error, Disabled

### Cards
- Basic Card
- Content Card (title + body + action)
- Stat Card (for KPIs)
- Analytics Card (with charts)

### Navigation
- Top Navigation Bar
- Sidebar Navigation
- Tabs Component
- Breadcrumbs

### Data Display
- Table Component (header + rows)
- List Item
- Badge
- Tag
- Avatar

### Feedback
- Alert (4 types: info, success, warning, error)
- Toast Notification
- Loading Skeleton
- Empty State

### Modals
- Confirmation Modal
- Content Approval Modal
- Settings Modal

## 5. Screen Designs

### Authentication Screens
1. **Sign In**
   - Email input
   - Password input
   - "Forgot password?" link
   - Sign in button
   - "Sign up" link
   - Google OAuth button

2. **Sign Up**
   - Full name input
   - Email input
   - Password input
   - Confirm password input
   - Terms checkbox
   - Sign up button
   - Already have account link

3. **Forgot Password**
   - Email input
   - Send reset email button

### Dashboard Screens
1. **Main Dashboard**
   - KPI Cards (4 columns)
   - Top Niches Widget
   - Quick Actions Panel
   - Recent Activity

2. **Niche Explorer**
   - Search bar
   - Trending niches list
   - Niche detail view
   - Content gap opportunities

3. **Content Lab**
   - Generation form
   - Platform selector (7 platforms)
   - Tone/style selector
   - Content preview
   - Edit interface
   - Generate button

4. **Review Queue**
   - Pending items table
   - Content preview modal
   - Approval/rejection buttons
   - Feedback input

5. **Analytics**
   - Performance dashboard
   - Time period selector
   - Engagement charts
   - Audience demographics
   - Top content table

6. **Monetization**
   - Active income streams list
   - Available opportunities
   - Income breakdown chart
   - Projected income

## 6. Color Specifications (Tailwind Mapping)

```
Figma: #3B82F6  → Tailwind: blue-500  (Primary)
Figma: #10B981  → Tailwind: emerald-500  (Success)
Figma: #F59E0B  → Tailwind: amber-500  (Warning)
Figma: #EF4444  → Tailwind: red-500  (Danger)
Figma: #F3F4F6  → Tailwind: gray-100  (Light Gray)
Figma: #111827  → Tailwind: gray-900  (Dark Gray)
```

## 7. Spacing System (Aligns with Tailwind)

```
0.5 = 2px    → p-0.5
1 = 4px      → p-1
2 = 8px      → p-2
3 = 12px     → p-3
4 = 16px     → p-4
5 = 20px     → p-5
6 = 24px     → p-6
8 = 32px     → p-8
```

## 8. Export for Development

### Export Settings
1. Go to File > Export
2. Export components as SVG (for icons)
3. Use Figma API to generate CSS variables
4. Document all component specs

### Generate Design Tokens CSS
```css
:root {
  /* Colors */
  --color-primary: #3B82F6;
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-danger: #EF4444;
  
  /* Typography */
  --font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
  --font-size-h1: 32px;
  --font-size-h2: 24px;
  --font-size-body: 16px;
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
}
```

## 9. Figma to Code Workflow

### Using Figma Plugins:
1. Install "Token Studio" plugin
2. Export design tokens to JSON
3. Import into Next.js as CSS variables
4. Reference in Tailwind config

### Component Handoff:
1. Mark all components with "Dev" label
2. Document component props in description
3. Export specs with Export > Generate code
4. Share link with development team

## 10. Design System Principles

- **Consistency**: All components follow the design system
- **Accessibility**: WCAG AA compliance for colors and contrast
- **Responsiveness**: Components work on mobile (320px), tablet (768px), desktop (1024px+)
- **Performance**: Optimized SVGs and minimal animations
- **Brand Alignment**: Professional, trustworthy aesthetic

## 11. Collaboration in Figma

1. Share file with team members
2. Set permissions: Viewer, Editor, Owner
3. Use comments for feedback
4. Create versions for releases
5. Use Figma Inspect for developer specs

## 12. Handoff to Development

### For Each Component:
1. Create a dedicated artboard
2. Label with component name
3. Add specifications panel with:
   - Dimensions
   - Padding/margins
   - Font sizes and weights
   - Colors (with hex codes)
   - States (hover, active, disabled)
4. Export as PNG for design specs
5. Export icons as SVG

## 13. Sync with Codebase

### Tailwind Configuration
Update `tailwind.config.js` based on Figma tokens:
```js
theme: {
  colors: {
    primary: '#3B82F6',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
  },
  spacing: {
    '1': '4px',
    '2': '8px',
    '3': '12px',
    '4': '16px',
    // ... etc
  },
}
```

## 14. Prototype in Figma

1. Create prototype flows:
   - Sign up → Dashboard
   - Generate content → Review → Approve
   - View analytics
2. Set up interactions:
   - Click buttons to navigate
   - Show/hide modals
   - Auto-play animations
3. Share prototype link with stakeholders

