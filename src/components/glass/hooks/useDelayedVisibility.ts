"use client";

import { useState, useEffect, useRef } from "react";

export interface UseDelayedVisibilityOptions {
	/** Current opacity value (0-1) */
	opacity: number;
	/** Delay in milliseconds before first appearance (default: 10000ms) */
	initialDelayMs?: number;
	/** Skip the initial delay entirely */
	skipDelay?: boolean;
	/** Delay before fade-in transition starts after becoming visible (default: 50ms) */
	fadeInDelayMs?: number;
}

export interface UseDelayedVisibilityResult {
	/** Whether the element should be rendered as visible */
	isVisible: boolean;
	/** Whether the element has ever appeared (for persistent visibility) */
	hasAppeared: boolean;
	/** Whether this is the first time showing (delay not yet complete) */
	isFirstTime: boolean;
	/** Whether the initial delay has completed */
	canShow: boolean;
	/** Final opacity to use (accounts for appearance state) */
	finalOpacity: number;
	/** CSS visibility value */
	visibility: "visible" | "hidden";
}

/**
 * Hook for delayed visibility with fade-in behavior
 * Extracted from GlassSlider to follow Single Responsibility Principle
 * 
 * Handles:
 * - Initial appearance delay (e.g., 10 seconds for first-time users)
 * - Fade-in timing
 * - Persistent visibility tracking
 */
export function useDelayedVisibility(options: UseDelayedVisibilityOptions): UseDelayedVisibilityResult {
	const {
		opacity,
		initialDelayMs = 10000,
		skipDelay = false,
		fadeInDelayMs = 50,
	} = options;

	// Initialize state based on skipDelay to avoid setState in effect
	const [hasEverShown, setHasEverShown] = useState(() => skipDelay);
	const [canShowFirstTime, setCanShowFirstTime] = useState(() => skipDelay);
	const [hasAppeared, setHasAppeared] = useState(false);

	// Handle first-time delay (only when not skipping)
	useEffect(() => {
		// If skipDelay changes to true after mount, update state
		// This is handled via the initialDelayMs timer path
		if (skipDelay) {
			// Already initialized with skipDelay=true, nothing to do
			return;
		}

		if (opacity > 0.01 && !hasEverShown) {
			// First time seeing - wait for initial delay
			const delayTimer = setTimeout(() => {
				setCanShowFirstTime(true);
				setHasEverShown(true);
			}, initialDelayMs);

			return () => clearTimeout(delayTimer);
		}
	}, [opacity, hasEverShown, initialDelayMs, skipDelay]);

	// Handle visibility fade-in based on opacity
	useEffect(() => {
		const shouldShow = hasEverShown || canShowFirstTime;

		if (opacity > 0.01 && !hasAppeared && shouldShow) {
			// Small delay to ensure smooth fade-in
			const timer = setTimeout(
				() => setHasAppeared(true),
				skipDelay ? 0 : fadeInDelayMs
			);
			return () => clearTimeout(timer);
		}
		// Keep hasAppeared true even when fading out to allow smooth transition
	}, [opacity, hasAppeared, hasEverShown, canShowFirstTime, skipDelay, fadeInDelayMs]);

	// Calculate final visibility states
	const canShow = hasEverShown || canShowFirstTime;
	const isVisible = hasAppeared && opacity > 0.01;
	const finalOpacity = skipDelay ? 1 : (hasAppeared ? opacity : 0);
	const visibility = (hasAppeared && opacity > 0.01) || opacity > 0.5 ? "visible" : "hidden";

	return {
		isVisible,
		hasAppeared,
		isFirstTime: !hasEverShown,
		canShow,
		finalOpacity,
		visibility,
	};
}

/**
 * Simplified hook for basic opacity-based visibility
 * Used by GlassCard for visibility management
 */
export interface UseOpacityVisibilityOptions {
	opacity: number;
	/** Delay before hiding after opacity reaches 0 (default: 100ms) */
	hideDelayMs?: number;
}

export interface UseOpacityVisibilityResult {
	isVisible: boolean;
}

export function useOpacityVisibility(options: UseOpacityVisibilityOptions): UseOpacityVisibilityResult {
	const { opacity, hideDelayMs = 100 } = options;

	const [isVisible, setIsVisible] = useState(() => opacity > 0.01);
	const visibilityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		// Clear any pending timer
		if (visibilityTimerRef.current) {
			clearTimeout(visibilityTimerRef.current);
			visibilityTimerRef.current = null;
		}

		if (opacity > 0.01) {
			// Immediately show when opacity increases
			visibilityTimerRef.current = setTimeout(() => setIsVisible(true), 0);
		} else {
			// Brief delay to ensure smooth transition completion
			visibilityTimerRef.current = setTimeout(() => setIsVisible(false), hideDelayMs);
		}

		return () => {
			if (visibilityTimerRef.current) {
				clearTimeout(visibilityTimerRef.current);
			}
		};
	}, [opacity, hideDelayMs]);

	return { isVisible };
}
