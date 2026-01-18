// Interaction hooks
export { useInteraction3D } from './useInteraction3D';
export type { UseInteraction3DOptions, UseInteraction3DResult } from './useInteraction3D';

// Card tilt hooks
export { useCardTilt } from './useCardTilt';
export type { UseCardTiltOptions, UseCardTiltResult } from './useCardTilt';

export { useMouseProximity } from './useMouseProximity';
export type { UseMouseProximityOptions, MouseProximityResult } from './useMouseProximity';

export { useTiltAnimation, calculateOrientationTilt } from './useTiltAnimation';
export type { UseTiltAnimationOptions, UseTiltAnimationResult, TiltTarget } from './useTiltAnimation';


// Animation hooks
export { useSpringAnimation, DEFAULT_SPRING_CONFIG } from './useSpringAnimation';
export type { UseSpringAnimationOptions, UseSpringAnimationResult, SpringConfig } from './useSpringAnimation';

export { useEntryExitAnimation, buildEntryExitTransform, easings } from './useEntryExitAnimation';
export type {
	UseEntryExitAnimationOptions,
	UseEntryExitAnimationResult,
	EntryAnimationConfig,
	ExitAnimationConfig,
} from './useEntryExitAnimation';

// Drag hooks
export { useDragInteraction } from './useDragInteraction';
export type { UseDragInteractionOptions, UseDragInteractionResult } from './useDragInteraction';

// Visibility hooks
export { useDelayedVisibility, useOpacityVisibility } from './useDelayedVisibility';
export type {
	UseDelayedVisibilityOptions,
	UseDelayedVisibilityResult,
	UseOpacityVisibilityOptions,
	UseOpacityVisibilityResult,
} from './useDelayedVisibility';
