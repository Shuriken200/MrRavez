"use client";

import { forwardRef } from "react";
import { motion, MotionValue, useTransform } from "framer-motion";
import Image from "next/image";
import { siteConfig } from "@/config/site.config";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { TypedText } from "@/components/ui/TypedText";
import { useGitHubAvatar } from "@/hooks";

interface WelcomeCardProps {
    scrollYProgress: MotionValue<number>;
    rotateX?: MotionValue<number>;
}

const WELCOME_TEXT = "You just found my little corner of the internet.";
const NAME_TEXT = `I'm ${siteConfig.identity.name}`;

export const WelcomeCard = forwardRef<HTMLDivElement, WelcomeCardProps>(
    ({ scrollYProgress, rotateX }, ref) => {
        // Internal animations relative to the card's visible window
        const titleOpacity = useTransform(scrollYProgress, [0.17, 0.20], [0, 1]);
        const photoOpacity = useTransform(scrollYProgress, [0.35, 0.39], [0, 1]);
        const photoScale = useTransform(scrollYProgress, [0.35, 0.39], [0.8, 1]);

        const { data: avatarUrl } = useGitHubAvatar(siteConfig.identity.githubUserId, 260);

        return (
            <GlassPanel ref={ref} rotateX={rotateX}>
                <div style={{ textAlign: "center" }}>
                    <motion.h2
                        className="text-title"
                        style={{ opacity: titleOpacity, marginBottom: 24 }}
                    >
                        Welcome
                    </motion.h2>

                    <p className="text-body" style={{ marginBottom: 16 }}>
                        <TypedText
                            text={WELCOME_TEXT}
                            scrollProgress={scrollYProgress}
                            startProgress={0.20}
                            endProgress={0.28}
                        />
                    </p>

                    <p className="text-body" style={{ marginBottom: 8 }}>
                        <TypedText
                            text={NAME_TEXT}
                            scrollProgress={scrollYProgress}
                            startProgress={0.28}
                            endProgress={0.38}
                            showCursor={false}
                        />
                    </p>

                    {avatarUrl && (
                        <motion.div
                            className="profile-photo-container"
                            style={{
                                opacity: photoOpacity,
                                scale: photoScale,
                                margin: "24px auto 0"
                            }}
                        >
                            <Image
                                src={avatarUrl}
                                alt={siteConfig.identity.name}
                                width={120}
                                height={120}
                                className="profile-photo"
                                unoptimized
                            />
                        </motion.div>
                    )}
                </div>
            </GlassPanel>
        );
    }
);

WelcomeCard.displayName = "WelcomeCard";
