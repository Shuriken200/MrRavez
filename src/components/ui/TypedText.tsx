"use client";

import { useTransform, MotionValue, motion } from "framer-motion";
import { useMemo } from "react";

type TypedTextProps = {
    text: string;
    scrollProgress: MotionValue<number>;
    startProgress: number;
    endProgress: number;
    showCursor?: boolean;
    className?: string;
};

/**
 * Scroll-driven typing animation.
 * Text reveals character-by-character based on scroll position.
 */
export function TypedText({
    text,
    scrollProgress,
    startProgress,
    endProgress,
    showCursor = true,
    className = "",
}: TypedTextProps) {
    // Map scroll progress to character count
    const charCount = useTransform(
        scrollProgress,
        [startProgress, endProgress],
        [0, text.length]
    );

    // Create an array of character components with individual opacity transforms
    const characters = useMemo(() => {
        return text.split("").map((char, index) => ({
            char: char === " " ? "\u00A0" : char, // Non-breaking space for spaces
            index,
        }));
    }, [text]);

    return (
        <span className={className}>
            {characters.map(({ char, index }) => (
                <TypedCharacter
                    key={index}
                    char={char}
                    index={index}
                    charCount={charCount}
                />
            ))}
            {showCursor && (
                <motion.span
                    className="typing-cursor"
                    style={{
                        opacity: useTransform(
                            scrollProgress,
                            [startProgress - 0.01, startProgress, endProgress, endProgress + 0.01],
                            [0, 1, 1, 0]
                        )
                    }}
                />
            )}
        </span>
    );
}

type TypedCharacterProps = {
    char: string;
    index: number;
    charCount: MotionValue<number>;
};

function TypedCharacter({ char, index, charCount }: TypedCharacterProps) {
    const opacity = useTransform(charCount, (count) =>
        count > index ? 1 : 0
    );

    return (
        <motion.span style={{ opacity }}>
            {char}
        </motion.span>
    );
}
