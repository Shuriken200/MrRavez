"use client";

import { useRef, ReactNode, useId } from "react";
import { useDeviceOrientation, useTouchDevice } from "@/hooks";
import { useCardTilt, useEntryExitAnimation, useOpacityVisibility, buildEntryExitTransform } from "./hooks";
import styles from "./GlassCard.module.css";

interface GlassCardProps {
	children?: ReactNode;
	className?: string;
	style?: React.CSSProperties;
	borderRadius?: number;
	padding?: string | number;
	opacity?: number;
	/** Entry animation progress (0-1), controls scale and translateY */
	entryProgress?: number;
	/** Exit animation progress (0-1), controls scale and translateY for exit */
	exitProgress?: number;
	/** Mobile horizontal offset in vw units for swipe animation (legacy, used as fallback) */
	mobileOffset?: number;
	/** Mobile scale for carousel effect (0.85-1.0) */
	mobileScale?: number;
	/** Mobile-specific border radius (applied at max-width: 480px) */
	mobileBorderRadius?: number;
	/** Mobile-specific padding (applied at max-width: 480px) */
	mobilePadding?: string | number;
	/** 3D wheel rotation around Y axis (degrees) for mobile carousel */
	wheelRotateY?: number;
	/** 3D wheel horizontal translation (px) for mobile carousel */
	wheelTranslateX?: number;
	/** 3D wheel depth translation (px) for mobile carousel */
	wheelTranslateZ?: number;
	/** Optional aria-label for the card */
	ariaLabel?: string;
}

/**
 * GlassCard - A glassmorphic card component with 3D tilt effects
 * 
 * Refactored to follow SOLID principles:
 * - useTouchDevice: Shared touch device detection
 * - useCardTilt: 3D tilt based on mouse/device orientation
 * - useEntryExitAnimation: Entry/exit animation calculations
 * - useOpacityVisibility: Visibility management
 */
export function GlassCard({
	children,
	className,
	style,
	borderRadius = 60,
	padding = 40,
	opacity = 1,
	entryProgress = 1,
	exitProgress = 0,
	mobileOffset = 0,
	mobileScale = 1,
	mobileBorderRadius,
	mobilePadding,
	wheelRotateY = 0,
	wheelTranslateX = 0,
	wheelTranslateZ = 0,
	ariaLabel,
}: GlassCardProps) {
	const cardRef = useRef<HTMLDivElement>(null);
	const cardId = useId();

	// Device detection
	const isTouchDevice = useTouchDevice();
	const { tiltX, tiltY, hasPermission } = useDeviceOrientation();

	// 3D tilt effect
	const { transform, transitionStyle } = useCardTilt({
		cardRef,
		cardId,
		isTouchDevice,
		tiltX,
		tiltY,
		hasPermission,
	});

	// Entry/exit animation
	const animation = useEntryExitAnimation({
		entryProgress,
		exitProgress,
		additionalScale: mobileScale,
	});

	// Visibility management
	const { isVisible } = useOpacityVisibility({ opacity });

	// Padding values
	const paddingValue = typeof padding === "number" ? `${padding}px` : padding;
	const mobilePaddingValue = mobilePadding
		? (typeof mobilePadding === "number" ? `${mobilePadding}px` : mobilePadding)
		: paddingValue;

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { transform: _, ...styleWithoutTransform } = style || {};

	// Check if we have 3D wheel transforms (mobile mode)
	const hasWheelTransform = wheelRotateY !== 0 || wheelTranslateX !== 0 || wheelTranslateZ !== 0;

	// Build optimized 3D transform for GPU compositing
	let combinedTransform: string;

	if (hasWheelTransform) {
		// Mobile 3D wheel carousel transform
		combinedTransform = `
			translate3d(calc(-50% + ${wheelTranslateX}px), calc(-50% - 40px), ${wheelTranslateZ}px)
			rotateY(${wheelRotateY}deg)
			scale3d(${mobileScale}, ${mobileScale}, 1)
		`.replace(/\s+/g, ' ').trim();
	} else {
		// Desktop or legacy mobile: vertical scroll animations
		const verticalShift = isTouchDevice ? "- 40px" : "";
		combinedTransform = buildEntryExitTransform(animation, {
			horizontalOffset: mobileOffset,
			verticalShift,
			centered: true,
		});
	}

	// Check if mobile overrides are provided
	const hasMobileOverrides = mobileBorderRadius !== undefined || mobilePadding !== undefined;

	// Build CSS custom properties for mobile overrides
	const cssVars = hasMobileOverrides ? {
		'--glass-card-mobile-radius': `${mobileBorderRadius ?? borderRadius}px`,
		'--glass-card-mobile-padding': mobilePaddingValue,
	} as React.CSSProperties : {};

	return (
		<div
			ref={cardRef}
			data-glass-card-id={cardId}
			className={`${hasMobileOverrides ? styles.mobile : ''} ${className || ''}`.trim() || undefined}
			role="region"
			aria-roledescription="slide"
			aria-label={ariaLabel}
			inert={!isVisible ? true : undefined}
			style={{
				position: "relative",
				perspective: "1200px",
				transformStyle: "preserve-3d",
				willChange: "transform, opacity",
				backfaceVisibility: "hidden",
				WebkitBackfaceVisibility: "hidden",
				opacity: opacity,
				visibility: isVisible ? "visible" : "hidden",
				pointerEvents: opacity > 0.01 ? "auto" : "none",
				transform: combinedTransform,
				...cssVars,
				...styleWithoutTransform,
			}}
		>
			{/* Glass container with 3D tilt */}
			<div
				className="glass-card-container"
				style={{
					position: "relative",
					borderRadius,
					transform,
					transition: transitionStyle,
					transformStyle: "preserve-3d",
				}}
			>
				{/* Glass background with backdrop-filter */}
				<div
					className="glass-card-bg"
					aria-hidden="true"
					style={{
						position: "absolute",
						inset: 0,
						borderRadius,
						background: "rgba(255, 255, 255, 0.08)",
						backdropFilter: "blur(24px) saturate(120%)",
						WebkitBackdropFilter: "blur(24px) saturate(120%)",
						boxShadow: `
							0 25px 50px rgba(0, 0, 0, 0.25),
							0 10px 20px rgba(0, 0, 0, 0.15),
							inset 0 1px 0 rgba(255, 255, 255, 0.2),
							inset 0 -1px 0 rgba(0, 0, 0, 0.1)
						`,
						border: "1px solid rgba(255, 255, 255, 0.15)",
						zIndex: 0,
						pointerEvents: "none",
						overflow: "hidden",
					}}
				>
					{/* Top edge highlight */}
					<div
						aria-hidden="true"
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							height: 1,
							background: "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.5) 20%, rgba(255, 255, 255, 0.6) 50%, rgba(255, 255, 255, 0.5) 80%, transparent 100%)",
							zIndex: 2,
						}}
					/>
				</div>

				{/* Content layer */}
				<div
					className="glass-card-content"
					style={{
						position: "relative",
						zIndex: 1,
						padding: paddingValue,
						transform: "translateZ(10px)",
						transformStyle: "preserve-3d",
					}}
				>
					{children}
				</div>
			</div>
		</div>
	);
}
