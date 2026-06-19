/**
 * Types and interfaces for the atmospheric effects simulator.
 */

export type EffectType = 'none' | 'snowflakes' | 'balloons';

export interface Particle {
  id: string;
  x: number;       // Horizontal starting point in vw (viewport width)
  size: number;    // Render size
  delay: number;   // Staggered trigger animation delay in seconds
  duration: number;// Duration of transition in seconds
  sway: number;    // Horizontal sway amplitude in vw units
  opacity: number; // Render opacity
  rotate: number;  // Seed rotation angle or drift coefficient
  color?: string;  // Color code (specific to balloons)
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  effect: 'Snowflakes' | 'Balloons';
  duration: string;
}
