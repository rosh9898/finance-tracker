"use client"

import { memo, useEffect, useRef } from "react"
import { motion, LazyMotion, domAnimation } from "framer-motion"

function AnimatedBackgroundComponent() {
    return (
        <LazyMotion features={domAnimation}>
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                {/* Base gradient */}
                <div className="absolute inset-0 mesh-gradient" />

                {/* Floating Orbs */}
                <motion.div
                    className="floating-orb floating-orb-1"
                    animate={{
                        x: [0, 50, -30, 20, 0],
                        y: [0, -30, 20, -10, 0],
                        scale: [1, 1.1, 0.95, 1.05, 1],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="floating-orb floating-orb-2"
                    animate={{
                        x: [0, -40, 30, -20, 0],
                        y: [0, 40, -20, 30, 0],
                        scale: [1, 0.9, 1.1, 0.95, 1],
                    }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 5,
                    }}
                />
                <motion.div
                    className="floating-orb floating-orb-3"
                    animate={{
                        x: [0, 30, -50, 40, 0],
                        y: [0, -20, 30, -40, 0],
                        scale: [1, 1.05, 0.9, 1.1, 1],
                    }}
                    transition={{
                        duration: 35,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 10,
                    }}
                />

                {/* Subtle grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: '50px 50px',
                    }}
                />

                {/* Noise texture */}
                <div className="absolute inset-0 noise-overlay" />
            </div>
        </LazyMotion>
    )
}

export const AnimatedBackground = memo(AnimatedBackgroundComponent)
