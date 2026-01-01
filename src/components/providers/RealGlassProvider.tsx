"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

interface RealGlassContextType {
    realGlass: any; // Type is dynamic from the library
    isReady: boolean;
}

const RealGlassContext = createContext<RealGlassContextType>({
    realGlass: null,
    isReady: false,
});

export const useRealGlass = () => useContext(RealGlassContext);

export function RealGlassProvider({ children }: { children: React.ReactNode }) {
    const [realGlassInstance, setRealGlassInstance] = useState<any>(null);
    const [isReady, setIsReady] = useState(false);
    const initializing = useRef(false);

    useEffect(() => {
        if (initializing.current) return;
        initializing.current = true;

        const init = async () => {
            try {
                // Wait for initial render/animations to settle
                // The delay needs to be long enough for the R3F canvas to render the orbs
                await new Promise((r) => setTimeout(r, 1000));

                // @ts-ignore
                await import("realglass");

                // Fallback to window.RealGlass if module export fails
                // @ts-ignore
                const RealGlass = window.RealGlass;

                if (!RealGlass) {
                    console.error("RealGlass not found on window");
                    return;
                }

                const instance = new RealGlass();

                // Initialize captures the screen
                await instance.init();

                setRealGlassInstance(instance);
                setIsReady(true);
            } catch (err) {
                console.error("Failed to initialize RealGlass", err);
            }
        };

        if (typeof window !== "undefined") {
            // Wait for window load to ensure everything is painted
            if (document.readyState === "complete") {
                init();
            } else {
                window.addEventListener("load", init);
                return () => window.removeEventListener("load", init);
            }
        }
    }, []);

    return (
        <RealGlassContext.Provider value={{ realGlass: realGlassInstance, isReady }}>
            {children}
        </RealGlassContext.Provider>
    );
}
