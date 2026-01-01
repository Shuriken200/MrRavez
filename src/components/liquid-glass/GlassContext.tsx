"use client";

import { createContext, useContext, ReactNode } from "react";
import type Container from "@/lib/liquid-glass/container";

interface GlassContextValue {
    container: Container | null;
}

const GlassContext = createContext<GlassContextValue>({ container: null });

export function useGlassContainer() {
    return useContext(GlassContext).container;
}

export function GlassProvider({ container, children }: { container: Container | null; children: ReactNode }) {
    return (
        <GlassContext.Provider value={{ container }}>
            {children}
        </GlassContext.Provider>
    );
}
