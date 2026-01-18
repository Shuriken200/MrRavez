"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useDebugSafe } from "@/components/debug/DebugContext";
import { useMobileViewport } from "@/hooks";
import {
	useInteraction3D,
	useSpringAnimation,
	useDragInteraction,
	useDelayedVisibility,
} from "./hooks";

// Debug mode storage key
const DEBUG_MODE_KEY = 'debug-mode-enabled';

interface GlassSliderProps {
	visible: boolean;
	opacity?: number; // 0-1 for fade in/out
	onSlideComplete?: (side: 'left' | 'right') => void;
}

/**
 * GlassSlider - A glassmorphic slider component for toggling debug mode
 * 
 * Refactored to follow SOLID principles:
 * - useSpringAnimation: Spring physics for snap animation
 * - useDragInteraction: Mouse/touch drag handling
 * - useDelayedVisibility: First-time delay and fade logic
 * - useInteraction3D: Hover state for handle
 */
export function GlassSlider({ opacity = 1, onSlideComplete }: GlassSliderProps) {
	const debugContext = useDebugSafe();
	const trackRef = useRef<HTMLDivElement>(null);
	const isMobile = useMobileViewport(768);

	// Debug mode state
	const [isDebugMode, setIsDebugMode] = useState(false);
	const [debugModeWasActiveThisSession, setDebugModeWasActiveThisSession] = useState(false);

	// Use unified interaction hook for handle hover state
	const { isActive: isHovering, interactionProps: handleInteractionProps } = useInteraction3D({
		trigger: 'hover',
	});

	// Handle debug mode changes
	const handleDebugModeChange = useCallback((newDebugMode: boolean) => {
		if (newDebugMode !== isDebugMode) {
			setIsDebugMode(newDebugMode);
			localStorage.setItem(DEBUG_MODE_KEY, String(newDebugMode));

			// Update debug context if available
			if (debugContext) {
				debugContext.setEnabled(newDebugMode);
			}

			// Mark that debug mode was active this session
			if (newDebugMode) {
				setDebugModeWasActiveThisSession(true);
			}

			// Dispatch custom event to notify OrbField
			window.dispatchEvent(new CustomEvent('debugModeChanged', {
				detail: { enabled: newDebugMode }
			}));
		}
	}, [isDebugMode, debugContext]);

	// Spring animation for smooth snap
	const { position, setPosition, setVelocity, snapTo, cancelAnimation } = useSpringAnimation({
		onSettle: (target) => {
			const newDebugMode = target > 0.5;
			handleDebugModeChange(newDebugMode);
			onSlideComplete?.(target < 0.5 ? 'left' : 'right');
		},
	});

	// Drag interaction for mouse/touch
	const { isDragging, handleProps } = useDragInteraction({
		trackRef,
		handleWidth: 64,
		trackPadding: 6,
		onDragStart: cancelAnimation,
		onDragMove: (pos) => {
			setVelocity((pos - position) * 60);
			setPosition(pos);
		},
		onDragEnd: (pos) => {
			// Snap to nearest side, preferring left if close to center
			const target = pos > 0.55 ? 1 : 0;
			snapTo(target);
		},
	});

	// Delayed visibility for first-time appearance
	const skipDelay = isDebugMode || debugModeWasActiveThisSession;
	const { finalOpacity, hasAppeared } = useDelayedVisibility({
		opacity,
		initialDelayMs: 10000,
		skipDelay,
	});

	// Sync with debug context if available
	useEffect(() => {
		if (debugContext) {
			const enabled = debugContext.state.enabled;
			queueMicrotask(() => {
				setIsDebugMode(enabled);
				if (enabled) {
					setDebugModeWasActiveThisSession(true);
					setPosition(1);
				}
			});
		}
	}, [debugContext, setPosition]);

	// Initialize debug mode from localStorage on mount (as fallback)
	useEffect(() => {
		if (!debugContext) {
			const stored = localStorage.getItem(DEBUG_MODE_KEY);
			const debugEnabled = stored === 'true';
			queueMicrotask(() => {
				setIsDebugMode(debugEnabled);
				setPosition(debugEnabled ? 1 : 0);
				if (debugEnabled) {
					setDebugModeWasActiveThisSession(true);
				}
			});
		}
	}, [debugContext, setPosition]);

	// Calculate handle position - pill shape dimensions
	const handleWidth = 64;
	const handleHeight = 44;
	const padding = 6;
	const handleLeft = `calc(${padding}px + ${position} * (100% - ${handleWidth}px - ${padding * 2}px))`;

	// Arrow rotation based on position
	const arrowRotation = -(position * 180);

	// Keep slider visible if debug mode is currently on OR was ever active this session
	const keepVisible = isDebugMode || debugModeWasActiveThisSession;
	const computedOpacity = keepVisible ? 1 : finalOpacity;
	const computedVisibility = keepVisible ? "visible" : ((hasAppeared && opacity > 0.01) || opacity > 0.5 ? "visible" : "hidden");

	return (
		<div
			onTouchStart={(e) => e.stopPropagation()}
			onTouchMove={(e) => e.stopPropagation()}
			onTouchEnd={(e) => e.stopPropagation()}
			style={{
				position: "fixed",
				bottom: isMobile ? "72px" : "clamp(24px, 5vh, 40px)",
				left: "50%",
				transform: "translateX(-50%)",
				zIndex: 9999,
				opacity: computedOpacity,
				transition: "opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
				willChange: "opacity",
				pointerEvents: "auto",
				visibility: computedVisibility,
			}}
		>
			{/* Glass track container */}
			<div
				ref={trackRef}
				onTouchStart={(e) => e.stopPropagation()}
				onTouchMove={(e) => {
					e.preventDefault();
					e.stopPropagation();
				}}
				onTouchEnd={(e) => e.stopPropagation()}
				style={{
					position: "relative",
					width: "280px",
					height: "56px",
					borderRadius: "28px",
					background: "rgba(255, 255, 255, 0.08)",
					backdropFilter: "blur(24px) saturate(120%)",
					WebkitBackdropFilter: "blur(24px) saturate(120%)",
					border: "1px solid rgba(255, 255, 255, 0.15)",
					boxShadow: `
						0 25px 50px rgba(0, 0, 0, 0.25),
						0 10px 20px rgba(0, 0, 0, 0.15),
						inset 0 1px 0 rgba(255, 255, 255, 0.2),
						inset 0 -1px 0 rgba(0, 0, 0, 0.1)
					`,
					cursor: isDragging ? "grabbing" : "default",
					userSelect: "none",
					WebkitUserSelect: "none",
					touchAction: "none",
					perspective: "1200px",
					transformStyle: "preserve-3d",
				}}
			>
				{/* Top edge highlight */}
				<div
					style={{
						position: "absolute",
						top: 0,
						left: "8%",
						right: "8%",
						height: 1,
						background: "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.5) 20%, rgba(255, 255, 255, 0.6) 50%, rgba(255, 255, 255, 0.5) 80%, transparent 100%)",
						borderRadius: 14,
						pointerEvents: "none",
					}}
				/>

				{/* Draggable handle - pill shape */}
				<div
					{...handleProps}
					{...handleInteractionProps}
					style={{
						position: "absolute",
						top: "50%",
						left: handleLeft,
						transform: isDragging
							? "translateY(-50%) translateZ(50px) scale(1.05)"
							: "translateY(-50%) scale(1)",
						width: handleWidth,
						height: handleHeight,
						borderRadius: handleHeight / 2,
						background: isHovering || isDragging ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.04)",
						backdropFilter: "blur(12px)",
						WebkitBackdropFilter: "blur(12px)",
						border: isHovering || isDragging ? "1px solid rgba(255, 255, 255, 0.3)" : "1px solid rgba(255, 255, 255, 0.08)",
						boxShadow: isDragging
							? "0 12px 32px rgba(0, 0, 0, 0.25), 0 4px 12px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)"
							: "0 4px 12px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
						cursor: isDragging ? "grabbing" : "grab",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						transition: "transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
						willChange: "left, transform",
						transformStyle: "preserve-3d",
					}}
				>
					{/* Arrow icon */}
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke={isHovering || isDragging ? "var(--color-maroon, #4E0506)" : "var(--color-white, #ffffff)"}
						strokeWidth="2.5"
						strokeLinecap="round"
						strokeLinejoin="round"
						style={{
							transform: `rotate(${arrowRotation}deg)`,
							transition: isDragging
								? "none"
								: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.25s ease",
						}}
					>
						<path d="M9 18l6-6-6-6" />
					</svg>
				</div>
			</div>
		</div>
	);
}
