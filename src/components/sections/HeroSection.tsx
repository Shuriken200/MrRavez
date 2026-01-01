"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

interface HeroSectionProps {
    scrollYProgress: MotionValue<number>;
}

export function HeroSection({ scrollYProgress }: HeroSectionProps) {
    // Range: 0.03 - 0.15
    const opacity = useTransform(scrollYProgress, [0.03, 0.06, 0.12, 0.15], [0, 1, 1, 0]);
    const scale = useTransform(scrollYProgress, [0.03, 0.06, 0.12, 0.15], [0.9, 1, 1, 0.95]);
    const rotateX = useTransform(scrollYProgress, [0.03, 0.06, 0.12, 0.15], [-10, 0, 0, 10]);
    const y = useTransform(scrollYProgress, [0.03, 0.06, 0.12, 0.15], [40, 0, 0, -30]);
    const pointerEvents = useTransform(scrollYProgress, (v) => (v >= 0.03 && v <= 0.15 ? "auto" : "none"));

    return (
        <motion.div
            className="section-wrapper"
            style={{
                opacity,
                scale,
                rotateX,
                y,
                pointerEvents,
            }}
        >
            <span className="text-hero">Hi!</span>
        </motion.div>
    );
}
