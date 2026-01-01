"use client";

import { RealGlassProvider } from "@/components/providers/RealGlassProvider";
import { GlassPanel } from "@/components/ui/GlassPanel";

export default function GlassTestPage() {
    return (
        <RealGlassProvider>
            <div
                style={{
                    width: "100vw",
                    height: "100vh",
                    background: "linear-gradient(45deg, #05020a 0%, #1a0b36 50%, #004455 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    overflow: "hidden"
                }}
            >
                {/* Background elements to prove transparency */}
                <div style={{
                    position: "absolute",
                    top: "20%",
                    left: "20%",
                    width: "300px",
                    height: "300px",
                    background: "radial-gradient(circle, rgba(255,0,0,0.8) 0%, rgba(255,0,0,0) 70%)",
                    borderRadius: "50%",
                }} />

                <div style={{
                    position: "absolute",
                    bottom: "10%",
                    right: "15%",
                    width: "250px",
                    height: "250px",
                    background: "radial-gradient(circle, rgba(0,255,100,0.6) 0%, rgba(0,255,100,0) 70%)",
                    borderRadius: "50%",
                }} />

                <div style={{
                    position: "absolute",
                    top: "40%",
                    right: "30%",
                    width: "150px",
                    height: "150px",
                    background: "linear-gradient(135deg, #ff00cc, #333399)",
                    borderRadius: "20px",
                    transform: "rotate(45deg)"
                }} />

                <div style={{
                    position: "absolute",
                    bottom: "30%",
                    left: "30%",
                    width: "100px",
                    height: "400px",
                    background: "linear-gradient(to top, #00d4ff, transparent)",
                    transform: "rotate(-15deg)",
                    opacity: 0.5
                }} />

                <GlassPanel
                    style={{
                        width: "400px",
                        height: "200px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        textAlign: "center"
                    }}
                >
                    <div style={{ padding: 20 }}>
                        Glass Effect Test
                        <p style={{ fontSize: "1rem", marginTop: 10, opacity: 0.8 }}>
                            If you can see the red circle blurred behind this, it works.
                        </p>
                    </div>
                </GlassPanel>
            </div>
        </RealGlassProvider>
    );
}
