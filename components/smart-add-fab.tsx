"use client"

import Link from "next/link"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, LazyMotion, domAnimation } from "framer-motion"
import { usePathname } from "next/navigation"
import { memo } from "react"

function SmartAddFabComponent() {
    const pathname = usePathname()
    // Don't show on the smart-add page itself to avoid clutter
    if (pathname === "/smart-add") return null

    return (
        <LazyMotion features={domAnimation}>
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                }}
                className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-50"
            >
                <Link href="/smart-add" prefetch={true}>
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative"
                    >
                        {/* Outer glow ring */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 blur-xl opacity-50 animate-pulse" />

                        {/* Animated border ring */}
                        <motion.div
                            className="absolute -inset-1 rounded-full"
                            style={{
                                background: "conic-gradient(from 0deg, #ec4899, #8b5cf6, #6366f1, #ec4899)",
                            }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        />

                        {/* Main button */}
                        <Button
                            size="icon"
                            className="relative h-14 w-14 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 border-0 group overflow-hidden"
                        >
                            {/* Inner shimmer */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                            <Sparkles className="h-6 w-6 text-white relative z-10 group-hover:animate-spin" style={{ animationDuration: '2s' }} />
                            <span className="sr-only">Smart Add</span>
                        </Button>
                    </motion.div>
                </Link>
            </motion.div>
        </LazyMotion>
    )
}

export const SmartAddFab = memo(SmartAddFabComponent)
