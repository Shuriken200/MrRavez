"use client";

import { useEffect, useState, useRef, useCallback } from "react";

interface DeviceOrientationDelta {
    rotateX: number;  // degrees, for card tilt (front-back)
    rotateY: number;  // degrees, for card tilt (left-right)
    isAvailable: boolean;
}

const MAX_TILT = 3;  // Same as desktop mouse tilt
const SMOOTHING_FACTOR = 0.15;  // Same as desktop

function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

export function useDeviceOrientationDelta(): DeviceOrientationDelta {
    const [rotation, setRotation] = useState({ rotateX: 0, rotateY: 0 });
    const [isAvailable, setIsAvailable] = useState(false);
    
    // Store baseline orientation (first reading becomes neutral)
    const baselineRef = useRef<{ beta: number; gamma: number } | null>(null);
    // Store current smoothed values for interpolation
    const smoothedRef = useRef({ rotateX: 0, rotateY: 0 });
    // Track if we've set up the listener
    const listenerSetupRef = useRef(false);

    const handleOrientation = useCallback((e: DeviceOrientationEvent) => {
        if (e.beta === null || e.gamma === null) return;
        
        // Set baseline on first reading
        if (baselineRef.current === null) {
            baselineRef.current = { beta: e.beta, gamma: e.gamma };
            return;  // Skip first frame to avoid jump
        }
        
        // Calculate delta from baseline
        const deltaBeta = e.beta - baselineRef.current.beta;   // front-back tilt
        const deltaGamma = e.gamma - baselineRef.current.gamma; // left-right tilt
        
        // Invert and scale to degrees (card "stays in place" by tilting opposite)
        // Map device tilt range to max card tilt
        // Typical comfortable tilt range is about ±30 degrees
        const tiltRange = 30;
        const targetRotateX = clamp((deltaBeta / tiltRange) * MAX_TILT, -MAX_TILT, MAX_TILT);
        const targetRotateY = clamp((-deltaGamma / tiltRange) * MAX_TILT, -MAX_TILT, MAX_TILT);
        
        // Apply smoothing
        smoothedRef.current.rotateX += (targetRotateX - smoothedRef.current.rotateX) * SMOOTHING_FACTOR;
        smoothedRef.current.rotateY += (targetRotateY - smoothedRef.current.rotateY) * SMOOTHING_FACTOR;
        
        setRotation({
            rotateX: smoothedRef.current.rotateX,
            rotateY: smoothedRef.current.rotateY,
        });
    }, []);

    useEffect(() => {
        if (listenerSetupRef.current) return;
        
        const requestPermission = async () => {
            // iOS 13+ requires permission for DeviceOrientationEvent
            const DOE = DeviceOrientationEvent as unknown as {
                new(): DeviceOrientationEvent;
                requestPermission?: () => Promise<'granted' | 'denied'>;
            };
            
            if (typeof DeviceOrientationEvent !== 'undefined' && DOE.requestPermission) {
                try {
                    const permission = await DOE.requestPermission();
                    if (permission === 'granted') {
                        setIsAvailable(true);
                        window.addEventListener('deviceorientation', handleOrientation);
                        listenerSetupRef.current = true;
                    }
                } catch {
                    // Permission denied or error
                }
            } else if (typeof DeviceOrientationEvent !== 'undefined') {
                // Non-iOS devices don't need permission
                setIsAvailable(true);
                window.addEventListener('deviceorientation', handleOrientation);
                listenerSetupRef.current = true;
            }
        };
        
        const handleFirstTouch = () => {
            requestPermission();
            window.removeEventListener('touchstart', handleFirstTouch);
        };
        
        // Try immediately (works on Android)
        requestPermission();
        // Also try on first touch (needed for iOS)
        window.addEventListener('touchstart', handleFirstTouch);
        
        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
            window.removeEventListener('touchstart', handleFirstTouch);
            listenerSetupRef.current = false;
        };
    }, [handleOrientation]);
    
    return { 
        rotateX: rotation.rotateX, 
        rotateY: rotation.rotateY, 
        isAvailable 
    };
}

