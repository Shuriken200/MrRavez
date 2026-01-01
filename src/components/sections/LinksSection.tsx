"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import { siteConfig } from "@/config/site.config";
import { GlassPanel, TypedText, LinkIcon } from "@/components";

interface LinksSectionProps {
    scrollYProgress: MotionValue<number>;
}

const LINKS_INTRO = "Feel free to check out my other pages here:";

export function LinksSection({ scrollYProgress }: LinksSectionProps) {
    // Range: 0.50 - 0.73
    const opacity = useTransform(scrollYProgress, [0.50, 0.53, 0.70, 0.73], [0, 1, 1, 0]);
    const scale = useTransform(scrollYProgress, [0.50, 0.53, 0.70, 0.73], [0.9, 1, 1, 0.95]);
    const rotateX = useTransform(scrollYProgress, [0.50, 0.53, 0.70, 0.73], [-10, 0, 0, 10]);
    const y = useTransform(scrollYProgress, [0.50, 0.53, 0.70, 0.73], [40, 0, 0, -30]);
    const pointerEvents = useTransform(scrollYProgress, (v) => (v >= 0.50 && v <= 0.73 ? "auto" : "none"));

    // Links reveal (one by one)
    const linkOpacities = siteConfig.links.map((_, i) => {
        const start = 0.55 + i * 0.04;
        const end = start + 0.03;
        return useTransform(scrollYProgress, [start, end], [0, 1]);
    });

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
            <GlassPanel>
                <p className="text-body">
                    <TypedText
                        text={LINKS_INTRO}
                        scrollProgress={scrollYProgress}
                        startProgress={0.52}
                        endProgress={0.56}
                        showCursor={false}
                    />
                </p>

                <ul className="links-list">
                    {siteConfig.links.map((link, i) => (
                        <motion.li key={link.href} style={{ opacity: linkOpacities[i] }}>
                            <a
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="link-item"
                            >
                                <LinkIcon type={link.icon as "github" | "linkedin" | "uio"} className="link-icon" />
                                <span className="link-label">{link.label}</span>
                                <svg className="link-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </a>
                        </motion.li>
                    ))}
                </ul>
            </GlassPanel>
        </motion.div>
    );
}
