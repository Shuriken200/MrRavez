"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import { createPortal } from "react-dom";
import { useGlassContainer } from "./GlassContext";

interface GlassButtonProps {
    children?: ReactNode;
    text?: string;
    onClick?: () => void;
    type?: 'rounded' | 'circle' | 'pill';
    size?: number;
    tintOpacity?: number;
    className?: string;
    style?: React.CSSProperties;
}

export function GlassButton({
    children,
    text = '',
    onClick,
    type = 'pill',
    size = 18,
    tintOpacity = 0.2,
    className,
    style
}: GlassButtonProps) {
    const parentContainer = useGlassContainer();
    const mountRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<any>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (!parentContainer || !mountRef.current) return;

        let mounted = true;

        const init = async () => {
            const { Button } = await import("@/lib/liquid-glass");

            if (!mounted || !mountRef.current) return;

            // Create Button
            const instance = new Button({
                text: text || ' ',
                size,
                type,
                tintOpacity,
                onClick: onClick ? () => onClick() : undefined
            });

            buttonRef.current = instance;

            // Add as child to parent container for nested glass
            parentContainer.addChild(instance);

            if (instance.element) {
                // Override the library's auto-sizing - allow flexible sizing
                instance.element.style.width = '';
                instance.element.style.height = '';
                instance.element.style.minWidth = '';
                instance.element.style.minHeight = '';
                instance.element.style.maxWidth = '';
                instance.element.style.maxHeight = '';

                // Apply user styles AFTER clearing auto-sizing
                if (style) {
                    Object.assign(instance.element.style, style);
                }
                if (className) {
                    className.split(' ').forEach(cls => {
                        if (cls) instance.element?.classList.add(cls);
                    });
                }

                // Hide default text if we have children
                if (children) {
                    const textEl = instance.element.querySelector('.glass-button-text');
                    if (textEl) (textEl as HTMLElement).style.display = 'none';
                }

                mountRef.current.appendChild(instance.element);

                // Force size update after styles applied
                requestAnimationFrame(() => {
                    instance.updateSizeFromDOM();
                    setIsReady(true);
                });
            }
        };

        init();

        return () => {
            mounted = false;
            if (parentContainer && buttonRef.current) {
                parentContainer.removeChild(buttonRef.current);
            }
            if (buttonRef.current?.element?.parentNode) {
                buttonRef.current.element.parentNode.removeChild(buttonRef.current.element);
            }
            buttonRef.current = null;
        };
    }, [parentContainer, type, size, tintOpacity, text]);

    // Handle onClick changes
    useEffect(() => {
        if (buttonRef.current?.element && onClick) {
            buttonRef.current.element.onclick = (e: MouseEvent) => {
                e.preventDefault();
                onClick();
            };
        }
    }, [onClick]);

    return (
        <div ref={mountRef} style={{ display: 'contents' }}>
            {isReady && children && buttonRef.current?.element && (
                <ButtonContent button={buttonRef.current}>
                    {children}
                </ButtonContent>
            )}
        </div>
    );
}

// Render children into the button's element
function ButtonContent({ button, children }: { button: any; children: ReactNode }) {
    const [contentEl, setContentEl] = useState<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!button?.element) return;

        const div = document.createElement('div');
        div.style.position = 'relative';
        div.style.zIndex = '1';
        div.style.width = '100%';
        div.style.height = '100%';
        div.style.display = 'flex';
        div.style.alignItems = 'center';

        button.element.appendChild(div);
        setContentEl(div);

        // Trigger size update after content added
        requestAnimationFrame(() => {
            button.updateSizeFromDOM();
        });

        return () => {
            if (div.parentNode) div.parentNode.removeChild(div);
        };
    }, [button]);

    if (!contentEl) return null;
    return createPortal(children, contentEl);
}
