"use client"

import { motion, HTMLMotionProps, LazyMotion, domAnimation } from "framer-motion"
import { memo } from "react"

// Brand-aligned spring transition
const springTransition = {
    type: "spring" as const,
    stiffness: 100,
    damping: 15,
    mass: 1,
}

// Variants
export const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: springTransition },
    exit: { opacity: 0, y: 10 },
}

export const slideUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: springTransition },
    exit: { opacity: 0, y: 20 },
}

export const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
}

// Types
interface MotionComponentProps extends HTMLMotionProps<"div"> {
    delay?: number
}

// Wrap motion components with LazyMotion for smaller bundle
function MotionDivComponent({ children, className, delay = 0, ...props }: MotionComponentProps) {
    return (
        <LazyMotion features={domAnimation}>
            <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={fadeIn}
                transition={{ ...springTransition, delay }}
                className={className}
                {...props}
            >
                {children}
            </motion.div>
        </LazyMotion>
    )
}

function MotionListComponent({ children, className, ...props }: HTMLMotionProps<"div">) {
    return (
        <LazyMotion features={domAnimation}>
            <motion.div
                initial="initial"
                animate="animate"
                variants={staggerContainer}
                className={className}
                {...props}
            >
                {children}
            </motion.div>
        </LazyMotion>
    )
}

function MotionItemComponent({ children, className, ...props }: HTMLMotionProps<"div">) {
    return (
        <LazyMotion features={domAnimation}>
            <motion.div
                variants={slideUp}
                className={className}
                {...props}
            >
                {children}
            </motion.div>
        </LazyMotion>
    )
}

// Export memoized components
export const MotionDiv = memo(MotionDivComponent)
export const MotionList = memo(MotionListComponent)
export const MotionItem = memo(MotionItemComponent)
