"use client";

import { motion, type MotionProps } from "framer-motion";
import type { ReactNode, CSSProperties } from "react";

type GlassCardProps = {
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
} & MotionProps;

export function GlassCard({
    children,
    className = "",
    style,
    ...motionProps
}: GlassCardProps) {
    return (
        <motion.div
            className={`glass-card ${className}`}
            style={style}
            {...motionProps}
        >
            {/* Refraction layer */}
            <div className="glass-refraction" aria-hidden="true" />

            {/* Highlight edge */}
            <div className="glass-highlight" aria-hidden="true" />

            {/* Content */}
            <div className="glass-content">
                {children}
            </div>
        </motion.div>
    );
}
