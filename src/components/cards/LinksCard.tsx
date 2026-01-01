"use client";

import { forwardRef } from "react";
import { motion, MotionValue, useTransform } from "framer-motion";
import { siteConfig } from "@/config/site.config";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { TypedText } from "@/components/ui/TypedText";
import { LinkIcon } from "@/components/ui/LinkIcon";

interface LinksCardProps {
    scrollYProgress: MotionValue<number>;
    rotateX?: MotionValue<number>;
}

const LINKS_INTRO = "Feel free to check out my other pages here:";

export const LinksCard = forwardRef<HTMLDivElement, LinksCardProps>(
    ({ scrollYProgress, rotateX }, ref) => {
        const linkOpacities = siteConfig.links.map((_, i) => {
            const start = 0.55 + i * 0.04;
            const end = start + 0.03;
            return useTransform(scrollYProgress, [start, end], [0, 1]);
        });

        return (
            <GlassPanel ref={ref} rotateX={rotateX}>
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
        );
    }
);

LinksCard.displayName = "LinksCard";
