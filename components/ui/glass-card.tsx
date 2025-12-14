"use client"

import { memo, ReactNode } from "react"
import { motion, LazyMotion, domAnimation } from "framer-motion"

interface GlassCardProps {
    children: ReactNode
    className?: string
    variant?: "default" | "premium" | "gradient-border" | "animated-border"
    glow?: "none" | "pink" | "purple" | "blue" | "emerald"
    hover?: boolean
}

function GlassCardComponent({
    children,
    className = "",
    variant = "default",
    glow = "none",
    hover = true,
}: GlassCardProps) {
    const getVariantClasses = () => {
        switch (variant) {
            case "premium":
                return "glass-premium"
            case "gradient-border":
                return "gradient-border"
            case "animated-border":
                return "animated-border"
            default:
                return "glass-card"
        }
    }

    const getGlowClasses = () => {
        switch (glow) {
            case "pink":
                return "neon-glow-pink"
            case "purple":
                return "neon-glow-purple"
            case "blue":
                return "neon-glow-blue"
            case "emerald":
                return "neon-glow-emerald"
            default:
                return ""
        }
    }

    return (
        <LazyMotion features={domAnimation}>
            <motion.div
                className={`
                    rounded-3xl overflow-hidden
                    ${getVariantClasses()}
                    ${getGlowClasses()}
                    ${hover ? "hover-lift card-shine" : ""}
                    ${className}
                `}
                whileHover={hover ? { scale: 1.01 } : undefined}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                {children}
            </motion.div>
        </LazyMotion>
    )
}

export const GlassCard = memo(GlassCardComponent)
