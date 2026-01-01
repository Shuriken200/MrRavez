"use client";

import { useRef, ReactNode, useState, useEffect } from "react";

interface LiveGlassCardProps {
    children?: ReactNode;
    className?: string;
    style?: React.CSSProperties;
    borderRadius?: number;
    padding?: string | number;
    opacity?: number;
}

export function LiveGlassCard({
    children,
    className,
    style,
    borderRadius = 60,
    padding = 40,
    opacity = 1,
}: LiveGlassCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [transform, setTransform] = useState("rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const card = cardRef.current;
        if (!card) return;

        let currentRotateX = 0;
        let currentRotateY = 0;
        const smoothingFactor = 0.15;
        let animationId: number | null = null;

        const handleMouseMove = (e: MouseEvent) => {
            if (!isHovering) return;

            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;

            const maxTilt = 3;
            const targetRotateX = (mouseY / (rect.height / 2)) * -maxTilt;
            const targetRotateY = (mouseX / (rect.width / 2)) * maxTilt;

            currentRotateX += (targetRotateX - currentRotateX) * smoothingFactor;
            currentRotateY += (targetRotateY - currentRotateY) * smoothingFactor;

            setTransform(`rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg) scale3d(1.01, 1.01, 1.01)`);
        };

        const handleMouseEnter = () => {
            setIsHovering(true);
        };

        const handleMouseLeave = () => {
            setIsHovering(false);
            currentRotateX = 0;
            currentRotateY = 0;
            setTransform("rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
        };

        card.addEventListener("mousemove", handleMouseMove);
        card.addEventListener("mouseenter", handleMouseEnter);
        card.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            card.removeEventListener("mousemove", handleMouseMove);
            card.removeEventListener("mouseenter", handleMouseEnter);
            card.removeEventListener("mouseleave", handleMouseLeave);
            if (animationId) cancelAnimationFrame(animationId);
        };
    }, [isHovering]);

    const paddingValue = typeof padding === "number" ? `${padding}px` : padding;

    // Only render when opacity is above threshold
    const isVisible = opacity > 0.01;

    return (
        <div
            ref={cardRef}
            className={className}
            style={{
                position: "relative",
                perspective: "1200px",
                transformStyle: "preserve-3d",
                willChange: "transform, opacity",
                opacity: isVisible ? opacity : 0,
                visibility: isVisible ? "visible" : "hidden",
                pointerEvents: isVisible ? "auto" : "none",
                transition: "opacity 0.4s ease-out",
                ...style,
            }}
        >
            {/* Glass container with 3D tilt */}
            <div
                style={{
                    position: "relative",
                    borderRadius,
                    transform,
                    transition: isHovering
                        ? "transform 0.05s ease-out"
                        : "transform 0.5s ease-out",
                    transformStyle: "preserve-3d",
                }}
            >
                {/* Glass background with backdrop-filter */}
                <div
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
                    }}
                />

                {/* Top edge highlight */}
                <div
                    style={{
                        position: "absolute",
                        top: 1,
                        left: "8%",
                        right: "8%",
                        height: 1,
                        background: "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.5) 20%, rgba(255, 255, 255, 0.6) 50%, rgba(255, 255, 255, 0.5) 80%, transparent 100%)",
                        borderRadius: borderRadius / 2,
                        zIndex: 2,
                        pointerEvents: "none",
                    }}
                />

                {/* Content layer */}
                <div
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

