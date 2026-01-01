"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import { siteConfig } from "@/config/site.config";
import { GlassPanel, TypedText } from "@/components";

interface ContactSectionProps {
    scrollYProgress: MotionValue<number>;
}

const CONTACT_EMAIL = siteConfig.contact.email;

export function ContactSection({ scrollYProgress }: ContactSectionProps) {
    // Range: 0.75 - 0.98
    const opacity = useTransform(scrollYProgress, [0.75, 0.78, 0.95, 0.98], [0, 1, 1, 0.8]);
    const scale = useTransform(scrollYProgress, [0.75, 0.78, 0.95], [0.9, 1, 1]);
    const rotateX = useTransform(scrollYProgress, [0.75, 0.78, 0.95], [-10, 0, 0]);
    const y = useTransform(scrollYProgress, [0.75, 0.78], [40, 0]);
    const pointerEvents = useTransform(scrollYProgress, (v) => (v >= 0.75 && v <= 0.98 ? "auto" : "none"));

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
                <div style={{ textAlign: "center" }}>
                    <p className="contact-header">Contact</p>
                    <p className="text-body">
                        You may contact me at{" "}
                        <a href={`mailto:${CONTACT_EMAIL}`} className="contact-email">
                            <TypedText
                                text={CONTACT_EMAIL}
                                scrollProgress={scrollYProgress}
                                startProgress={0.80}
                                endProgress={0.88}
                                showCursor={false}
                            />
                        </a>
                    </p>
                </div>
            </GlassPanel>
        </motion.div>
    );
}
