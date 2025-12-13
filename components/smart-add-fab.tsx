"use client"

import Link from "next/link"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function SmartAddFab() {
    const pathname = usePathname()
    // Don't show on the smart-add page itself to avoid clutter
    if (pathname === "/smart-add") return null

    return (
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
            <Link href="/smart-add">
                <Button
                    size="icon"
                    className="h-14 w-14 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 shadow-xl hover:shadow-pink-500/40 transition-all duration-300 border-0 group"
                >
                    <Sparkles className="h-6 w-6 text-white group-hover:animate-pulse" />
                    <span className="sr-only">Smart Add</span>
                </Button>
            </Link>
        </motion.div>
    )
}
