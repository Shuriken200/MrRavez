"use client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

// ============================================================================
// Query Client
// ============================================================================

function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60 * 60,
                gcTime: 1000 * 60 * 60 * 24,
                retry: 1,
            },
        },
    });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
    if (typeof window === "undefined") {
        return makeQueryClient();
    }
    if (!browserQueryClient) {
        browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
}

// ============================================================================
// Theme Context
// ============================================================================

type Theme = "light" | "dark";

type ThemeContextValue = {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}

// ============================================================================
// Providers Component - All providers in one place
// ============================================================================

type ProvidersProps = {
    children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
    const queryClient = getQueryClient();
    const [theme, setThemeState] = useState<Theme>("dark");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem("theme") as Theme | null;
        if (stored) {
            setThemeState(stored);
        } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
            setThemeState("light");
        }
    }, []);

    useEffect(() => {
        if (!mounted) return;
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme, mounted]);

    const toggleTheme = () => {
        setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
    };

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
    };

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
                {children}
            </ThemeContext.Provider>
        </QueryClientProvider>
    );
}
