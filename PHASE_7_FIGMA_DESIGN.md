# Phase 7: Figma UI Design System & Specifications

## Overview
This document provides comprehensive UI/UX specifications for the SocialForge Creator application, based on professional Figma designs that rival Instagram and Tinder in visual quality.

## Design System

### Color Palette (Tailwind CSS)
- **Primary Blue**: #3B82F6 (Blue-500) - Main actions, headers, focus states
- **Secondary Blue**: #1E40AF (Blue-800) - Darker accents, hover states
- **Light Gray**: #F3F4F6 (Gray-100) - Sidebar, secondary backgrounds
- **Border Gray**: #E5E7EB (Gray-200) - Card borders, dividers
- **Text Dark**: #1F2937 (Gray-800) - Primary text
- **Text Light**: #6B7280 (Gray-500) - Secondary text
- **Success Green**: #10B981 (Emerald-500) - Success states
- **Warning Orange**: #F59E0B (Amber-500) - Warning/attention
- **Error Red**: #EF4444 (Red-500) - Error states
- **White**: #FFFFFF - Card backgrounds, modals

### Typography
- **Font Family**: Inter, system-ui
- **Header (H1)**: 32px, 700 weight, tracking-tight
- **Header (H2)**: 24px, 700 weight
- **Header (H3)**: 20px, 600 weight
- **Body Large**: 16px, 400 weight
- **Body Regular**: 14px, 400 weight
- **Label**: 12px, 500 weight, uppercase

### Spacing
- Base unit: 8px
- Margins: 8px, 16px, 24px, 32px, 48px
- Padding: 12px, 16px, 20px, 24px

## Screens & Components

### 1. Authentication Screens

#### 1.1 Sign In Screen
**Layout**: Centered form, 400px width
**Elements**:
- Logo/branding at top
- "Welcome Back" heading (H2, text-center)
- Email input field (full width, 48px height)
- Password input field (full width, 48px height)
- "Remember me" checkbox
- "Forgot password?" link
- Sign In button (primary blue, full width, 48px height)
- "Don't have an account? Sign Up" link
- Divider line with "OR"
- Google OAuth button

**States**: Default, focus, error, loading, disabled

#### 1.2 Sign Up Screen
**Layout**: Centered form, 400px width
**Elements**:
- "Create Account" heading
- Name input field
- Email input field
- Password input field (with strength indicator)
- Confirm password field
- "I agree to Terms" checkbox
- Sign Up button (primary blue)
- "Already have an account? Sign In" link
- Google OAuth button

#### 1.3 Password Reset Screen
**Layout**: Centered form, 400px width
**Step 1 (Email)**:
- "Reset Password" heading
- Email input
- Send Reset Link button

**Step 2 (Confirmation)**:
- Success message
- Resend link option

### 2. Dashboard Layout

**Header**:
- Height: 70px
- Background: #3B82F6 (blue-500)
- Logo text: "SocialForge Creator" (white, 20px, bold)
- Right side: User profile dropdown, notifications bell

**Sidebar**:
- Width: 256px
- Background: #F3F4F6 (light gray)
- Fixed, full height
- Navigation items with icons:
  1. Dashboard (home icon)
  2. Content Creator (pen icon)
  3. Analytics (chart icon)
  4. Niche Intelligence (lightbulb icon)
  5. Monetization (dollar icon)
  6. Settings (gear icon)

**Main Content Area**:
- Left margin: 256px (accounts for sidebar)
- Top margin: 70px (accounts for header)
- Padding: 32px
- Background: white or light gray

### 3. Dashboard Home Screen

**Grid Layout**: 2 columns for desktop

**Section 1: KPI Cards** (4 cards, 2x2 grid)
Each card:
- Width: 280px
- Height: 140px
- Background: white
- Border: 1px #E5E7EB
- Border radius: 8px
- Padding: 20px
- Box shadow: 0 1px 3px rgba(0,0,0,0.1)

Card contents:
1. Total Posts: "142" (large number), "Last 30 days" (label)
2. Engagement Rate: "8.4%" (large number), "↑ 2.3% from last month" (green, small)
3. Followers: "12.5K" (large number), "↑ 1,234 this month" (green)
4. Scheduled: "8 posts" (large number), "Next: Tomorrow 10 AM" (label)

**Section 2: Recent Activity** (full width, spanning columns)
- Title: "Recent Activity" (H3)
- Table with columns: Post, Platform, Date, Status, Engagement
- 5 rows of recent posts
- Pagination at bottom

**Section 3: Platform Status** (full width)
- 7 platform cards in a row (Instagram, TikTok, YouTube, Twitter, LinkedIn, Facebook, Pinterest)
- Each card shows: platform icon, connected status (green checkmark), last post time

### 4. Content Creator Module

**Layout**: Two-column layout

