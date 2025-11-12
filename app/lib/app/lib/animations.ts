// Advanced Animation Utilities for Premium UI
export const animations = {
  // Spring animations (Tinder/IG style)
  spring: {
    tight: { type: 'spring', stiffness: 300, damping: 30 },
    smooth: { type: 'spring', stiffness: 200, damping: 25 },
    bounce: { type: 'spring', stiffness: 100, damping: 10 },
  },
  // Stagger animations
  stagger: {
    container: {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: { staggerChildren: 0.05, delayChildren: 0.2 },
      },
    },
    item: {
      hidden: { opacity: 0, y: 20 },
      show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200 } },
    },
  },
  // Card animations
  card: {
    hover: { y: -8, scale: 1.02 },
    tap: { scale: 0.98 },
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  // Fade in
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 },
  },
  // Slide up
  slideUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { type: 'spring', stiffness: 200, damping: 25 },
  },
  // Pulse
  pulse: {
    animate: { scale: [1, 1.05, 1] },
    transition: { duration: 2, repeat: Infinity },
  },
  // Drag
  drag: {
    initial: { opacity: 0.7 },
    whileDrag: { opacity: 1, scale: 1.05 },
    whileTap: { scale: 0.95 },
  },
};

export const timing = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
};

export const easing = {
  easeInOut: [0.42, 0, 0.58, 1],
  easeOut: [0, 0, 0.58, 1],
};