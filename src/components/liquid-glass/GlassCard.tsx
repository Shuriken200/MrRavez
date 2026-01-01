"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import { GlassProvider } from "./GlassContext";
import "@/lib/liquid-glass/glass.css";

interface GlassCardProps {
    children?: ReactNode;
    className?: string;
    style?: React.CSSProperties;
    borderRadius?: number;
    tintOpacity?: number;
    type?: 'rounded' | 'circle' | 'pill';
}

export function GlassCard({
    children,
    className,
    style,
    borderRadius = 24,
    tintOpacity = 0.2,
    type = 'rounded'
}: GlassCardProps) {
    const mountRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<any>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        let mounted = true;

        const init = async () => {
            if (!mountRef.current) return;

            // Load html2canvas
            const html2canvas = (await import("html2canvas")).default;
            window.html2canvas = html2canvas;

            // Import Container
            const { Container } = await import("@/lib/liquid-glass");

            if (!mounted || !mountRef.current) return;

            // Wait for images
            const images = document.querySelectorAll('img');
            await Promise.all(
                Array.from(images).map(img => {
                    if (img.complete) return Promise.resolve();
                    return new Promise(resolve => {
                        img.onload = resolve;
                        img.onerror = resolve;
                    });
                })
            );

            await new Promise(r => setTimeout(r, 200));

            if (!mounted) return;

            // Reset snapshot for fresh capture
            Container.pageSnapshot = null;

            // Create Container
            const instance = new Container({
                type,
                borderRadius,
                tintOpacity
            });

            containerRef.current = instance;

            if (instance.element) {
                // Apply styles
                if (style) {
                    Object.assign(instance.element.style, style);
                }
                if (className) {
                    className.split(' ').forEach(cls => {
                        if (cls) instance.element?.classList.add(cls);
                    });
                }

                // Default flex column layout for children
                instance.element.style.flexDirection = 'column';

                mountRef.current.appendChild(instance.element);
                setIsReady(true);
            }
        };

        init();

        return () => {
            mounted = false;
            if (containerRef.current?.element?.parentNode) {
                containerRef.current.element.parentNode.removeChild(containerRef.current.element);
            }
            containerRef.current = null;
        };
    }, [type, borderRadius, tintOpacity]);

    // Apply dynamic styles when style prop changes
    useEffect(() => {
        if (containerRef.current?.element && style) {
            Object.assign(containerRef.current.element.style, style);
        }
    }, [style]);

    return (
        <div ref={mountRef} style={{ display: 'contents' }}>
            {isReady && (
                <GlassProvider container={containerRef.current}>
                    <GlassCardContent container={containerRef.current}>
                        {children}
                    </GlassCardContent>
                </GlassProvider>
            )}
        </div>
    );
}

// Render children into the container's element
import { createPortal } from "react-dom";

function GlassCardContent({ container, children }: { container: any; children: ReactNode }) {
    const [contentEl, setContentEl] = useState<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!container?.element) return;

        const div = document.createElement('div');
        div.style.position = 'relative';
        div.style.zIndex = '1';
        div.style.width = '100%';
        div.style.display = 'flex';
        div.style.flexDirection = 'column';
        div.style.gap = '16px';

        container.element.appendChild(div);
        setContentEl(div);

        // Use ResizeObserver to keep container sized to content
        const observer = new ResizeObserver(() => {
            container.updateSizeFromDOM();
        });
        observer.observe(div);
        observer.observe(container.element);

        // Initial size update
        requestAnimationFrame(() => {
            container.updateSizeFromDOM();
        });

        return () => {
            observer.disconnect();
            if (div.parentNode) div.parentNode.removeChild(div);
        };
    }, [container]);

    if (!contentEl) return null;
    return createPortal(children, contentEl);
}
