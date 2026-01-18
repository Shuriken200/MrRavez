"use client";

import { useState, useEffect } from "react";

/**
 * Hook to detect if the current device is a touch device
 * 
 * Uses multiple signals to detect touch capability:
 * - CSS media query: (hover: none) - device has no hover capability
 * - CSS media query: (pointer: coarse) - device has coarse pointer (finger)
 * - Feature detection: 'ontouchstart' in window
 * 
 * Returns false initially (SSR-safe) and updates on mount to avoid hydration mismatch.
 * 
 * @returns boolean - true if device is touch-based, false otherwise
 */
export function useTouchDevice(): boolean {
	// Start with false for SSR compatibility
	const [isTouchDevice, setIsTouchDevice] = useState(false);

	useEffect(() => {
		// Check for touch device on mount to avoid SSR/hydration mismatch
		// Use queueMicrotask to avoid synchronous setState warning
		queueMicrotask(() => {
			const isTouch =
				window.matchMedia('(hover: none)').matches ||
				window.matchMedia('(pointer: coarse)').matches ||
				'ontouchstart' in window;
			setIsTouchDevice(isTouch);
		});
	}, []);

	return isTouchDevice;
}

/**
 * Hook to detect if the device supports hover interactions
 * 
 * @returns boolean - true if device supports hover, false otherwise
 */
export function useSupportsHover(): boolean {
	const [supportsHover, setSupportsHover] = useState(true);

	useEffect(() => {
		queueMicrotask(() => {
			setSupportsHover(window.matchMedia('(hover: hover)').matches);
		});
	}, []);

	return supportsHover;
}

/**
 * Hook to detect if the device is mobile based on viewport width
 * 
 * @param breakpoint - Width threshold in pixels (default: 768)
 * @returns boolean - true if viewport is narrower than breakpoint
 */
export function useMobileViewport(breakpoint: number = 768): boolean {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < breakpoint);
		};

		// Initial check
		checkMobile();

		// Listen for resize
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, [breakpoint]);

	return isMobile;
}