**Left Column (Form)** - 60% width:
- Content title input
- Content description textarea (large)
- Platform checkboxes (select multiple platforms)
- Content type dropdown (Image, Video, Carousel, Text)
- Scheduling options:
  - Immediate radio button
  - Schedule for later radio button (with date/time picker)
- Attach media button

**Right Column (Preview)** - 40% width:
- "Preview" heading
- Platform selector dropdown
- Live preview of content as it would appear on selected platform
- Character count indicator

**Bottom**:
- Cancel button
- Save as Draft button
- Submit for Approval button (primary blue)

### 5. Analytics Module

**Layout**: Tabbed interface

**Tabs**: Overview | Posts | Followers | Engagement

**Overview Tab**:
- Date range selector (dropdown)
- 4 KPI cards
- Line chart: Engagement over time
- Bar chart: Posts by platform
- Table: Top performing posts

**Posts Tab**:
- Sortable table with columns: Post, Platform, Date, Views, Likes, Comments, Shares
- Pagination
- Export to CSV button

### 6. Niche Intelligence Module

**Layout**: Grid of cards

**Search Bar**:
- Full width, centered
- Placeholder: "Search Reddit, Google Trends, YouTube..."
- Search button

**Results**:
- Card grid (3 columns)
- Each card:
  - Niche/keyword title
  - Source badge ("Reddit", "Google Trends", etc.)
  - Trend strength indicator (bar)
  - Description/insights
  - "Create Content" button

### 7. Monetization Module

**Layout**: Vertical layout with sections

**Section 1: Revenue Overview**
- Total earnings this month (large number)
- Earnings breakdown by source (pie chart or cards):
  - Affiliate Program
  - Sponsorships
  - Ad Revenue
  - Digital Products

**Section 2: Active Opportunities**
- Table of available monetization opportunities
- Columns: Opportunity, Type, Potential Earnings, Status

**Section 3: Payment Methods**
- List of connected payment methods
- Add new payment method button

### 8. Settings Module

**Layout**: Sidebar navigation with content area

**Settings Categories**:
1. Account Settings
   - Email
   - Password
   - Two-factor authentication

2. Platform Connections
   - List of connected platforms
   - Connect/disconnect buttons

3. Notification Preferences
   - Toggles for different notification types

4. API Keys
   - Display (masked) and regenerate API keys

5. Subscription & Billing
   - Current plan
   - Upgrade button
   - Billing history

## Component Library

### Buttons
- **Primary**: Blue-500 background, white text, 8px border-radius, 12px horizontal padding
- **Secondary**: Gray-200 background, gray-800 text
- **Danger**: Red-500 background, white text
- **States**: Default, hover (darker), active, disabled, loading

### Input Fields
- Height: 40px (normal), 48px (large)
- Border: 1px gray-200
- Border-radius: 6px
- Padding: 12px 16px
- Focus: blue-500 border, blue-50 background
- Error: red-500 border

### Cards
- Background: white
- Border: 1px gray-200 (optional)
- Border-radius: 8px
- Padding: 20px
- Box-shadow: 0 1px 3px rgba(0,0,0,0.1)

### Tables
- Header background: gray-50
- Row height: 44px
- Hover row background: gray-100
- Alternating row colors: white, gray-50

### Modals
- Overlay: rgba(0,0,0,0.5)
- Modal width: 500px (or 90vw on mobile)
- Border-radius: 12px
- Padding: 24px
- Close button: top-right corner

## Responsive Design

### Breakpoints
- Mobile: < 640px (single column, full-width sidebar overlay)
- Tablet: 640px - 1024px (adjusted spacing and grid)
- Desktop: > 1024px (full layout as specified)

### Mobile Adaptations
- Sidebar becomes a hamburger menu
- KPI cards stack vertically
- Tables become card-based lists
- Charts adjust to fit container

## Interactive States

### Hover States
- Buttons: darker shade, shadow increase
- Cards: shadow increase, slight scale
- Links: underline, color change

### Focus States
- Input fields: blue border, blue-50 background
- Buttons: outline with blue
- Tab navigation: visible focus ring

### Loading States
- Spinners: 24px, blue-500
- Skeleton screens for data loading
- Disabled state with reduced opacity

## Accessibility

- Minimum contrast ratio: 4.5:1
- Focus visible on all interactive elements
- ARIA labels on buttons and icons
- Keyboard navigation supported
- Screen reader friendly

## Animation Guidelines

- Transition duration: 200-300ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1) (default)
- No animations for preference:reduced-motion

## Implementation Notes

- All colors use Tailwind CSS classes where possible
- Use CSS Grid for layouts instead of flexbox where appropriate
- Implement dark mode support using CSS variables
- Use shadcn/ui components as base where applicable
- Ensure all interactive elements meet WCAG 2.1 AA standards

## Figma File Reference

**File**: SocialForge Creator
**URL**: https://www.figma.com/design/OUwoAo6bTJfwoW7aEhVFkU
**Last Updated**: Phase 7
**Status**: Design specifications complete, ready for component implementation
