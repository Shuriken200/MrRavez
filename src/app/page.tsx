"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { ThemeToggle } from "@/components";
import { useTheme } from "@/components/providers";
import { OrbField } from "@/components/orb-field";
import { ProfileCardLive } from "@/components/liquid-glass/ProfileCardLive";

export default function HomePage() {
    const [stage, setStage] = useState(0);
    const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
    const [scrollProgress, setScrollProgress] = useState(0);
    const rafRef = useRef<number | undefined>(undefined);
    const { theme } = useTheme();

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (rafRef.current) return;
        rafRef.current = requestAnimationFrame(() => {
            setMousePos({
                x: e.clientX / window.innerWidth,
                y: e.clientY / window.innerHeight,
            });
            rafRef.current = undefined;
        });
    }, []);

    // Handle scroll for fade transitions
    const handleScroll = useCallback(() => {
        const scrollY = window.scrollY;
        const viewportHeight = window.innerHeight;
        // Progress from 0 to 1 over the first viewport height of scrolling
        const progress = Math.min(1, Math.max(0, scrollY / viewportHeight));
        setScrollProgress(progress);
    }, []);

    useEffect(() => {
        const timer1 = setTimeout(() => setStage(1), 1500);
        const timer2 = setTimeout(() => setStage(2), 6000);
        const timer3 = setTimeout(() => setStage(3), 7500);

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            window.removeEventListener('mousemove', handleMouseMove);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [handleMouseMove]);

    // Add scroll listener and enable scrolling after stage 3 (animations complete)
    useEffect(() => {
        if (stage >= 3) {
            // Enable scrolling by directly setting body overflow and min-height
            document.body.style.overflowY = 'auto';
            document.body.style.minHeight = '200vh';
            document.documentElement.style.overflowY = 'auto';
            
            window.addEventListener('scroll', handleScroll);
            // Use requestAnimationFrame to defer the initial scroll check
            const rafId = requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                const viewportHeight = window.innerHeight;
                const progress = Math.min(1, Math.max(0, scrollY / viewportHeight));
                setScrollProgress(progress);
            });
            return () => {
                window.removeEventListener('scroll', handleScroll);
                cancelAnimationFrame(rafId);
                document.body.style.minHeight = '';
            };
        } else {
            // Disable scrolling before stage 3
            document.body.style.overflowY = 'hidden';
            document.body.style.minHeight = '100vh';
            document.documentElement.style.overflowY = 'hidden';
        }
    }, [stage, handleScroll]);

    // Calculate opacities based on scroll progress
    const greetingOpacity = 1 - scrollProgress;
    const profileCardOpacity = scrollProgress;

    return (
        <>
            <style jsx global>{`
                html, body {
                    background: #000000 !important;
                    overflow-x: hidden;
                }
            `}</style>

            <style jsx>{`
                .homepage {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: fixed;
                    inset: 0;
                    background: #000000;
                    transition: background 0.8s ease;
                }
                
                .homepage.popped {
                    background: ${theme === 'light' ? '#e8e4e0' : '#000000'};
                }
                
                .greeting {
                    font-size: clamp(5rem, 20vw, 14rem);
                    font-weight: 700;
                    letter-spacing: -0.04em;
                    color: #000000;
                    transform: scale(0.7);
                    transition: 
                        color 8s cubic-bezier(0.4, 0, 0.2, 1),
                        transform 10s cubic-bezier(0.16, 1, 0.3, 1),
                        text-shadow 5s ease 3s;
                    position: relative;
                    z-index: 10;
                    visibility: hidden;
                    user-select: none;
                    -webkit-user-select: none;
                    pointer-events: none;
                }
                
                .greeting.emerging {
                    visibility: visible;
                    color: #888888;
                    transform: scale(0.9);
                    text-shadow: 
                        0 0 60px rgba(78, 5, 6, 0.4),
                        0 0 120px rgba(78, 5, 6, 0.2);
                }
                
                .greeting.popped {
                    color: ${theme === 'light' ? '#1a1a1a' : '#ffffff'};
                    transform: scale(1);
                    transition: 
                        color 0.8s cubic-bezier(0.34, 1.56, 0.64, 1),
                        transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1),
                        text-shadow 0.5s ease;
                    text-shadow: 
                        0 0 100px rgba(78, 5, 6, 0.8),
                        0 0 200px rgba(78, 5, 6, 0.4),
                        0 0 300px rgba(78, 5, 6, 0.2);
                }
                
                .theme-toggle-wrapper {
                    opacity: 0;
                    visibility: hidden;
                    transition: opacity 0.5s ease;
                    pointer-events: none;
                    position: relative;
                    z-index: 100;
                }
                
                .theme-toggle-wrapper.visible {
                    visibility: visible;
                    opacity: 1;
                    pointer-events: auto;
                }
            `}</style>

            {/* Fixed viewport content */}
            <main className={`homepage ${stage >= 2 ? 'popped' : ''}`}>
                <OrbField
                    visible={stage >= 2}
                    mouseX={mousePos.x}
                    mouseY={mousePos.y}
                />

                <div className={`theme-toggle-wrapper ${stage >= 3 ? 'visible' : ''}`}>
                    <ThemeToggle />
                </div>

                {/* Greeting with scroll-based fade out */}
                <h1 
                    className={`greeting ${stage >= 1 ? 'emerging' : ''} ${stage >= 2 ? 'popped' : ''}`}
                    style={{ 
                        opacity: stage >= 3 ? greetingOpacity : undefined,
                        visibility: greetingOpacity <= 0 ? 'hidden' : undefined,
                    }}
                >
                    Hi!
                </h1>

                {/* Profile card with scroll-based fade in - pre-rendered but hidden */}
                <ProfileCardLive opacity={stage >= 3 ? profileCardOpacity : 0} />
            </main>

        </>
    );
}
