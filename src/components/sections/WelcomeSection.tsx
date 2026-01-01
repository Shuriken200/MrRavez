"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import Image from "next/image";
import { siteConfig } from "@/config/site.config";
import { GlassPanel, TypedText } from "@/components";
import { useGitHubAvatar } from "@/hooks";

interface WelcomeSectionProps {
    scrollYProgress: MotionValue<number>;
}

const WELCOME_TEXT = "You just found my little corner of the internet.";
const NAME_TEXT = `I'm ${siteConfig.identity.name}`;

export function WelcomeSection({ scrollYProgress }: WelcomeSectionProps) {
    // Range: 0.14 - 0.48
    const opacity = useTransform(scrollYProgress, [0.14, 0.17, 0.44, 0.48], [0, 1, 1, 0]);
    const scale = useTransform(scrollYProgress, [0.14, 0.17, 0.44, 0.48], [0.9, 1, 1, 0.95]);
    const rotateX = useTransform(scrollYProgress, [0.14, 0.17, 0.44, 0.48], [-10, 0, 0, 10]);
    const y = useTransform(scrollYProgress, [0.14, 0.17, 0.44, 0.48], [40, 0, 0, -30]);
    const pointerEvents = useTransform(scrollYProgress, (v) => (v >= 0.14 && v <= 0.48 ? "auto" : "none"));

    // Internal animations
    const titleOpacity = useTransform(scrollYProgress, [0.17, 0.20], [0, 1]);
    const photoOpacity = useTransform(scrollYProgress, [0.35, 0.39], [0, 1]);
    const photoScale = useTransform(scrollYProgress, [0.35, 0.39], [0.8, 1]);

    // Data
    const { data: avatarUrl } = useGitHubAvatar(siteConfig.identity.githubUserId, 260);

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
        </motion.div>
    );
}
