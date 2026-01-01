"use client";

import { forwardRef, useRef, useEffect } from "react";
import { motion, MotionValue } from "framer-motion";
import { useRealGlass } from "@/components/providers/RealGlassProvider";

export type GlassPanelProps = {
    children: React.ReactNode;
    className?: string;
    rotateX?: MotionValue<number>;
    style?: any;
};

export const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(
    ({ children, className = "", rotateX, style }, ref) => {
        const { realGlass, isReady } = useRealGlass();
        const localRef = useRef<HTMLDivElement>(null);

        // Combine refs
        const setRefs = (element: HTMLDivElement | null) => {
            localRef.current = element;
            if (typeof ref === "function") ref(element);
            else if (ref) (ref as any).current = element;
        };

        useEffect(() => {
            let mounted = true;

            const applyGlass = async () => {
                if (!mounted || !localRef.current || !isReady || !realGlass) return;

                try {
                    await realGlass.apply(localRef.current, {
                        frosting: 0.1,                // Controls the blurriness of the background. 0 is clear, 1 is heavily blurred.
                        chromaticAberration: 50,   // The amount of color fringing, simulating lens dispersion.
                        glassOpacity: 0,            // The opacity of the glass layer itself (0 to 1).
                        lightStrength: 0.175,       // Intensity of the specular and edge lighting.
                        lightX: 0.7,                // Normalized position of the light source (0 to 1).
                        lightY: 0.3,                // Normalized position of the light source (0 to 1).
                        edgeSmoothness: 10,          // How soft the edges of the glass shape are.
                        ior: 1.51,                  // Index of Refraction. Controls how much light bends.
                        borderRadius: 50,           // The corner radius of the glass shape in pixels.
                        specularShininess: 82,      // Controls the size and intensity of the specular highlight.
                        thickness: 2,             // Simulates the thickness of the glass, affecting refraction.
                        tintColor: [0.95, 0.95, 1],       // Color to tint the glass. Can be a hex string or [r, g, b] array.
                        tintStrength: 0.5,            // The strength of the tint color (0 to 1).
                        useMask: false              // Set to true to use a custom mask instead of a rounded rectangle.
                    });
                } catch (e) {
                    console.error("RealGlass apply failed", e);
                }
            };

            applyGlass();

            return () => {
                mounted = false;
            };
        }, [isReady, realGlass]);

        return (
            <div
                ref={setRefs}
                className={`relative glass-panel-container ${className}`}
                style={{
                    // Ensure the container is invisible base for the 3D glass
                    background: "rgba(255, 255, 255, 0.05)", // Slight fallback tint
                    border: "none",
                    boxShadow: "none",
                    perspective: "1000px",
                    opacity: isReady ? 1 : 0, // Hide until ready to avoid capturing itself
                    transition: "opacity 0.5s ease-in-out",
                    ...style
                }}
            >
                {/* Content Layer - Rotated to match 3D glass tilt */}
                <motion.div
                    className="glass-content"
                    style={{ rotateX: rotateX || 0, transformStyle: "preserve-3d" }}
                >
                    {children}
                </motion.div>
            </div>
        );
    }
);

GlassPanel.displayName = "GlassPanel";
