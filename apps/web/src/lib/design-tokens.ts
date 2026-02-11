/**
 * Design Tokens - Single Source of Truth
 * 
 * Centralized design values for the Vision UI dark theme.
 * Use these constants for consistent styling across components.
 */

// ============================================================================
// COLORS
// ============================================================================

export const colors = {
  // Base theme colors
  background: '#0B1437',
  foreground: '#E2E8F0',
  
  // Card colors
  card: 'rgba(15, 21, 53, 0.7)',
  cardForeground: '#FFFFFF',
  
  // Interactive elements
  primary: '#0075FF',
  primaryForeground: '#FFFFFF',
  secondary: 'rgba(255, 255, 255, 0.1)',
  secondaryForeground: '#FFFFFF',
  
  // Status colors
  muted: '#1a1f37',
  mutedForeground: '#A0AEC0',
  accent: '#00E5FF',
  accentForeground: '#FFFFFF',
  destructive: '#E31A1A',
  destructiveForeground: '#FFFFFF',
  
  // Form elements
  border: 'rgba(255, 255, 255, 0.1)',
  input: 'rgba(255, 255, 255, 0.1)',
  ring: '#0075FF',
  
  // Vision UI brand colors
  vision: {
    blue: '#0075FF',
    cyan: '#00E5FF',
    green: '#01B574',
    purple: '#7928CA',
    pink: '#FF0080',
    orange: '#FFB547',
    navy: '#0B1437',
    navyLight: '#1a1f37',
  },
} as const

// ============================================================================
// GRADIENTS
// ============================================================================

export const gradients = {
  // Background gradients
  body: 'linear-gradient(135deg, #0B1437 0%, #1a1f37 100%)',
  glass: 'linear-gradient(127deg, rgba(6, 11, 40, 0.94) 0%, rgba(10, 14, 35, 0.69) 100%)',
  glassBorder: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
  
  // Text gradient
  text: 'linear-gradient(90deg, #0075FF 0%, #00E5FF 100%)',
  
  // Icon background gradients
  icon: {
    blue: 'linear-gradient(135deg, #0075FF 0%, #00A3FF 100%)',
    green: 'linear-gradient(135deg, #01B574 0%, #00D68F 100%)',
    orange: 'linear-gradient(135deg, #FFB547 0%, #FF8F00 100%)',
    purple: 'linear-gradient(135deg, #7928CA 0%, #A855F7 100%)',
    cyan: 'linear-gradient(135deg, #00E5FF 0%, #00B8D9 100%)',
  },
} as const

// ============================================================================
// SPACING
// ============================================================================

export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
} as const

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const borderRadius = {
  sm: '0.375rem',   // 6px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px - default
  xl: '1rem',       // 16px
  '2xl': '1.5rem',  // 24px
  full: '9999px',   // pill shape
} as const

// ============================================================================
// SHADOWS
// ============================================================================

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  
  // Glassmorphism shadows
  glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
  glow: '0 0 20px rgba(0, 117, 255, 0.3)',
} as const

// ============================================================================
// ANIMATION TIMINGS
// ============================================================================

export const animations = {
  // Duration
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  
  // Easing functions
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  // Common transition strings
  transition: {
    fast: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: 'all 500ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const

// ============================================================================
// BLUR VALUES
// ============================================================================

export const blur = {
  sm: '4px',
  md: '12px',
  lg: '16px',
  xl: '20px',  // glassmorphism default
  '2xl': '40px',
} as const

// ============================================================================
// Z-INDEX LAYERS
// ============================================================================

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const

// ============================================================================
// BREAKPOINTS (for reference - use Tailwind classes in practice)
// ============================================================================

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get a color with optional opacity
 * @example withOpacity(colors.primary, 0.5) => 'rgba(0, 117, 255, 0.5)'
 */
export function withOpacity(hexColor: string, opacity: number): string {
  // Convert hex to RGB
  const hex = hexColor.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

/**
 * Create a CSS custom property reference
 * @example cssVar('primary') => 'var(--primary)'
 */
export function cssVar(name: string): string {
  return `var(--${name})`
}

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type Color = keyof typeof colors | keyof typeof colors.vision
export type Spacing = keyof typeof spacing
export type BorderRadius = keyof typeof borderRadius
export type Shadow = keyof typeof shadows
export type AnimationDuration = keyof typeof animations.duration
export type AnimationEasing = keyof typeof animations.easing
export type Blur = keyof typeof blur
export type ZIndex = keyof typeof zIndex
export type Breakpoint = keyof typeof breakpoints
