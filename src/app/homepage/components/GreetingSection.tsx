"use client";

import type { GreetingVisibility, WelcomeVisibility } from "../types";

interface GreetingSectionProps {
    stage: number;
    greetingVisibility: GreetingVisibility;
    welcomeVisibility: WelcomeVisibility;
    theme: "light" | "dark";
}

/**
 * The "Hi!" greeting and welcome text that appear on initial load
 * They fade in/out sequentially as separate stages
 */
export function GreetingSection({ stage, greetingVisibility, welcomeVisibility, theme }: GreetingSectionProps) {
    // Don't render if neither is visible and we're past intro
    if (!greetingVisibility.visible && !welcomeVisibility.visible && stage >= 3) {
        return null;
    }

    // Calculate animation values based on stage
    // Stage 0: hidden and tiny
    // Stage 1: emerging - visible and growing
    // Stage 2+: popped - full size
    const isEmerging = stage >= 1;
    const isPopped = stage >= 2;

    // Inline styles for the greeting to avoid FOUC
    const greetingStyle: React.CSSProperties = {
        fontSize: 'clamp(5rem, 20vw, 14rem)',
        fontWeight: 700,
        letterSpacing: '-0.04em',
        margin: 0,
        position: 'relative',
        zIndex: 10,
        userSelect: 'none',
        WebkitUserSelect: 'none',
        pointerEvents: 'none',
        // Animation properties - start from 0!
        opacity: isEmerging ? 1 : 0,
        transform: isPopped ? 'scale(1)' : isEmerging ? 'scale(0.85)' : 'scale(0.01)',
        // Color: start black, slowly transition during emerging, burst to white/theme when popped
        color: isPopped 
            ? (theme === 'light' ? '#1a1a1a' : '#ffffff')
            : isEmerging 
                ? '#999999'  // Light gray during emerging - transitioning from black, bursts to white
                : '#000000',
        textShadow: isPopped
            ? '0 0 100px rgba(78, 5, 6, 0.8), 0 0 200px rgba(78, 5, 6, 0.4), 0 0 300px rgba(78, 5, 6, 0.2)'
            : isEmerging
                ? '0 0 60px rgba(78, 5, 6, 0.4), 0 0 120px rgba(78, 5, 6, 0.2)'
                : 'none',
        // Transition - different for popped vs emerging
        transition: isPopped
            ? 'color 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.8s ease, text-shadow 0.5s ease'
            : 'color 12s linear, transform 10s ease-out, opacity 2s ease-out, text-shadow 5s ease 3s',
    };

    return (
        <>
            <style jsx>{`
                .greeting-wrapper {
                    position: absolute;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    z-index: 10;
                }

                .welcome-text {
                    font-size: clamp(1.2rem, 3.5vw, 1.75rem);
                    font-weight: 400;
                    color: ${theme === "light" ? "#1a1a1a" : "#ffffff"};
                    user-select: none;
                    -webkit-user-select: none;
                    pointer-events: none;
                    text-align: center;
                    max-width: 90vw;
                    transition: opacity 0.4s ease-out;
                }
            `}</style>

            {/* "Hi!" greeting - uses inline styles to prevent FOUC */}
            {greetingVisibility.visible && (
                <div
                    className="greeting-wrapper"
                    style={{
                        opacity: stage >= 3 ? greetingVisibility.opacity : undefined,
                    }}
                >
                    <h1 style={greetingStyle}>
                        Hi!
                    </h1>
                </div>
            )}

            {/* "Welcome..." text - separate visibility control */}
            {welcomeVisibility.visible && stage >= 2 && (
                <div
                    className="greeting-wrapper"
                    style={{
                        opacity: welcomeVisibility.opacity,
                    }}
                >
                    <p className="welcome-text">
                        Welcome to my little corner of the internet...
                    </p>
                </div>
            )}
        </>
    );
}
