"use client";

import { forwardRef } from "react";
import { MotionValue } from "framer-motion";
import { siteConfig } from "@/config/site.config";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { TypedText } from "@/components/ui/TypedText";

interface ContactCardProps {
    scrollYProgress: MotionValue<number>;
    rotateX?: MotionValue<number>;
}

const CONTACT_EMAIL = siteConfig.contact.email;

export const ContactCard = forwardRef<HTMLDivElement, ContactCardProps>(
    ({ scrollYProgress, rotateX }, ref) => {
        return (
            <GlassPanel ref={ref} rotateX={rotateX}>
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
        );
    }
);

ContactCard.displayName = "ContactCard";
